const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const Tail = require('tail').Tail;
const WebSocket = require('ws');

const PORT = Number(process.env.MICRODAGR_BRIDGE_PORT || 8080);
const MAP_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

// Locate Arma 3 AppData path correctly based on OS environment.
const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Local');
const userProfile = process.env.USERPROFILE || '';
const arma3Dir = path.join(localAppData, 'Arma 3');
const mapCacheDir = path.join(localAppData, 'MicroDAGRBridge', 'maps');

let tail = null;
let currentRPT = null;
let latestTelemetry = null;
let lastTelemetryAt = 0;
const markerSyncState = {
  list: [],
  pendingReset: false,
};
const mapBuildPromises = new Map();
const mapRefreshPromises = new Map();
const mapMetadata = new Map();
const mapRebuildOnce = new Set();
const MAX_RPT_JSON_BYTES = parsePositiveInt(process.env.MICRODAGR_MAX_RPT_JSON_BYTES, 32768);
const MAX_WS_FRAME_BYTES = parsePositiveInt(process.env.MICRODAGR_MAX_WS_FRAME_BYTES, 24576);
const MAX_MARKER_CHUNK_ITEMS = parsePositiveInt(process.env.MICRODAGR_MAX_MARKER_CHUNK_ITEMS, 24);
const MAX_MARKER_POINTS = parsePositiveInt(process.env.MICRODAGR_MAX_MARKER_POINTS, 12);
const BACKGROUND_TOPO_REFRESH_ENABLED = parseBool(process.env.MICRODAGR_BACKGROUND_TOPO_REFRESH, true);
const BACKGROUND_TOPO_REFRESH_MS = parsePositiveInt(process.env.MICRODAGR_BACKGROUND_TOPO_REFRESH_MS, 15000);
const FORCE_PBO_ONLY = parseBool(process.env.MICRODAGR_FORCE_PBO_ONLY, false);
const ATLAS_ENABLED = parseBool(process.env.MICRODAGR_ATLAS_ENABLED, true);
const PBO_LAYERS_ENABLED = parseBool(process.env.MICRODAGR_PBO_LAYERS_ENABLED, true);
const PREFER_PBO_LAYERS = parseBool(process.env.MICRODAGR_PREFER_PBO_LAYERS, false);
const NATIVE_ALLOW_ATLAS_FALLBACK = parseBool(process.env.MICRODAGR_NATIVE_ALLOW_ATLAS_FALLBACK, false);
const HIGH_RES_REBUILD_ON_CACHE = parseBool(process.env.MICRODAGR_HIGH_RES_REBUILD_ON_CACHE, true);
const EXTRACT_TIMEOUT_MS = parsePositiveInt(process.env.MICRODAGR_MAP_EXTRACT_TIMEOUT_MS, 900000);
const EXTRACT_STALL_TIMEOUT_MS = parsePositiveInt(process.env.MICRODAGR_MAP_EXTRACT_STALL_TIMEOUT_MS, 180000);
const DEFAULT_MAP_LAYER = 'atlas';

let lastOversizeTelemetryLogMs = 0;
const lastBackgroundRefreshMs = new Map();
const highResRebuildOnce = new Set();

fs.mkdirSync(mapCacheDir, { recursive: true });

console.log('[Bridge] Starting Arma 3 Telemetry + Map Bridge');
console.log(`[Bridge] Listening on port ${PORT}`);
console.log(`[Bridge] Looking for RPT files in: ${arma3Dir}`);
console.log(`[Bridge] Map cache dir: ${mapCacheDir}`);

function normalizeWorldKey(worldName) {
  return String(worldName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
}

function normalizeMapLayer(layerName) {
  const normalized = String(layerName || '').trim().toLowerCase();
  if (['native', 'native2048', 'picturemap', 'pbo', 'legacy'].includes(normalized)) return 'native';
  return 'atlas';
}

function getLayerCacheBase(worldKey, layerName) {
  const layer = normalizeMapLayer(layerName);
  return `${worldKey}_${layer}`;
}

function getLayerMapKey(worldKey, layerName) {
  const layer = normalizeMapLayer(layerName);
  return `${worldKey}:${layer}`;
}

function getLayerEnvOverrides(layerName) {
  const layer = normalizeMapLayer(layerName);
  if (layer === 'native') {
    return {
      MICRODAGR_FORCE_PBO_ONLY: '1',
      MICRODAGR_PBO_LAYERS_ENABLED: '1',
      MICRODAGR_PREFER_PBO_LAYERS: '1',
      MICRODAGR_ATLAS_ENABLED: '0',
      MICRODAGR_ATLAS_FORCE: '0',
      MICRODAGR_PREFER_NATIVE_MAPS: '1',
      MICRODAGR_MAP_STYLE: 'satellite',
      MICRODAGR_PBO_LAYERS_FORCE_SQUARE: '0',
    };
  }

  return {
    MICRODAGR_FORCE_PBO_ONLY: '0',
    MICRODAGR_ATLAS_ENABLED: '1',
    MICRODAGR_ATLAS_FORCE: '1',
    MICRODAGR_PREFER_NATIVE_MAPS: '0',
    MICRODAGR_PBO_LAYERS_ENABLED: '0',
    MICRODAGR_PREFER_PBO_LAYERS: '0',
    MICRODAGR_MAP_STYLE: 'topographic',
  };
}

function getLatestRPTFile() {
  try {
    const files = fs.readdirSync(arma3Dir)
      .filter((f) => f.toLowerCase().endsWith('.rpt'))
      .map((f) => ({ name: f, time: fs.statSync(path.join(arma3Dir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 0) {
      return path.join(arma3Dir, files[0].name);
    }
  } catch (err) {
    console.error('[Bridge] Failed to read Arma 3 directory:', err.message);
  }
  return null;
}

function findCachedMap(worldKey) {
  for (const ext of MAP_EXTENSIONS) {
    const fileName = `${worldKey}${ext}`;
    const fullPath = path.join(mapCacheDir, fileName);
    if (fs.existsSync(fullPath)) {
      return { fileName, fullPath };
    }
  }
  return null;
}

function isAutoPlaceholderSvg(filePath) {
  if (path.extname(filePath).toLowerCase() !== '.svg') return false;

  try {
    const preview = fs.readFileSync(filePath, 'utf8');
    return preview.includes('AUTO PLACEHOLDER');
  } catch {
    return false;
  }
}

function deleteCachedMap(worldKey) {
  for (const ext of MAP_EXTENSIONS) {
    const fullPath = path.join(mapCacheDir, `${worldKey}${ext}`);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
  mapMetadata.delete(worldKey);
}

function setMapMeta(worldKey, patch) {
  const previous = mapMetadata.get(worldKey) || {};
  mapMetadata.set(worldKey, {
    ...previous,
    ...patch,
    updatedAt: Date.now(),
  });
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

function clampPercent(value, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function inferMapProgress(meta = {}) {
  if (meta && Number.isFinite(Number(meta.progress))) {
    return clampPercent(meta.progress);
  }

  const status = String(meta?.status || '').toLowerCase();
  const message = String(meta?.message || '').toLowerCase();

  if (status === 'ready') return 100;
  if (status === 'refreshing') return 72;
  if (status === 'extract-failed') return 82;
  if (status === 'unavailable') return 0;
  if (message.includes('preparing')) return 12;
  if (message.includes('scanning')) return 24;
  if (message.includes('extractor')) return 55;
  if (message.includes('placeholder')) return 92;
  if (status === 'building') return 30;
  return 15;
}

function logOversizeTelemetryOnce(message) {
  const now = Date.now();
  if ((now - lastOversizeTelemetryLogMs) < 5000) return;
  lastOversizeTelemetryLogMs = now;
  console.warn(message);
}

function clampMarkerEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;

  const marker = { ...entry };
  if (Array.isArray(marker.p) && marker.p.length > MAX_MARKER_POINTS) {
    marker.p = marker.p.slice(0, MAX_MARKER_POINTS);
  }

  return marker;
}

function clampPayloadForTransport(payload) {
  if (!payload || typeof payload !== 'object') return payload;

  const next = { ...payload };
  const markerKey = Array.isArray(next.mapMarkersChunk)
    ? 'mapMarkersChunk'
    : (Array.isArray(next.mapMarkers) ? 'mapMarkers' : null);

  if (!markerKey) return next;

  const source = next[markerKey];
  const capped = [];
  let frameBytes = 256;

  for (const item of source) {
    if (capped.length >= MAX_MARKER_CHUNK_ITEMS) break;

    const marker = clampMarkerEntry(item);
    if (!marker) continue;

    const itemBytes = Buffer.byteLength(JSON.stringify(marker), 'utf8');
    if ((frameBytes + itemBytes) > MAX_WS_FRAME_BYTES) {
      if (capped.length > 0) break;
      // Even a single marker can be too large in extreme custom marker cases.
      continue;
    }

    capped.push(marker);
    frameBytes += itemBytes;
  }

  next[markerKey] = capped;
  if (capped.length !== source.length) {
    next.mapMarkersTrimmed = true;
    next.mapMarkersTrimmedFrom = source.length;
  }

  return next;
}

function updateMarkerSnapshotFromPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;

  let touched = false;

  if (Array.isArray(payload.mapMarkers)) {
    markerSyncState.list = payload.mapMarkers
      .map((item) => clampMarkerEntry(item))
      .filter(Boolean);
    markerSyncState.pendingReset = false;
    touched = true;
  } else {
    if (payload.mapMarkersReset === true) {
      markerSyncState.pendingReset = true;
      touched = true;
    }

    if (Array.isArray(payload.mapMarkersChunk)) {
      const chunk = payload.mapMarkersChunk
        .map((item) => clampMarkerEntry(item))
        .filter(Boolean);

      if (markerSyncState.pendingReset) {
        markerSyncState.list = [];
        markerSyncState.pendingReset = false;
      }

      markerSyncState.list = [...markerSyncState.list, ...chunk];
      touched = true;
    }
  }

  if (!touched) return null;
  return markerSyncState.list;
}

function collectOtherProfileTileDirs(worldKey) {
  const root = path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles');
  if (!fs.existsSync(root)) return [];

  let entries = [];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return [];
  }

  const dirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const profileRoot = path.join(root, entry.name);
    dirs.push(path.join(profileRoot, 'MapExports', worldKey, 'tiles'));
    dirs.push(path.join(profileRoot, 'Screenshots', 'MicroDAGR', 'MapExports', worldKey, 'tiles'));
  }

  return dirs;
}

function collectOtherProfileScreenshotDirs() {
  const root = path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles');
  if (!fs.existsSync(root)) return [];

  let entries = [];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return [];
  }

  const dirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const profileRoot = path.join(root, entry.name);
    dirs.push(path.join(profileRoot, 'Screenshots'));
  }

  return dirs;
}

function getTileExportInfo(worldKey) {
  const minTileCount = parsePositiveInt(process.env.MICRODAGR_MAP_TILE_MIN_COUNT, 4);
  const explicitDirs = String(process.env.MICRODAGR_MAP_TILE_EXPORT_DIR || '')
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const candidateDirs = [
    ...explicitDirs,
    path.join(userProfile, 'Documents', 'Arma 3', 'MapExports', worldKey, 'tiles'),
    path.join(userProfile, 'Documents', 'Arma 3', 'Screenshots', 'MicroDAGR', 'MapExports', worldKey, 'tiles'),
    ...collectOtherProfileTileDirs(worldKey),
  ];

  for (const dir of candidateDirs) {
    if (!fs.existsSync(dir)) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    let tileCount = 0;
    let newestMtimeMs = 0;

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/^tile_\d+_\d+\.png$/i.test(entry.name)) continue;

      tileCount += 1;
      try {
        const mtime = fs.statSync(path.join(dir, entry.name)).mtimeMs;
        if (mtime > newestMtimeMs) newestMtimeMs = mtime;
      } catch {
        // Ignore single tile stat errors.
      }
    }

    if (tileCount >= minTileCount && newestMtimeMs > 0) {
      return { dir, tileCount, newestMtimeMs };
    }
  }

  const normalizedWorld = String(worldKey || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');

  const flatDirs = [
    ...String(process.env.MICRODAGR_MAP_TILE_EXPORT_FLAT_DIR || '')
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean),
    path.join(userProfile, 'Documents', 'Arma 3', 'Screenshots'),
    path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles', 'Screenshots'),
    ...collectOtherProfileScreenshotDirs(),
  ];

  for (const dir of flatDirs) {
    if (!fs.existsSync(dir)) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    let tileCount = 0;
    let newestMtimeMs = 0;

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const match = /^microdagr_([a-z0-9_\-]+)_tile_(\d+)_(\d+)\.png$/i.exec(entry.name);
      if (!match) continue;

      const fileWorld = String(match[1] || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_\-]/g, '');
      if (fileWorld !== normalizedWorld) continue;

      tileCount += 1;
      try {
        const mtime = fs.statSync(path.join(dir, entry.name)).mtimeMs;
        if (mtime > newestMtimeMs) newestMtimeMs = mtime;
      } catch {
        // Ignore single tile stat errors.
      }
    }

    if (tileCount >= minTileCount && newestMtimeMs > 0) {
      return { dir, tileCount, newestMtimeMs };
    }
  }

  return null;
}

function sourceLooksPreferredTopographic(source) {
  const normalized = String(source || '').toLowerCase();
  if (!normalized) return false;
  return normalized.startsWith('tile-export') || normalized.startsWith('atlas-tiles') || normalized.startsWith('pbo-layers') || normalized.startsWith('pbo:');
}

function scheduleBackgroundTopoRefresh(worldName, worldKey, tileExport, sourceHint = '') {
  if (!BACKGROUND_TOPO_REFRESH_ENABLED) return;
  if (FORCE_PBO_ONLY) return;
  if (!ATLAS_ENABLED) return;
  if (!worldKey) return;
  if (sourceLooksPreferredTopographic(sourceHint)) return;
  if (mapBuildPromises.has(worldKey) || mapRefreshPromises.has(worldKey)) return;

  const sourceNormalized = String(sourceHint || '').toLowerCase();
  const hasTiles = Boolean(tileExport && tileExport.tileCount > 0);
  const canUseAtlasFallback = ATLAS_ENABLED && (sourceNormalized.startsWith('pbo') || sourceNormalized === 'cache');
  if (!hasTiles && !canUseAtlasFallback) return;

  const now = Date.now();
  const lastRun = lastBackgroundRefreshMs.get(worldKey) || 0;
  if ((now - lastRun) < BACKGROUND_TOPO_REFRESH_MS) return;
  lastBackgroundRefreshMs.set(worldKey, now);

  const refreshPromise = (async () => {
    try {
      const existing = mapMetadata.get(worldKey) || {};
      if (sourceLooksPreferredTopographic(existing.source || sourceHint)) return;

      setMapMeta(worldKey, {
        status: 'refreshing',
        worldName,
        progress: 72,
        message: hasTiles
          ? `Background topo refresh (${tileExport.tileCount} tiles detected)`
          : 'Background topo refresh via Atlas fallback',
      });

      const extracted = await runExtractorCommand(worldKey, {
        envOverrides: hasTiles ? {} : {
          MICRODAGR_PREFER_NATIVE_MAPS: '0',
          MICRODAGR_ATLAS_ENABLED: '1',
          MICRODAGR_ATLAS_FORCE: '1',
          MICRODAGR_MAP_STYLE: 'topographic',
        },
      });
      const refreshed = findCachedMap(worldKey);
      if (!extracted || !refreshed) return;

      setMapMeta(worldKey, {
        status: 'ready',
        worldName,
        fileName: refreshed.fileName,
        source: extracted.source,
        progress: 100,
        message: extracted.message || 'Map refreshed in background',
        mapTransform: extracted.mapTransform || null,
      });

      console.log(`[Bridge] Background topo refresh completed for ${worldKey}. Source: ${extracted.source}`);
    } catch (error) {
      console.warn(`[Bridge] Background topo refresh failed for ${worldKey}: ${error.message}`);
    } finally {
      mapRefreshPromises.delete(worldKey);
    }
  })();

  mapRefreshPromises.set(worldKey, refreshPromise);
}

async function tryCopyFromSourceDirs(worldKey) {
  const sourceDirs = [
    process.env.MICRODAGR_MAP_SOURCE_DIR,
    path.join(process.cwd(), 'maps'),
    path.join(userProfile, 'Documents', 'Arma 3', 'MapExports'),
    path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles', 'MapExports'),
  ].filter(Boolean);

  for (const dir of sourceDirs) {
    if (!fs.existsSync(dir)) continue;

    for (const ext of MAP_EXTENSIONS) {
      const source = path.join(dir, `${worldKey}${ext}`);
      if (!fs.existsSync(source)) continue;

      const target = path.join(mapCacheDir, `${worldKey}${ext}`);
      await fsp.copyFile(source, target);
      return { source: 'copy', detail: source };
    }
  }

  return null;
}

function runExtractorCommand(worldKey, options = {}) {
  const commandTemplate = process.env.MICRODAGR_MAP_EXTRACT_CMD
    || 'node map-extractor.js --world {world} --out "{outDir}" --arma "{armaDir}" --style "topographic" --rpt "{rpt}"';
  const envOverrides = options.envOverrides || {};
  const mapMetaKey = String(options.mapKey || worldKey || 'unknown');
  const outDir = options.outDir || mapCacheDir;

  const safeWorldName = String(latestTelemetry?.worldName || worldKey || '');

  const command = commandTemplate
    .replace(/\{worldName\}/g, safeWorldName)
    .replace(/\{world\}/g, worldKey)
    .replace(/\{outDir\}/g, outDir)
    .replace(/\{cacheDir\}/g, outDir)
    .replace(/\{armaDir\}/g, arma3Dir)
    .replace(/\{rpt\}/g, currentRPT || '');

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    let lastActivityAt = startedAt;
    let settled = false;
    let lastProgress = 55;

    const settleReject = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const settleResolve = (payload) => {
      if (settled) return;
      settled = true;
      resolve(payload);
    };

    const updateExtractorProgress = (progress, message) => {
      const currentMeta = mapMetadata.get(mapMetaKey) || {};
      const currentProgress = clampPercent(currentMeta.progress, 0);
      const nextProgress = Math.max(currentProgress, clampPercent(progress, currentProgress));
      if (nextProgress < lastProgress) return;
      lastProgress = nextProgress;

      setMapMeta(mapMetaKey, {
        status: 'building',
        worldName: safeWorldName || currentMeta.worldName || worldKey,
        progress: nextProgress,
        message: message || currentMeta.message || 'Running map extractor',
      });
    };

    updateExtractorProgress(55, 'Running map extractor');

    const child = spawn(command, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...envOverrides },
    });

    let stdout = '';
    let stderr = '';
    let stdoutBuffer = '';
    const progressTicker = setInterval(() => {
      const currentMeta = mapMetadata.get(mapMetaKey) || {};
      if (String(currentMeta.status || '').toLowerCase() !== 'building') return;
      const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
      const dynamicCap = elapsedSec >= 240
        ? 97
        : elapsedSec >= 150
          ? 96
          : elapsedSec >= 90
            ? 95
            : elapsedSec >= 45
              ? 92
              : 89;
      updateExtractorProgress(Math.min(lastProgress + 1, dynamicCap), `Running map extractor (${elapsedSec}s)`);
    }, 1800);

    const stallWatcher = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - startedAt;
      const stallMs = now - lastActivityAt;

      if (elapsedMs > EXTRACT_TIMEOUT_MS) {
        clearInterval(progressTicker);
        clearInterval(stallWatcher);
        try { child.kill(); } catch {}
        settleReject(new Error(`Extractor timeout after ${Math.floor(elapsedMs / 1000)}s`));
        return;
      }

      if (stallMs > EXTRACT_STALL_TIMEOUT_MS) {
        clearInterval(progressTicker);
        clearInterval(stallWatcher);
        try { child.kill(); } catch {}
        settleReject(new Error(`Extractor stalled for ${Math.floor(stallMs / 1000)}s (no output/activity)`));
      }
    }, 2000);

    const handleExtractorLine = (rawLine) => {
      const line = String(rawLine || '').trim();
      if (!line) return;
      const lower = line.toLowerCase();

      if (lower.includes('extracting pbo layers') || lower.includes('extracting pbo for picturemap') || lower.includes('extracting pbo candidate')) {
        updateExtractorProgress(66, 'Extracting PBO content');
        return;
      }

      if (lower.includes('using exported map tiles')) {
        updateExtractorProgress(88, 'Stitching exported tiles');
        return;
      }

      if (lower.includes('using pbo layers tiles')) {
        updateExtractorProgress(92, 'Stitching high-resolution layers');
        return;
      }

      if (lower.includes('found picturemap') || lower.includes('using picturemap')) {
        updateExtractorProgress(90, 'Converting pictureMap');
        return;
      }

      if (lower.includes('atlas')) {
        updateExtractorProgress(82, 'Processing atlas tiles');
        return;
      }

      if (lower.includes('output file:')) {
        updateExtractorProgress(96, 'Finalizing map cache');
      }
    };

    child.stdout.on('data', (chunk) => {
      lastActivityAt = Date.now();
      const text = chunk.toString();
      stdout += text;
      stdoutBuffer += text;

      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || '';
      for (const line of lines) {
        handleExtractorLine(line);
      }
    });

    child.stderr.on('data', (chunk) => {
      lastActivityAt = Date.now();
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      clearInterval(progressTicker);
      clearInterval(stallWatcher);
      settleReject(error);
    });
    child.on('close', (code) => {
      clearInterval(progressTicker);
      clearInterval(stallWatcher);
      if (stdoutBuffer.trim()) {
        handleExtractorLine(stdoutBuffer.trim());
      }

      if (code === 0) {
        updateExtractorProgress(99, 'Finalizing map cache');
        let parsed = null;
        const lines = stdout
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .reverse();

        for (const line of lines) {
          try {
            const candidate = JSON.parse(line);
            if (candidate && typeof candidate === 'object') {
              parsed = candidate;
              break;
            }
          } catch {
            // Ignore non-JSON extractor logs.
          }
        }

        settleResolve({
          source: parsed?.source || 'extractor-cmd',
          detail: parsed || (stdout.trim() || command),
          message: parsed?.outputPath || stdout.trim() || command,
          mapTransform: parsed?.transform || null,
          outputPath: parsed?.outputPath || null,
        });
      } else {
        settleReject(new Error(`Extractor command exited with code ${code}. ${stderr.trim()}`));
      }
    });
  });
}

async function createPlaceholderMap(worldKey, worldName) {
  const safeLabel = String(worldName || worldKey || 'unknown').toUpperCase();
  const fileName = `${worldKey}.svg`;
  const target = path.join(mapCacheDir, fileName);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048">
  <defs>
    <pattern id="grid" width="128" height="128" patternUnits="userSpaceOnUse">
      <path d="M 128 0 L 0 0 0 128" fill="none" stroke="#2d5c2d" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="2048" height="2048" fill="#0b190b"/>
  <rect width="2048" height="2048" fill="url(#grid)"/>
  <text x="1024" y="990" font-size="96" text-anchor="middle" fill="#7ee47e" font-family="monospace">${safeLabel}</text>
  <text x="1024" y="1090" font-size="40" text-anchor="middle" fill="#4f9f4f" font-family="monospace">AUTO PLACEHOLDER - SET MICRODAGR_MAP_EXTRACT_CMD</text>
</svg>`;

  await fsp.writeFile(target, svg, 'utf8');
  return { source: 'placeholder', detail: fileName };
}

async function ensureMapForWorld(worldName) {
  const worldKey = normalizeWorldKey(worldName);
  if (!worldKey) return null;

  if (parseBool(process.env.MICRODAGR_MAP_REBUILD_ON_START, false) && !mapRebuildOnce.has(worldKey)) {
    deleteCachedMap(worldKey);
    mapRebuildOnce.add(worldKey);
    console.log(`[Bridge] Rebuild-on-start enabled, cache reset for ${worldKey}.`);
  }

  const tileExport = getTileExportInfo(worldKey);
  const cached = findCachedMap(worldKey);
  if (cached) {
    const previousMeta = mapMetadata.get(worldKey) || {};
    let shouldInvalidateCache = false;

    if (tileExport) {
      try {
        const cacheMtimeMs = fs.statSync(cached.fullPath).mtimeMs;
        if (tileExport.newestMtimeMs > (cacheMtimeMs + 250)) {
          shouldInvalidateCache = true;
          console.log(`[Bridge] Detected newer tile export for ${worldKey}, rebuilding cache (${tileExport.tileCount} tiles).`);
        }
      } catch {
        // If stat fails, keep normal flow.
      }
    }

    if (!shouldInvalidateCache && HIGH_RES_REBUILD_ON_CACHE && FORCE_PBO_ONLY && PBO_LAYERS_ENABLED && PREFER_PBO_LAYERS) {
      const onceKey = `${worldKey}:high-res-cache-refresh`;
      if (!highResRebuildOnce.has(onceKey)) {
        shouldInvalidateCache = true;
        highResRebuildOnce.add(onceKey);
        console.log(`[Bridge] High-res cache refresh enabled: rebuilding cached map for ${worldKey}.`);
      }
    }

    if (isAutoPlaceholderSvg(cached.fullPath)) {
      try {
        fs.unlinkSync(cached.fullPath);
      } catch (error) {
        console.warn(`[Bridge] Could not remove placeholder cache for ${worldKey}: ${error.message}`);
      }
    } else if (shouldInvalidateCache) {
      try {
        fs.unlinkSync(cached.fullPath);
      } catch (error) {
        console.warn(`[Bridge] Could not invalidate stale cache for ${worldKey}: ${error.message}`);
      }
    } else {
      scheduleBackgroundTopoRefresh(worldName, worldKey, tileExport, previousMeta.source || 'cache');
      setMapMeta(worldKey, {
        status: 'ready',
        worldName,
        fileName: cached.fileName,
        source: previousMeta.source || 'cache',
        progress: 100,
        message: previousMeta.message || 'Using cached map',
        mapTransform: previousMeta.mapTransform || null,
      });
      return { worldKey, worldName, fileName: cached.fileName, available: true };
    }
  }

  const refreshedCache = findCachedMap(worldKey);
  if (refreshedCache) {
    const previousMeta = mapMetadata.get(worldKey) || {};
    scheduleBackgroundTopoRefresh(worldName, worldKey, tileExport, previousMeta.source || 'cache');
    setMapMeta(worldKey, {
      status: 'ready',
      worldName,
      fileName: refreshedCache.fileName,
      source: previousMeta.source || 'cache',
      progress: 100,
      message: previousMeta.message || 'Using cached map',
      mapTransform: previousMeta.mapTransform || null,
    });
    return { worldKey, worldName, fileName: refreshedCache.fileName, available: true };
  }

  if (mapBuildPromises.has(worldKey)) {
    return mapBuildPromises.get(worldKey);
  }

  const buildPromise = (async () => {
    setMapMeta(worldKey, {
      status: 'building',
      worldName,
      progress: 10,
      message: 'Preparing map asset',
    });

    try {
      setMapMeta(worldKey, {
        status: 'building',
        worldName,
        progress: 24,
        message: 'Scanning local map sources',
      });

      const copied = await tryCopyFromSourceDirs(worldKey);
      if (copied) {
        const afterCopy = findCachedMap(worldKey);
        if (afterCopy) {
          setMapMeta(worldKey, {
            status: 'ready',
            worldName,
            fileName: afterCopy.fileName,
            source: copied.source,
            progress: 100,
            message: copied.detail,
          });
          return { worldKey, worldName, fileName: afterCopy.fileName, available: true };
        }
      }

      try {
        setMapMeta(worldKey, {
          status: 'building',
          worldName,
          progress: 55,
          message: 'Running map extractor',
        });

        const extracted = await runExtractorCommand(worldKey);
        if (extracted) {
          const afterExtract = findCachedMap(worldKey);
          if (afterExtract) {
            setMapMeta(worldKey, {
              status: 'ready',
              worldName,
              fileName: afterExtract.fileName,
              source: extracted.source,
              progress: 100,
              message: extracted.message || 'Map extracted',
              mapTransform: extracted.mapTransform || null,
            });
            return { worldKey, worldName, fileName: afterExtract.fileName, available: true };
          }
        }
      } catch (extractErr) {
        setMapMeta(worldKey, {
          status: 'extract-failed',
          worldName,
          progress: 82,
          message: extractErr.message,
        });
      }

      setMapMeta(worldKey, {
        status: 'building',
        worldName,
        progress: 92,
        message: 'Generating placeholder map',
      });

      const placeholder = await createPlaceholderMap(worldKey, worldName);
      const finalMap = findCachedMap(worldKey);
      if (finalMap) {
        setMapMeta(worldKey, {
          status: 'ready',
          worldName,
          fileName: finalMap.fileName,
          source: placeholder.source,
          progress: 100,
          message: placeholder.detail,
        });
        return { worldKey, worldName, fileName: finalMap.fileName, available: true };
      }

      setMapMeta(worldKey, {
        status: 'unavailable',
        worldName,
        progress: 0,
        message: 'No map source available',
      });
      return { worldKey, worldName, available: false };
    } finally {
      mapBuildPromises.delete(worldKey);
    }
  })();

  mapBuildPromises.set(worldKey, buildPromise);
  return buildPromise;
}

function resolveExtractedOutputPath(worldKey, extracted, tempOutDir) {
  if (extracted?.outputPath && fs.existsSync(extracted.outputPath)) {
    return extracted.outputPath;
  }

  for (const ext of MAP_EXTENSIONS) {
    const candidate = path.join(tempOutDir, `${worldKey}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

async function ensureMapForLayer(worldName, layerName, options = {}) {
  const worldKey = normalizeWorldKey(worldName);
  if (!worldKey) return null;

  const layer = normalizeMapLayer(layerName || DEFAULT_MAP_LAYER);
  const cacheBase = getLayerCacheBase(worldKey, layer);
  const mapKey = getLayerMapKey(worldKey, layer);
  const forceRebuild = options.forceRebuild === true;

  if (forceRebuild) {
    deleteCachedMap(cacheBase);
    mapBuildPromises.delete(mapKey);
    mapMetadata.delete(mapKey);
  }

  const cached = findCachedMap(cacheBase);
  if (cached && !isAutoPlaceholderSvg(cached.fullPath)) {
    const previousMeta = mapMetadata.get(mapKey) || {};
    setMapMeta(mapKey, {
      status: 'ready',
      worldName,
      fileName: cached.fileName,
      source: previousMeta.source || 'cache',
      progress: 100,
      message: previousMeta.message || 'Using cached map',
      mapTransform: previousMeta.mapTransform || null,
      layer,
    });
    return { worldKey, worldName, fileName: cached.fileName, available: true, mapKey, layer };
  }

  if (mapBuildPromises.has(mapKey)) {
    return mapBuildPromises.get(mapKey);
  }

  const buildPromise = (async () => {
    const tempOutDir = path.join(os.tmpdir(), 'microdagr-layer-build', `${cacheBase}-${Date.now()}`);
    await fsp.mkdir(tempOutDir, { recursive: true });

    setMapMeta(mapKey, {
      status: 'building',
      worldName,
      progress: 15,
      message: `Preparing ${layer.toUpperCase()} layer`,
      layer,
    });

    try {
      const extracted = await runExtractorCommand(worldKey, {
        mapKey,
        outDir: tempOutDir,
        envOverrides: getLayerEnvOverrides(layer),
      });

      const extractedPath = resolveExtractedOutputPath(worldKey, extracted, tempOutDir);
      if (extractedPath) {
        const ext = path.extname(extractedPath).toLowerCase() || '.png';
        const targetFileName = `${cacheBase}${ext}`;
        const targetPath = path.join(mapCacheDir, targetFileName);
        await fsp.copyFile(extractedPath, targetPath);

        setMapMeta(mapKey, {
          status: 'ready',
          worldName,
          fileName: targetFileName,
          source: extracted.source || `${layer}-extractor`,
          progress: 100,
          message: extracted.message || `${layer.toUpperCase()} map extracted`,
          mapTransform: extracted.mapTransform || null,
          layer,
        });

        return { worldKey, worldName, fileName: targetFileName, available: true, mapKey, layer };
      }

      throw new Error('Extractor finished without output map file');
    } catch (extractErr) {
      setMapMeta(mapKey, {
        status: 'extract-failed',
        worldName,
        progress: 82,
        message: extractErr.message,
        layer,
      });

      const placeholder = await createPlaceholderMap(cacheBase, worldName);
      const finalMap = findCachedMap(cacheBase);
      if (finalMap) {
        setMapMeta(mapKey, {
          status: 'ready',
          worldName,
          fileName: finalMap.fileName,
          source: placeholder.source,
          progress: 100,
          message: placeholder.detail,
          mapTransform: null,
          layer,
        });
        return { worldKey, worldName, fileName: finalMap.fileName, available: true, mapKey, layer };
      }

      setMapMeta(mapKey, {
        status: 'unavailable',
        worldName,
        progress: 0,
        message: 'No map source available',
        layer,
      });
      return { worldKey, worldName, available: false, mapKey, layer };
    } finally {
      mapBuildPromises.delete(mapKey);
      await fsp.rm(tempOutDir, { recursive: true, force: true }).catch(() => {});
    }
  })();

  mapBuildPromises.set(mapKey, buildPromise);
  return buildPromise;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  });

  const stream = fs.createReadStream(filePath);
  stream.on('error', (error) => {
    console.error('[Bridge] Failed streaming map file:', error.message);
    res.destroy(error);
  });

  stream.pipe(res);
}

function readMapImageDimensions(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.png') return null;

    const fd = fs.openSync(filePath, 'r');
    try {
      const header = Buffer.alloc(24);
      const bytesRead = fs.readSync(fd, header, 0, header.length, 0);
      if (bytesRead < 24) return null;

      const isPng =
        header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47 &&
        header[4] === 0x0d && header[5] === 0x0a && header[6] === 0x1a && header[7] === 0x0a;
      if (!isPng) return null;

      const width = header.readUInt32BE(16);
      const height = header.readUInt32BE(20);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
      return { width, height };
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return null;
  }
}

function parseRouteWorldName(urlObj) {
  const parts = urlObj.pathname.split('/').filter(Boolean);
  if (parts.length < 3) return null;
  return decodeURIComponent(parts[2]);
}

function parseRouteWorldNameWithPrefix(urlObj, prefix) {
  const pathName = urlObj.pathname;
  if (!pathName.startsWith(prefix)) return null;
  return decodeURIComponent(pathName.slice(prefix.length));
}

async function handleMapApiRequest(res, worldNameOrKey, options = {}) {
  const preferImmediate = options.preferImmediate !== false;
  const layer = normalizeMapLayer(options.layer || DEFAULT_MAP_LAYER);
  const worldName = worldNameOrKey || latestTelemetry?.worldName || '';
  const worldKey = normalizeWorldKey(worldName);
  const cacheBase = getLayerCacheBase(worldKey, layer);
  const mapKey = getLayerMapKey(worldKey, layer);

  function trySendNativeAtlasFallback() {
    if (!NATIVE_ALLOW_ATLAS_FALLBACK) return false;
    if (layer !== 'native') return false;
    if (!worldKey) return false;

    const atlasCacheBase = getLayerCacheBase(worldKey, 'atlas');
    const atlasMapKey = getLayerMapKey(worldKey, 'atlas');
    const atlasCached = findCachedMap(atlasCacheBase);
    if (!atlasCached || isAutoPlaceholderSvg(atlasCached.fullPath)) return false;

    const atlasMeta = mapMetadata.get(atlasMapKey) || {};
    const dims = readMapImageDimensions(atlasCached.fullPath);
    sendJson(res, 200, {
      ok: true,
      available: true,
      layer,
      worldName,
      worldKey,
      fileName: atlasCached.fileName,
      url: `/maps/${atlasCached.fileName}`,
      imageWidth: dims?.width || null,
      imageHeight: dims?.height || null,
      source: 'atlas-fallback',
      mapTransform: atlasMeta.mapTransform || null,
      status: 'ready',
      message: 'Native layer unavailable, using atlas fallback',
      progress: 100,
      updatedAt: Date.now(),
      fallbackFromLayer: 'atlas',
    });
    return true;
  }

  if (options.rebuild === true && worldKey) {
    deleteCachedMap(cacheBase);
    mapBuildPromises.delete(mapKey);
    mapMetadata.delete(mapKey);
  }

  if (!worldKey) {
    sendJson(res, 404, {
      ok: false,
      available: false,
      layer,
      progress: 0,
      message: 'No world is active yet',
    });
    return;
  }

  if (preferImmediate) {
    const cached = findCachedMap(cacheBase);
    if (cached && !isAutoPlaceholderSvg(cached.fullPath)) {
      const previousMeta = mapMetadata.get(mapKey) || {};
      setMapMeta(mapKey, {
        status: 'ready',
        worldName,
        fileName: cached.fileName,
        source: previousMeta.source || 'cache',
        progress: 100,
        message: previousMeta.message || 'Using cached map',
        mapTransform: previousMeta.mapTransform || null,
        layer,
      });

      // Serve cached immediately and refresh in background for the selected layer.
      void ensureMapForLayer(worldName, layer);

      const meta = mapMetadata.get(mapKey) || {};
      const dims = readMapImageDimensions(cached.fullPath);
      sendJson(res, 200, {
        ok: true,
        available: true,
        layer,
        worldName,
        worldKey,
        fileName: cached.fileName,
        url: `/maps/${cached.fileName}`,
        imageWidth: dims?.width || null,
        imageHeight: dims?.height || null,
        source: meta.source || 'cache',
        mapTransform: meta.mapTransform || null,
        status: meta.status || 'ready',
        message: meta.message || 'Map ready',
        progress: inferMapProgress(meta),
        updatedAt: meta.updatedAt || Date.now(),
      });
      return;
    }

    if (!mapBuildPromises.has(mapKey)) {
      setMapMeta(mapKey, {
        status: 'building',
        worldName,
        progress: 10,
        message: `Preparing ${layer.toUpperCase()} layer`,
        layer,
      });
      void ensureMapForLayer(worldName, layer);
    }

    if (trySendNativeAtlasFallback()) {
      return;
    }

    let meta = mapMetadata.get(mapKey) || {};

    if (mapBuildPromises.has(mapKey)) {
      const currentProgress = Number.isFinite(Number(meta.progress))
        ? clampPercent(meta.progress)
        : 35;
      const lastUpdated = Number(meta.updatedAt || 0);
      const staleMs = Date.now() - lastUpdated;
      const nextProgress = staleMs >= 4000
        ? Math.min(currentProgress + 1, 97)
        : currentProgress;

      if (!Number.isFinite(Number(meta.progress)) || staleMs >= 4000) {
        setMapMeta(mapKey, {
          status: 'building',
          worldName,
          progress: nextProgress,
          message: String(meta.message || 'Map build in progress'),
          layer,
        });
        meta = mapMetadata.get(mapKey) || meta;
      }
    }

    sendJson(res, 503, {
      ok: false,
      available: false,
      layer,
      worldName,
      worldKey,
      status: meta.status || 'building',
      message: meta.message || 'Map build in progress',
      progress: inferMapProgress(meta),
      updatedAt: meta.updatedAt || Date.now(),
    });
    return;
  }

  const ensureResult = await ensureMapForLayer(worldName, layer, { forceRebuild: options.rebuild === true });
  const meta = mapMetadata.get(mapKey) || {};

  if (ensureResult?.available && ensureResult.fileName) {
    const fullPath = path.join(mapCacheDir, ensureResult.fileName);
    if (layer === 'native' && isAutoPlaceholderSvg(fullPath)) {
      if (trySendNativeAtlasFallback()) {
        return;
      }
    }
    const dims = readMapImageDimensions(fullPath);
    sendJson(res, 200, {
      ok: true,
      available: true,
      layer,
      worldName,
      worldKey,
      fileName: ensureResult.fileName,
      url: `/maps/${ensureResult.fileName}`,
      imageWidth: dims?.width || null,
      imageHeight: dims?.height || null,
      source: meta.source || 'cache',
      mapTransform: meta.mapTransform || null,
      status: meta.status || 'ready',
      message: meta.message || 'Map ready',
      progress: inferMapProgress(meta),
      updatedAt: meta.updatedAt || Date.now(),
    });
    return;
  }

  if (trySendNativeAtlasFallback()) {
    return;
  }

  sendJson(res, 503, {
    ok: false,
    available: false,
    layer,
    worldName,
    worldKey,
    status: meta.status || 'unavailable',
    message: meta.message || 'Map not available',
    progress: inferMapProgress(meta),
    updatedAt: meta.updatedAt || Date.now(),
  });
}

const server = http.createServer((req, res) => {
  void (async () => {
    if (!req.url) {
      sendJson(res, 400, { ok: false, message: 'Missing URL' });
      return;
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const requestedLayer = normalizeMapLayer(urlObj.searchParams.get('layer') || DEFAULT_MAP_LAYER);

    if (urlObj.pathname === '/health') {
      const wsClientCount = countOpenWebSocketClients();
      const modConnected = lastTelemetryAt > 0 && (Date.now() - lastTelemetryAt) <= 5000;
      sendJson(res, 200, {
        ok: true,
        rptFile: currentRPT,
        hasTelemetry: Boolean(latestTelemetry),
        activeWorld: latestTelemetry?.worldName || null,
        appConnected: wsClientCount > 0,
        modConnected,
        wsClientCount,
        lastTelemetryAt: lastTelemetryAt || null,
      });
      return;
    }

    if (urlObj.pathname === '/api/map/current') {
      await handleMapApiRequest(res, latestTelemetry?.worldName || '', { layer: requestedLayer });
      return;
    }

    if (urlObj.pathname.startsWith('/api/map/rebuild/')) {
      const worldFromPath = parseRouteWorldNameWithPrefix(urlObj, '/api/map/rebuild/');
      const worldKey = normalizeWorldKey(worldFromPath);

      if (!worldKey) {
        sendJson(res, 400, { ok: false, message: 'Invalid world for rebuild' });
        return;
      }

      await handleMapApiRequest(res, worldFromPath, {
        preferImmediate: false,
        layer: requestedLayer,
        rebuild: true,
      });
      return;
    }

    if (urlObj.pathname.startsWith('/api/map/')) {
      const worldFromPath = parseRouteWorldName(urlObj);
      await handleMapApiRequest(res, worldFromPath, { layer: requestedLayer });
      return;
    }

    if (urlObj.pathname.startsWith('/maps/')) {
      const fileName = path.basename(urlObj.pathname.slice('/maps/'.length));
      const fullPath = path.join(mapCacheDir, fileName);

      if (!fs.existsSync(fullPath)) {
        sendJson(res, 404, { ok: false, message: 'Map file not found' });
        return;
      }

      sendFile(res, fullPath);
      return;
    }

    sendJson(res, 404, { ok: false, message: 'Not found' });
  })().catch((error) => {
    console.error('[Bridge] Request handler error:', error);
    if (!res.headersSent) {
      sendJson(res, 500, { ok: false, message: 'Bridge internal error' });
      return;
    }

    res.destroy(error);
  });
});

const wss = new WebSocket.Server({ noServer: true });

function countOpenWebSocketClients() {
  let count = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      count += 1;
    }
  });
  return count;
}

wss.on('connection', (ws) => {
  console.log('[WS] Mobile App Connected');

  if (latestTelemetry) {
    const bootstrap = { ...latestTelemetry };
    if (Array.isArray(markerSyncState.list)) {
      bootstrap.mapMarkers = markerSyncState.list;
      delete bootstrap.mapMarkersChunk;
      delete bootstrap.mapMarkersReset;
    }
    ws.send(JSON.stringify(bootstrap));
  }

  ws.on('close', () => {
    console.log('[WS] Mobile App Disconnected');
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`[Bridge] Port ${PORT} is already in use. Close the other bridge instance and retry.`);
    return;
  }

  console.error('[Bridge] HTTP server error:', error);
});

function broadcast(data) {
  const payload = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function decodeTelemetryPayloadFromRptLine(line) {
  const marker = '[MICRODAGR_TELEMETRY] ';
  const idx = String(line || '').indexOf(marker);
  if (idx === -1) return null;

  let jsonStr = line.substring(idx + marker.length).trim();

  // Arma 3 wraps diag_log output in double quotes and duplicates internal ones.
  if (jsonStr.endsWith('"')) {
    jsonStr = jsonStr.slice(0, -1);
  }
  jsonStr = jsonStr.replace(/""/g, '"');

  const payloadBytes = Buffer.byteLength(jsonStr, 'utf8');
  if (payloadBytes > MAX_RPT_JSON_BYTES) {
    logOversizeTelemetryOnce(`[Bridge] Ignoring oversized telemetry payload (${payloadBytes} bytes > ${MAX_RPT_JSON_BYTES}).`);
    return null;
  }

  try {
    return clampPayloadForTransport(JSON.parse(jsonStr));
  } catch {
    return null;
  }
}

function hydrateMarkerSnapshotFromRpt(filePath) {
  try {
    if (!filePath || !fs.existsSync(filePath)) return;

    const stat = fs.statSync(filePath);
    const maxBytes = Math.max(256 * 1024, parsePositiveInt(process.env.MICRODAGR_MARKER_BOOTSTRAP_BYTES, 2 * 1024 * 1024));
    const readStart = Math.max(0, stat.size - maxBytes);
    const readLength = stat.size - readStart;
    if (readLength <= 0) return;

    const fd = fs.openSync(filePath, 'r');
    let chunk = '';
    try {
      const buffer = Buffer.alloc(readLength);
      fs.readSync(fd, buffer, 0, readLength, readStart);
      chunk = buffer.toString('utf8');
    } finally {
      fs.closeSync(fd);
    }

    const lines = chunk.split(/\r?\n/);
    markerSyncState.list = [];
    markerSyncState.pendingReset = false;

    let touched = false;
    for (const line of lines) {
      const payload = decodeTelemetryPayloadFromRptLine(line);
      if (!payload) continue;

      const snapshot = updateMarkerSnapshotFromPayload(payload);
      if (Array.isArray(snapshot)) touched = true;
    }

    if (touched) {
      latestTelemetry = {
        ...(latestTelemetry || {}),
        mapMarkers: markerSyncState.list,
      };
      console.log(`[Bridge] Marker bootstrap loaded ${markerSyncState.list.length} marker(s) from RPT history.`);
    }
  } catch (error) {
    console.warn(`[Bridge] Marker bootstrap failed: ${error.message}`);
  }
}

function tailRPT(filePath) {
  if (tail) tail.unwatch();
  console.log(`[Bridge] Tailing: ${filePath}`);

  markerSyncState.list = [];
  markerSyncState.pendingReset = false;
  hydrateMarkerSnapshotFromRpt(filePath);

  tail = new Tail(filePath, {
    fromBeginning: false,
    useWatchFile: true,
    fsWatchOptions: { interval: 10 },
  });

  tail.on('line', (line) => {
    const payload = decodeTelemetryPayloadFromRptLine(line);
    if (!payload) return;

    try {
      const markerSnapshot = updateMarkerSnapshotFromPayload(payload);
      const payloadForLatest = { ...payload };
      if (Array.isArray(markerSnapshot)) {
        payloadForLatest.mapMarkers = markerSnapshot;
        delete payloadForLatest.mapMarkersChunk;
        delete payloadForLatest.mapMarkersReset;
      }

      latestTelemetry = { ...(latestTelemetry || {}), ...payloadForLatest };
      lastTelemetryAt = Date.now();
      broadcast(payload);

      if (payload.worldName) {
        void ensureMapForLayer(payload.worldName, DEFAULT_MAP_LAYER);
      }
    } catch (error) {
      console.error('[Bridge] Failed to process telemetry line:', error.message);
    }
  });

  tail.on('error', (error) => {
    console.error('[Bridge] Tail Error:', error);
  });
}

currentRPT = getLatestRPTFile();
if (currentRPT) {
  tailRPT(currentRPT);
} else {
  console.warn('[Bridge] No .rpt file found yet. Start Arma 3 and join a mission.');
}

if (fs.existsSync(arma3Dir)) {
  fs.watch(arma3Dir, (eventType, filename) => {
    if (!filename || !filename.toLowerCase().endsWith('.rpt')) return;

    const newFile = path.join(arma3Dir, filename);
    if (newFile === currentRPT) return;

    setTimeout(() => {
      const latest = getLatestRPTFile();
      if (latest && latest !== currentRPT) {
        currentRPT = latest;
        tailRPT(currentRPT);
      }
    }, 2000);
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('[Bridge] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Bridge] Uncaught exception:', error);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Bridge] HTTP + WebSocket server ready on port ${PORT}`);
});
