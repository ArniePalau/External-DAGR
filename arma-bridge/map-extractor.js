#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { PNG } = require('pngjs');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.paa']);
const OUTPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const ATLAS_TOP_RIGHT_CROP_PERCENT = 0.8;

function normalizeStyle(input) {
  const value = String(input || '').trim().toLowerCase();
  if (value === 'satellite' || value === 'sat') return 'satellite';
  if (value === 'topographic' || value === 'topo') return 'topographic';
  return 'auto';
}

function normalizeWorldKey(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = 'true';
      continue;
    }

    args[key] = next;
    i += 1;
  }
  return args;
}

function log(message) {
  process.stdout.write(`[MapExtractor] ${message}\n`);
}

function logError(message) {
  process.stderr.write(`[MapExtractor] ${message}\n`);
}

function splitMultiPath(value) {
  return String(value || '')
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function detectPboExtractorPath() {
  const pf = process.env.ProgramFiles || '';
  const pf86 = process.env['ProgramFiles(x86)'] || '';
  const candidates = [
    path.join(pf86, 'Mikero', 'DePboTools', 'bin', 'ExtractPbo.exe'),
    path.join(pf, 'Mikero', 'DePboTools', 'bin', 'ExtractPbo.exe'),
    path.join(pf86, 'Steam', 'steamapps', 'common', 'Arma 3 Tools', 'ExtractPbo', 'ExtractPbo.exe'),
    path.join(pf, 'Steam', 'steamapps', 'common', 'Arma 3 Tools', 'ExtractPbo', 'ExtractPbo.exe'),
    path.join(pf86, 'Steam', 'steamapps', 'common', 'Arma 3 Tools', 'ExtractPbo', 'ExtractPbo_x64.exe'),
    path.join(pf, 'Steam', 'steamapps', 'common', 'Arma 3 Tools', 'ExtractPbo', 'ExtractPbo_x64.exe'),
    // Local PBO Manager bundled with the project
    path.join(__dirname, '..', 'PBO Manager', 'pboc.exe'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fileExists(candidate)) return candidate;
  }

  return null;
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

function isSatelliteNamed(fileName, filePath = '') {
  const lowerName = String(fileName || '').toLowerCase();
  const lowerPath = String(filePath || '').toLowerCase();
  return (
    lowerName.includes('satout') ||
    lowerName.includes('satellite') ||
    lowerPath.includes('\\satout') ||
    lowerPath.includes('/satout') ||
    lowerPath.includes('\\satellite') ||
    lowerPath.includes('/satellite')
  );
}

function collectOtherProfileTileDirs(worldKey) {
  const userProfile = process.env.USERPROFILE || '';
  const root = path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles');
  if (!fileExists(root)) return [];

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
  const userProfile = process.env.USERPROFILE || '';
  const root = path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles');
  if (!fileExists(root)) return [];

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

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function parseSteamLibraries(filePath) {
  if (!fileExists(filePath)) return [];

  const raw = fs.readFileSync(filePath, 'utf8');
  const libs = [];
  const regex = /"path"\s+"([^"]+)"/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    libs.push(match[1].replace(/\\\\/g, '\\'));
  }
  return libs;
}

function detectArmaRoot(explicitArmaDir) {
  const candidates = [];
  if (explicitArmaDir) candidates.push(explicitArmaDir);
  if (process.env.ARMA3_DIR) candidates.push(process.env.ARMA3_DIR);

  const programFilesX86 = process.env['ProgramFiles(x86)'] || '';
  const programFiles = process.env.ProgramFiles || '';

  if (programFilesX86) {
    candidates.push(path.join(programFilesX86, 'Steam', 'steamapps', 'common', 'Arma 3'));
  }
  if (programFiles) {
    candidates.push(path.join(programFiles, 'Steam', 'steamapps', 'common', 'Arma 3'));
  }

  const steamLibraryCandidates = [
    path.join(programFilesX86, 'Steam', 'steamapps', 'libraryfolders.vdf'),
    path.join(programFiles, 'Steam', 'steamapps', 'libraryfolders.vdf'),
  ];

  for (const libFile of steamLibraryCandidates) {
    const libs = parseSteamLibraries(libFile);
    for (const lib of libs) {
      candidates.push(path.join(lib, 'steamapps', 'common', 'Arma 3'));
    }
  }

  const seen = new Set();
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (seen.has(resolved)) continue;
    seen.add(resolved);

    if (fileExists(path.join(resolved, 'arma3_x64.exe')) || fileExists(path.join(resolved, 'arma3.exe'))) {
      return resolved;
    }
  }

  return null;
}

function collectWorkshopAddonDirs() {
  const dirs = [];
  const programFilesX86 = process.env['ProgramFiles(x86)'] || '';
  const programFiles = process.env.ProgramFiles || '';

  const workshopRoots = [
    path.join(programFilesX86, 'Steam', 'steamapps', 'workshop', 'content', '107410'),
    path.join(programFiles, 'Steam', 'steamapps', 'workshop', 'content', '107410'),
  ];

  const steamLibraryCandidates = [
    path.join(programFilesX86, 'Steam', 'steamapps', 'libraryfolders.vdf'),
    path.join(programFiles, 'Steam', 'steamapps', 'libraryfolders.vdf'),
  ];

  for (const libFile of steamLibraryCandidates) {
    const libs = parseSteamLibraries(libFile);
    for (const lib of libs) {
      workshopRoots.push(path.join(lib, 'steamapps', 'workshop', 'content', '107410'));
    }
  }

  const seenRoots = new Set();
  for (const root of workshopRoots) {
    if (!root) continue;
    const resolvedRoot = path.resolve(root);
    if (seenRoots.has(resolvedRoot)) continue;
    seenRoots.add(resolvedRoot);

    if (!fileExists(resolvedRoot)) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(resolvedRoot, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (!/^\d+$/.test(entry.name)) continue;
      const addonsDir = path.join(resolvedRoot, entry.name, 'addons');
      if (fileExists(addonsDir)) dirs.push(addonsDir);
    }
  }

  return dirs;
}

function collectAddonDirs(armaRoot) {
  const dirs = [];

  if (armaRoot && fileExists(armaRoot)) {
    const rootEntries = fs.readdirSync(armaRoot, { withFileTypes: true });

    const directAddons = path.join(armaRoot, 'addons');
    if (fileExists(directAddons)) dirs.push(directAddons);

    for (const entry of rootEntries) {
      if (!entry.isDirectory()) continue;

      const dirName = entry.name;
      const full = path.join(armaRoot, dirName);

      if (dirName.startsWith('@')) {
        const modAddons = path.join(full, 'addons');
        if (fileExists(modAddons)) dirs.push(modAddons);
      }

      const nestedAddons = path.join(full, 'addons');
      if (fileExists(nestedAddons)) dirs.push(nestedAddons);
    }
  }

  for (const extra of splitMultiPath(process.env.MICRODAGR_EXTRA_ADDON_DIRS)) {
    if (fileExists(extra)) dirs.push(extra);
  }

  const includeWorkshopAddons = parseBool(process.env.MICRODAGR_INCLUDE_WORKSHOP_ADDONS, true);
  if (includeWorkshopAddons) {
    dirs.push(...collectWorkshopAddonDirs());
  }

  const unique = [];
  const seen = new Set();
  for (const dir of dirs) {
    const resolved = path.resolve(dir);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    unique.push(resolved);
  }

  return unique;
}

function scoreName(worldKey, fileName, filePath = '', style = 'auto') {
  const lower = fileName.toLowerCase();
  const full = `${filePath}`.toLowerCase();
  let score = 0;

  if (lower.includes(worldKey) || full.includes(`\\${worldKey}\\`) || full.includes(`/${worldKey}/`)) score += 35;
  if (lower.includes('picturemap')) score += 320;
  if (lower.includes('satout')) score += 220;
  if (lower.includes('legend')) score += 150;
  if (lower.includes('map')) score += 50;
  if (lower.includes('sat') || lower.includes('satellite')) score += 60;
  if (lower.includes('overview') || lower.includes('legend')) score += 70;
  if (lower.includes('full') || lower.includes('global')) score += 35;
  if (lower.includes('_lco') || lower.includes('_co')) score += 40;
  if (lower.includes('_lca')) score -= 10;
  if (/^m_\d{3}_\d{3}_/.test(lower)) score -= 120;
  if (lower.startsWith('ui_')) score -= 200;
  if (lower.includes('sky') || full.includes('\\sky')) score -= 220;
  if (lower.includes('water') || full.includes('\\water\\')) score -= 200;
  if (lower.includes('normal') || lower.includes('noise') || lower.includes('caustics')) score -= 160;
  if (lower.includes('mask')) score -= 10;
  if (lower.includes('normal') || lower.includes('_nohq') || lower.includes('spec')) score -= 25;
  if (lower.includes('preview') || lower.includes('overview')) score += 20;

  // Style preference: topographic usually matches MicroDAGR better than satellite imagery.
  if (style === 'topographic') {
    if (lower.includes('picturemap')) score += 220;
    if (lower.includes('topo') || lower.includes('topographic') || lower.includes('contour')) score += 160;
    if (lower.includes('satout') || lower.includes('satellite')) score -= 260;
  } else if (style === 'satellite') {
    if (lower.includes('satout') || lower.includes('satellite')) score += 180;
    if (lower.includes('picturemap')) score -= 120;
  }

  return score;
}

function walkFiles(rootDir, maxFiles = 25000) {
  const files = [];
  const stack = [rootDir];

  while (stack.length > 0 && files.length < maxFiles) {
    const current = stack.pop();
    let entries = [];

    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
        if (files.length >= maxFiles) break;
      }
    }
  }

  return files;
}

function findImageCandidates(rootDir, worldKey, style) {
  const files = walkFiles(rootDir, 40000);
  const candidates = [];
  const strictTopographic = style === 'topographic' && parseBool(process.env.MICRODAGR_STRICT_TOPO, true);

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    const fileName = path.basename(filePath);
    if (strictTopographic && isSatelliteNamed(fileName, filePath)) continue;

    const stat = fs.statSync(filePath);
    const score = scoreName(worldKey, fileName, filePath, style) + Math.min(Math.floor(stat.size / 50000), 30);

    candidates.push({
      filePath,
      ext,
      fileName,
      size: stat.size,
      score,
    });
  }

  candidates.sort((a, b) => b.score - a.score || b.size - a.size);
  return candidates;
}

function findPboCandidates(addonDirs, worldKey, style) {
  const candidates = [];

  for (const dir of addonDirs) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const lower = entry.name.toLowerCase();
      if (!lower.endsWith('.pbo')) continue;
      if (!lower.includes(worldKey)) continue;

      const fullPath = path.join(dir, entry.name);
      const stat = fs.statSync(fullPath);
      let score = scoreName(worldKey, lower, fullPath, style) + Math.min(Math.floor(stat.size / 1000000), 50);

      // Prefer PBOS likely to contain whole-map textures over tile shards.
      if (/_data_layers\.pbo$/.test(lower)) score += 160;
      if (/_data\.pbo$/.test(lower)) score += 110;
      if (/_data_layers_\d{2}_\d{2}\.pbo$/.test(lower)) score -= 220;

      candidates.push({ fullPath, score, size: stat.size, name: entry.name });
    }
  }

  candidates.sort((a, b) => b.score - a.score || b.size - a.size);
  return candidates;
}

function findPboLayerCandidates(addonDirs, worldKey) {
  const candidates = [];
  const monolithicPattern = new RegExp(`^map_${worldKey}_data_layers\\.pbo$`, 'i');
  const shardPattern = new RegExp(`^map_${worldKey}_data_layers_\\d{2}_\\d{2}\\.pbo$`, 'i');
  const tokens = worldKeyTokens(worldKey);
  const heuristicMinSizeMb = parsePositiveInt(process.env.MICRODAGR_PBO_LAYERS_HEURISTIC_MIN_SIZE_MB, 8);
  const heuristicMinSizeBytes = heuristicMinSizeMb * 1024 * 1024;

  for (const dir of addonDirs) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const lower = entry.name.toLowerCase();
      if (!lower.endsWith('.pbo')) continue;

      const isMonolithic = monolithicPattern.test(entry.name);
      const isShard = shardPattern.test(entry.name);
      const tokenMatches = tokens.filter((token) => hasTokenBoundaryMatch(lower, token));
      const tokenHit = tokenMatches.length > 0;
      const mapPackHint = /(^|[_\-])maps?([_\-]|$)/i.test(lower) || /^map_/i.test(lower);
      const dataPackHint = /_data(?:_layers)?(?:_\d{2}_\d{2})?\.pbo$/i.test(lower);
      const isHeuristicLayerCandidate = !isMonolithic && !isShard && tokenHit && (mapPackHint || dataPackHint);
      if (!isMonolithic && !isShard && !isHeuristicLayerCandidate) continue;

      const fullPath = path.join(dir, entry.name);
      const size = fs.statSync(fullPath).size;
      if (isHeuristicLayerCandidate && size < heuristicMinSizeBytes) continue;

      const scoreBase = isMonolithic
        ? 1000
        : (isShard ? 700 : 520);
      let score = scoreBase + Math.min(Math.floor(size / 1000000), 200);

      if (lower.includes(worldKey)) score += 320;
      score += tokenMatches.length * 90;
      if (mapPackHint) score += 120;
      if (dataPackHint) score += 160;
      if (/_c\.pbo$/i.test(lower)) score -= 260;

      candidates.push({
        fullPath,
        name: entry.name,
        size,
        score,
        isMonolithic,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score || b.size - a.size);
  return candidates;
}

function runCommand(command, options = {}) {
  const timeoutMs = parsePositiveInt(options.timeoutMs, 0);
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timeoutHandle = null;

    const settleReject = (error) => {
      if (settled) return;
      settled = true;
      if (timeoutHandle) clearTimeout(timeoutHandle);
      reject(error);
    };

    const settleResolve = (payload) => {
      if (settled) return;
      settled = true;
      if (timeoutHandle) clearTimeout(timeoutHandle);
      resolve(payload);
    };

    if (timeoutMs > 0) {
      timeoutHandle = setTimeout(() => {
        try {
          child.kill();
        } catch {
          // Ignore kill errors.
        }
        settleReject(new Error(`Command timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    }

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', settleReject);
    child.on('close', (code) => {
      if (code === 0) {
        settleResolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      } else {
        settleReject(new Error(`Command failed (${code}): ${stderr.trim() || stdout.trim()}`));
      }
    });
  });
}

async function extractPboToDir(pboPath, outDir) {
  let template = process.env.MICRODAGR_PBO_EXTRACT_CMD;
  if (!template) {
    const detectedExtractor = detectPboExtractorPath();
    if (!detectedExtractor) {
      throw new Error('MICRODAGR_PBO_EXTRACT_CMD is not configured and no ExtractPbo executable was detected');
    }
    // Check if it's pboc.exe (PBO Manager) which uses 'unpack' subcommand
    const isPboc = detectedExtractor.toLowerCase().endsWith('pboc.exe');
    if (isPboc) {
      template = `"${detectedExtractor}" unpack "{input}" "{output}"`;
    } else {
      template = `"${detectedExtractor}" -P "{input}" "{output}"`;
    }
  }

  const command = template
    .replace(/\{input\}/g, pboPath)
    .replace(/\{output\}/g, outDir);

  const timeoutMs = parsePositiveInt(process.env.MICRODAGR_PBO_EXTRACT_TIMEOUT_MS, 120000);
  await runCommand(command, { timeoutMs });
}

async function convertPaaToPng(inputFile, outputFile) {
  let template = process.env.MICRODAGR_PAA_CONVERT_CMD;
  if (!template) {
    const nodeExe = process.execPath || 'node';
    const converterScript = path.join(__dirname, 'paa-to-png.mjs');
    template = `"${nodeExe}" "${converterScript}" --input "{input}" --output "{output}"`;
  }

  const command = template
    .replace(/\{input\}/g, inputFile)
    .replace(/\{output\}/g, outputFile);

  await runCommand(command);
}

async function convertPaaToPngWithMaxDimension(inputFile, outputFile, maxDimension) {
  const nodeExe = process.execPath || 'node';
  const converterScript = path.join(__dirname, 'paa-to-png.mjs');
  const safeDimension = Math.max(32, parsePositiveInt(maxDimension, 512));
  const command = `"${nodeExe}" "${converterScript}" --input "${inputFile}" --output "${outputFile}" --max-dimension ${safeDimension}`;
  await runCommand(command);
}

function isCandidateConvertible(candidate) {
  const ext = candidate.ext.toLowerCase();
  if (OUTPUT_EXTS.has(ext)) return true;
  if (ext === '.paa') return true;
  return false;
}

function pickBestConvertible(candidates) {
  for (const candidate of candidates) {
    if (isCandidateConvertible(candidate)) return candidate;
  }
  return null;
}

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

function discoverExportedTiles(worldKey) {
  const userProfile = process.env.USERPROFILE || '';
  const candidates = [
    ...splitMultiPath(process.env.MICRODAGR_MAP_TILE_EXPORT_DIR),
    path.join(userProfile, 'Documents', 'Arma 3', 'MapExports', worldKey, 'tiles'),
    path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles', 'MapExports', worldKey, 'tiles'),
    path.join(userProfile, 'Documents', 'Arma 3', 'Screenshots', 'MicroDAGR', 'MapExports', worldKey, 'tiles'),
    path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles', 'Screenshots', 'MicroDAGR', 'MapExports', worldKey, 'tiles'),
    ...collectOtherProfileTileDirs(worldKey),
  ];

  for (const dir of candidates) {
    if (!dir || !fileExists(dir)) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    const tiles = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const match = /^tile_(\d+)_(\d+)\.png$/i.exec(entry.name);
      if (!match) continue;

      const x = Number.parseInt(match[1], 10);
      const y = Number.parseInt(match[2], 10);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      tiles.push({
        x,
        y,
        filePath: path.join(dir, entry.name),
      });
    }

    if (tiles.length > 0) {
      return { dir, tiles };
    }
  }

  const normalizedWorld = normalizeWorldKey(worldKey);
  const flatDirs = [
    ...splitMultiPath(process.env.MICRODAGR_MAP_TILE_EXPORT_FLAT_DIR),
    path.join(userProfile, 'Documents', 'Arma 3', 'Screenshots'),
    path.join(userProfile, 'Documents', 'Arma 3 - Other Profiles', 'Screenshots'),
    ...collectOtherProfileScreenshotDirs(),
  ];

  for (const dir of flatDirs) {
    if (!dir || !fileExists(dir)) continue;

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    const tiles = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const match = /^microdagr_([a-z0-9_\-]+)_tile_(\d+)_(\d+)\.png$/i.exec(entry.name);
      if (!match) continue;

      if (normalizeWorldKey(match[1]) !== normalizedWorld) continue;

      const x = Number.parseInt(match[2], 10);
      const y = Number.parseInt(match[3], 10);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      tiles.push({
        x,
        y,
        filePath: path.join(dir, entry.name),
      });
    }

    if (tiles.length > 0) {
      return { dir, tiles };
    }
  }

  return null;
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  return PNG.sync.read(buffer);
}

function readPngDimensions(filePath) {
  try {
    const png = readPng(filePath);
    const width = Number(png?.width || 0);
    const height = Number(png?.height || 0);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return null;
    }
    return { width, height };
  } catch {
    return null;
  }
}

async function stitchExportedTiles(worldKey, outDir) {
  const tileExportEnabled = parseBool(process.env.MICRODAGR_TILE_EXPORT_ENABLED, false);
  if (!tileExportEnabled) return null;

  const found = discoverExportedTiles(worldKey);
  if (!found) return null;

  const minTileCount = parsePositiveInt(process.env.MICRODAGR_MAP_TILE_MIN_COUNT, 4);
  if (found.tiles.length < minTileCount) {
    return null;
  }

  const maxX = found.tiles.reduce((acc, tile) => Math.max(acc, tile.x), 0);
  const maxY = found.tiles.reduce((acc, tile) => Math.max(acc, tile.y), 0);
  const cols = maxX + 1;
  const rows = maxY + 1;

  const first = readPng(found.tiles[0].filePath);
  const tileWidth = first.width;
  const tileHeight = first.height;
  if (!tileWidth || !tileHeight) {
    throw new Error('Tile export has invalid PNG dimensions');
  }

  const output = new PNG({ width: cols * tileWidth, height: rows * tileHeight });

  for (const tile of found.tiles) {
    const image = readPng(tile.filePath);
    if (image.width !== tileWidth || image.height !== tileHeight) {
      throw new Error(`Tile dimensions mismatch: ${path.basename(tile.filePath)}`);
    }

    for (let y = 0; y < tileHeight; y += 1) {
      const srcStart = y * tileWidth * 4;
      const srcEnd = srcStart + (tileWidth * 4);
      const dstY = (tile.y * tileHeight) + y;
      const dstStart = ((dstY * output.width) + (tile.x * tileWidth)) * 4;
      image.data.copy(output.data, dstStart, srcStart, srcEnd);
    }
  }

  await ensureDir(outDir);
  const outputPath = path.join(outDir, `${worldKey}.png`);
  fs.writeFileSync(outputPath, PNG.sync.write(output));

  return {
    outputPath,
    tileCount: found.tiles.length,
    grid: `${cols}x${rows}`,
    sourceDir: found.dir,
  };
}

function discoverLayerColorTiles(rootDir) {
  const files = walkFiles(rootDir, 120000);
  const tiles = [];

  for (const filePath of files) {
    if (path.extname(filePath).toLowerCase() !== '.paa') continue;
    const match = /^s_(\d+)_(\d+)_lco\.paa$/i.exec(path.basename(filePath));
    if (!match) continue;

    const x = Number.parseInt(match[1], 10);
    const y = Number.parseInt(match[2], 10);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    const shardMatch = /map_[a-z0-9_\-]+_data_layers_(\d{2})_(\d{2})(?:[\\/]|$)/i.exec(filePath);
    const shardX = shardMatch ? Number.parseInt(shardMatch[1], 10) : null;
    const shardY = shardMatch ? Number.parseInt(shardMatch[2], 10) : null;
    const shardKey = Number.isFinite(shardX) && Number.isFinite(shardY)
      ? `${shardX}:${shardY}`
      : null;
    const familyMatch = /(map_[a-z0-9_\-]+_data_layers)(?:_\d{2}_\d{2})?(?:[\\/]|$)/i.exec(filePath)
      || /(map_[a-z0-9_\-]+_data)(?:[\\/]|$)/i.exec(filePath)
      || /microdagr-map-extract-layers[\\/][^\\/]+[\\/]([^\\/]+)(?:[\\/]|$)/i.exec(filePath);
    const familyKey = familyMatch ? String(familyMatch[1] || '').toLowerCase() : '';

    tiles.push({ x, y, filePath, shardX, shardY, shardKey, familyKey });
  }

  return tiles;
}

function selectDominantLayerFamily(tiles) {
  if (!Array.isArray(tiles) || tiles.length === 0) return [];

  const grouped = new Map();
  for (const tile of tiles) {
    const key = String(tile.familyKey || '').trim();
    if (!key) continue;
    const bucket = grouped.get(key) || [];
    bucket.push(tile);
    grouped.set(key, bucket);
  }

  if (grouped.size <= 1) return tiles;

  let bestKey = null;
  let bestUniqueCoords = -1;
  let bestCount = -1;

  for (const [key, bucket] of grouped.entries()) {
    const uniqueCoords = new Set(bucket.map((tile) => `${tile.x}:${tile.y}`)).size;
    if (uniqueCoords > bestUniqueCoords || (uniqueCoords === bestUniqueCoords && bucket.length > bestCount)) {
      bestKey = key;
      bestUniqueCoords = uniqueCoords;
      bestCount = bucket.length;
    }
  }

  if (!bestKey) return tiles;
  return grouped.get(bestKey) || tiles;
}

function normalizeLayerShardCoordinates(tiles) {
  const shardTiles = tiles.filter((tile) => tile.shardKey);
  const shardKeys = new Set(shardTiles.map((tile) => tile.shardKey));
  if (shardKeys.size < 2) return tiles;

  const coordToShards = new Map();
  for (const tile of shardTiles) {
    const coordKey = `${tile.x}:${tile.y}`;
    const shardSet = coordToShards.get(coordKey) || new Set();
    shardSet.add(tile.shardKey);
    coordToShards.set(coordKey, shardSet);
  }

  let overlappingCoords = 0;
  for (const shardSet of coordToShards.values()) {
    if (shardSet.size > 1) overlappingCoords += 1;
  }
  if (overlappingCoords === 0) return tiles;

  const shardStats = new Map();
  for (const tile of shardTiles) {
    const existing = shardStats.get(tile.shardKey) || {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    };
    existing.minX = Math.min(existing.minX, tile.x);
    existing.maxX = Math.max(existing.maxX, tile.x);
    existing.minY = Math.min(existing.minY, tile.y);
    existing.maxY = Math.max(existing.maxY, tile.y);
    shardStats.set(tile.shardKey, existing);
  }

  let shardWidth = 0;
  let shardHeight = 0;
  for (const stats of shardStats.values()) {
    shardWidth = Math.max(shardWidth, (stats.maxX - stats.minX) + 1);
    shardHeight = Math.max(shardHeight, (stats.maxY - stats.minY) + 1);
  }

  if (shardWidth <= 0 || shardHeight <= 0) return tiles;

  return tiles.map((tile) => {
    if (!tile.shardKey || !Number.isFinite(tile.shardX) || !Number.isFinite(tile.shardY)) {
      return tile;
    }

    const stats = shardStats.get(tile.shardKey);
    if (!stats) return tile;

    const localX = tile.x - stats.minX;
    const localY = tile.y - stats.minY;
    return {
      ...tile,
      x: localX + (tile.shardX * shardWidth),
      y: localY + (tile.shardY * shardHeight),
    };
  });
}

function scoreLayerTilePath(filePath) {
  const lower = String(filePath || '').toLowerCase();
  let score = 0;

  // Prefer shard packages when both shard and monolithic assets exist.
  if (/_data_layers_\d{2}_\d{2}(?:\.|[\\/])/.test(lower)) score += 200;
  if (/_data_layers(?:\.|[\\/])/.test(lower)) score += 40;

  // Prefer canonical color tile names.
  if (/\\s_\d+_\d+_lco\.paa$/.test(lower) || /\/s_\d+_\d+_lco\.paa$/.test(lower)) score += 20;

  return score;
}

function dedupeLayerTilesByCoordinate(tiles) {
  const byCoord = new Map();

  for (const tile of tiles) {
    const key = `${tile.x}:${tile.y}`;
    const existing = byCoord.get(key);
    if (!existing) {
      byCoord.set(key, tile);
      continue;
    }

    const existingScore = scoreLayerTilePath(existing.filePath);
    const nextScore = scoreLayerTilePath(tile.filePath);
    if (nextScore > existingScore) {
      byCoord.set(key, tile);
    }
  }

  return Array.from(byCoord.values());
}

async function stitchPboLayerTiles(extractedRoot, worldKey, outDir, sourcePbo) {
  const discovered = discoverLayerColorTiles(extractedRoot);
  const familyFiltered = selectDominantLayerFamily(discovered);
  if (familyFiltered.length > 0 && familyFiltered.length < discovered.length) {
    log(`PBO layers family filter kept ${familyFiltered.length}/${discovered.length} candidate tiles`);
  }

  const normalized = normalizeLayerShardCoordinates(familyFiltered);
  const tiles = dedupeLayerTilesByCoordinate(normalized);
  const minTileCount = parsePositiveInt(process.env.MICRODAGR_PBO_LAYERS_MIN_TILES, 16);
  if (tiles.length < minTileCount) return null;

  const minX = tiles.reduce((acc, tile) => Math.min(acc, tile.x), Number.MAX_SAFE_INTEGER);
  const maxX = tiles.reduce((acc, tile) => Math.max(acc, tile.x), 0);
  const minY = tiles.reduce((acc, tile) => Math.min(acc, tile.y), Number.MAX_SAFE_INTEGER);
  const maxY = tiles.reduce((acc, tile) => Math.max(acc, tile.y), 0);
  const cols = (maxX - minX) + 1;
  const rows = (maxY - minY) + 1;

  const tileMaxDimension = parsePositiveInt(process.env.MICRODAGR_PBO_LAYERS_TILE_MAX_DIMENSION, 512);
  const convertConcurrency = Math.max(1, Math.min(8, parsePositiveInt(process.env.MICRODAGR_PBO_LAYERS_CONCURRENCY, 4)));
  const convertRoot = path.join(os.tmpdir(), 'microdagr-map-layers', `${worldKey}-${Date.now()}`);
  await ensureDir(convertRoot);

  const converted = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tiles.length) {
      const idx = nextIndex;
      nextIndex += 1;
      const tile = tiles[idx];
      const outputPng = path.join(convertRoot, `s_${tile.x}_${tile.y}.png`);

      try {
        await convertPaaToPngWithMaxDimension(tile.filePath, outputPng, tileMaxDimension);
        converted.push({ ...tile, pngPath: outputPng });
      } catch {
        // Ignore individual conversion errors and stitch what remains.
      }
    }
  }

  try {
    await Promise.all(Array.from({ length: convertConcurrency }, () => worker()));
    if (converted.length < minTileCount) return null;

    const first = readPng(converted[0].pngPath);
    const tileWidth = first.width;
    const tileHeight = first.height;
    if (!tileWidth || !tileHeight) return null;

    const rawWidth = cols * tileWidth;
    const rawHeight = rows * tileHeight;
    const forceSquare = parseBool(process.env.MICRODAGR_PBO_LAYERS_FORCE_SQUARE, true);
    const outputWidth = forceSquare ? Math.max(rawWidth, rawHeight) : rawWidth;
    const outputHeight = forceSquare ? Math.max(rawWidth, rawHeight) : rawHeight;
    const padX = Math.floor((outputWidth - rawWidth) / 2);
    const padY = Math.floor((outputHeight - rawHeight) / 2);

    const output = new PNG({ width: outputWidth, height: outputHeight });

    for (const tile of converted) {
      const image = readPng(tile.pngPath);
      if (image.width !== tileWidth || image.height !== tileHeight) continue;

      const tileOffsetX = tile.x - minX;
      const tileOffsetY = tile.y - minY;

      for (let row = 0; row < tileHeight; row += 1) {
        const srcStart = row * tileWidth * 4;
        const srcEnd = srcStart + (tileWidth * 4);
        const dstY = padY + (tileOffsetY * tileHeight) + row;
        const dstStart = ((dstY * output.width) + padX + (tileOffsetX * tileWidth)) * 4;
        image.data.copy(output.data, dstStart, srcStart, srcEnd);
      }
    }

    await ensureDir(outDir);
    const outputPath = path.join(outDir, `${worldKey}.png`);
    fs.writeFileSync(outputPath, PNG.sync.write(output));

    const transform = forceSquare
      ? {
          mode: 'pbo-layers-square-pad',
          scaleX: rawWidth / outputWidth,
          offsetX: padX / outputWidth,
          scaleY: rawHeight / outputHeight,
          offsetY: padY / outputHeight,
          sourceWidth: rawWidth,
          sourceHeight: rawHeight,
          canvasWidth: outputWidth,
          canvasHeight: outputHeight,
        }
      : null;

    return {
      outputPath,
      source: `pbo-layers:${sourcePbo}`,
      tileCount: converted.length,
      grid: `${cols}x${rows}`,
      tileSize: `${tileWidth}x${tileHeight}`,
      transform,
    };
  } finally {
    await fsp.rm(convertRoot, { recursive: true, force: true }).catch(() => {});
  }
}

async function fetchTextWithTimeout(url, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MicroDAGRBridge/1.0',
        Accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchBufferWithTimeout(url, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MicroDAGRBridge/1.0',
        Accept: 'image/png,image/*;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeout);
  }
}

function parseAtlasMapInit(html) {
  const match = /mapInit\((\{[\s\S]*?\})\);/m.exec(String(html || ''));
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function buildAtlasPageUrl(worldKey) {
  const atlasBaseUrl = String(process.env.MICRODAGR_ATLAS_BASE_URL || 'https://atlas.plan-ops.fr').replace(/\/+$/, '');
  const atlasGame = String(process.env.MICRODAGR_ATLAS_GAME || 'arma3').trim() || 'arma3';
  const layer = String(process.env.MICRODAGR_ATLAS_LAYER || '').trim();

  if (layer) {
    return `${atlasBaseUrl}/maps/${atlasGame}/${worldKey}/${encodeURIComponent(layer)}`;
  }
  return `${atlasBaseUrl}/maps/${atlasGame}/${worldKey}`;
}

function buildAtlasTileUrl(tilePattern, x, y, z, pageUrl) {
  const replaced = String(tilePattern)
    .replace(/\{x\}/g, String(x))
    .replace(/\{y\}/g, String(y))
    .replace(/\{z\}/g, String(z));

  return new URL(replaced, pageUrl).toString();
}

function isAtlasTrimPixelEmpty(data, pixelIndex, whiteThreshold) {
  const r = data[pixelIndex];
  const g = data[pixelIndex + 1];
  const b = data[pixelIndex + 2];
  const a = data[pixelIndex + 3];

  if (a <= 10) return true;
  return r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold;
}

function isAtlasTrimRowEmpty(image, y, whiteThreshold) {
  for (let x = 0; x < image.width; x += 1) {
    const idx = ((y * image.width) + x) * 4;
    if (!isAtlasTrimPixelEmpty(image.data, idx, whiteThreshold)) {
      return false;
    }
  }
  return true;
}

function isAtlasTrimColEmpty(image, x, whiteThreshold) {
  for (let y = 0; y < image.height; y += 1) {
    const idx = ((y * image.width) + x) * 4;
    if (!isAtlasTrimPixelEmpty(image.data, idx, whiteThreshold)) {
      return false;
    }
  }
  return true;
}

function detectAtlasEdgeTrim(image) {
  const whiteThreshold = parsePositiveInt(process.env.MICRODAGR_ATLAS_TRIM_WHITE_THRESHOLD, 248);

  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;

  while ((left + right) < (image.width - 1) && isAtlasTrimColEmpty(image, left, whiteThreshold)) {
    left += 1;
  }

  while ((left + right) < (image.width - 1) && isAtlasTrimColEmpty(image, image.width - 1 - right, whiteThreshold)) {
    right += 1;
  }

  while ((top + bottom) < (image.height - 1) && isAtlasTrimRowEmpty(image, top, whiteThreshold)) {
    top += 1;
  }

  while ((top + bottom) < (image.height - 1) && isAtlasTrimRowEmpty(image, image.height - 1 - bottom, whiteThreshold)) {
    bottom += 1;
  }

  return { left, right, top, bottom };
}

function cropPngImage(image, left, top, width, height) {
  const cropped = new PNG({ width, height });

  for (let row = 0; row < height; row += 1) {
    const srcStart = (((top + row) * image.width) + left) * 4;
    const srcEnd = srcStart + (width * 4);
    const dstStart = row * width * 4;
    image.data.copy(cropped.data, dstStart, srcStart, srcEnd);
  }

  return cropped;
}

async function stitchAtlasTiles(worldKey, outDir) {
  const atlasEnabled = parseBool(process.env.MICRODAGR_ATLAS_ENABLED, true);
  if (!atlasEnabled) return null;

  const pageUrl = buildAtlasPageUrl(worldKey);
  const pageHtml = await fetchTextWithTimeout(pageUrl, parsePositiveInt(process.env.MICRODAGR_ATLAS_PAGE_TIMEOUT_MS, 25000));
  const mapInit = parseAtlasMapInit(pageHtml);
  if (!mapInit || !mapInit.tilePattern) {
    throw new Error('Atlas mapInit tilePattern not found');
  }

  const maxZoom = Math.max(0, parsePositiveInt(mapInit.maxZoom, 6));
  const requestedZoom = parsePositiveInt(process.env.MICRODAGR_ATLAS_ZOOM, Math.min(maxZoom, 5));
  const zoom = Math.max(0, Math.min(maxZoom, requestedZoom));
  const gridSize = 2 ** zoom;
  const concurrency = Math.max(1, Math.min(64, parsePositiveInt(process.env.MICRODAGR_ATLAS_CONCURRENCY, 16)));
  const minTileCount = parsePositiveInt(process.env.MICRODAGR_ATLAS_MIN_TILE_COUNT, 16);

  const queue = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      queue.push({ x, y });
    }
  }

  let nextIndex = 0;
  const foundTiles = [];

  async function worker() {
    while (nextIndex < queue.length) {
      const idx = nextIndex;
      nextIndex += 1;
      const tile = queue[idx];

      const tileUrl = buildAtlasTileUrl(mapInit.tilePattern, tile.x, tile.y, zoom, pageUrl);
      try {
        const buffer = await fetchBufferWithTimeout(tileUrl, parsePositiveInt(process.env.MICRODAGR_ATLAS_TILE_TIMEOUT_MS, 12000));
        if (!buffer || buffer.length < 64) continue;

        foundTiles.push({
          x: tile.x,
          y: tile.y,
          buffer,
        });
      } catch {
        // Ignore per-tile fetch errors and keep scanning the rest of the atlas grid.
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  if (foundTiles.length < minTileCount) {
    throw new Error(`Atlas tiles insufficient (${foundTiles.length}/${minTileCount})`);
  }

  const samplePng = PNG.sync.read(foundTiles[0].buffer);
  const tileWidth = samplePng.width;
  const tileHeight = samplePng.height;
  if (!tileWidth || !tileHeight) {
    throw new Error('Atlas tile dimensions are invalid');
  }

  const minX = foundTiles.reduce((acc, tile) => Math.min(acc, tile.x), Number.MAX_SAFE_INTEGER);
  const maxX = foundTiles.reduce((acc, tile) => Math.max(acc, tile.x), 0);
  const minY = foundTiles.reduce((acc, tile) => Math.min(acc, tile.y), Number.MAX_SAFE_INTEGER);
  const maxY = foundTiles.reduce((acc, tile) => Math.max(acc, tile.y), 0);

  const cols = (maxX - minX) + 1;
  const rows = (maxY - minY) + 1;
  const output = new PNG({ width: cols * tileWidth, height: rows * tileHeight });

  const transform = {
    mode: 'atlas-crop',
    scaleX: gridSize / cols,
    offsetX: -(minX / cols),
    scaleY: gridSize / rows,
    offsetY: -(minY / rows),
    sizeX: tileWidth / Number(mapInit.factorX || 1),
    sizeY: tileHeight / Number(mapInit.factorY || 1),
    originX: Number(mapInit.originX || 0),
    originY: Number(mapInit.originY || 0),
    factorX: Number(mapInit.factorX || 0),
    factorY: Number(mapInit.factorY || 0),
    sizeInMeters: Number(mapInit.sizeInMeters || 0),
    zoom,
    tileSize: tileWidth,
    gridSize,
    minX,
    maxX,
    minY,
    maxY,
  };

  for (const tile of foundTiles) {
    const image = PNG.sync.read(tile.buffer);
    if (image.width !== tileWidth || image.height !== tileHeight) {
      continue;
    }

    const tileOffsetX = tile.x - minX;
    const tileOffsetY = tile.y - minY;

    for (let row = 0; row < tileHeight; row += 1) {
      const srcStart = row * tileWidth * 4;
      const srcEnd = srcStart + (tileWidth * 4);
      const dstY = (tileOffsetY * tileHeight) + row;
      const dstStart = ((dstY * output.width) + (tileOffsetX * tileWidth)) * 4;
      image.data.copy(output.data, dstStart, srcStart, srcEnd);
    }
  }

  const originalWidth = output.width;
  const originalHeight = output.height;
  const edgeTrim = detectAtlasEdgeTrim(output);
  const trimmedWidth = originalWidth - edgeTrim.left - edgeTrim.right;
  const trimmedHeight = originalHeight - edgeTrim.top - edgeTrim.bottom;
  const hasTrim = edgeTrim.left > 0 || edgeTrim.right > 0 || edgeTrim.top > 0 || edgeTrim.bottom > 0;

  let finalOutput = output;
  if (hasTrim && trimmedWidth > 1 && trimmedHeight > 1) {
    finalOutput = cropPngImage(output, edgeTrim.left, edgeTrim.top, trimmedWidth, trimmedHeight);

    const scaleXFactor = originalWidth / trimmedWidth;
    const scaleYFactor = originalHeight / trimmedHeight;

    transform.scaleX *= scaleXFactor;
    transform.offsetX = (transform.offsetX * scaleXFactor) - (edgeTrim.left / trimmedWidth);
    transform.scaleY *= scaleYFactor;
    transform.offsetY = (transform.offsetY * scaleYFactor) - (edgeTrim.top / trimmedHeight);
    transform.trim = edgeTrim;
  }

  const preTopRightCropWidth = finalOutput.width;
  const preTopRightCropHeight = finalOutput.height;
  const topCropPx = Math.floor(preTopRightCropHeight * (ATLAS_TOP_RIGHT_CROP_PERCENT / 100));
  const rightCropPx = Math.floor(preTopRightCropWidth * (ATLAS_TOP_RIGHT_CROP_PERCENT / 100));
  const topRightCropWidth = preTopRightCropWidth - rightCropPx;
  const topRightCropHeight = preTopRightCropHeight - topCropPx;
  const hasTopRightCrop = (topCropPx > 0 || rightCropPx > 0) && topRightCropWidth > 1 && topRightCropHeight > 1;

  if (hasTopRightCrop) {
    finalOutput = cropPngImage(finalOutput, 0, topCropPx, topRightCropWidth, topRightCropHeight);

    const scaleXFactor = preTopRightCropWidth / topRightCropWidth;
    const scaleYFactor = preTopRightCropHeight / topRightCropHeight;

    transform.scaleX *= scaleXFactor;
    transform.offsetX *= scaleXFactor;
    transform.scaleY *= scaleYFactor;
    transform.offsetY = (transform.offsetY * scaleYFactor) - (topCropPx / topRightCropHeight);
    transform.topRightCrop = {
      percent: ATLAS_TOP_RIGHT_CROP_PERCENT,
      top: topCropPx,
      right: rightCropPx,
    };
  }

  await ensureDir(outDir);
  const outputPath = path.join(outDir, `${worldKey}.png`);
  fs.writeFileSync(outputPath, PNG.sync.write(finalOutput));

  return {
    outputPath,
    tileCount: foundTiles.length,
    zoom,
    grid: `${cols}x${rows}`,
    pageUrl,
    transform,
  };
}

async function copyResultImage(candidate, worldKey, outDir) {
  const ext = candidate.ext.toLowerCase();

  if (OUTPUT_EXTS.has(ext)) {
    const outputName = `${worldKey}${ext === '.jpeg' ? '.jpg' : ext}`;
    const outputPath = path.join(outDir, outputName);
    await fsp.copyFile(candidate.filePath, outputPath);
    return outputPath;
  }

  if (ext === '.paa') {
    const outputPath = path.join(outDir, `${worldKey}.png`);
    await convertPaaToPng(candidate.filePath, outputPath);
    return outputPath;
  }

  throw new Error(`Unsupported extension: ${ext}`);
}

async function findFromUnpackedSources(worldKey, addonDirs, style) {
  let best = null;

  for (const dir of addonDirs) {
    const candidates = findImageCandidates(dir, worldKey, style);
    const top = pickBestConvertible(candidates);
    if (!top) continue;

    if (!best || top.score > best.score) {
      best = top;
    }
  }

  return best;
}

async function findFromPbo(worldKey, addonDirs, style) {
  const pboCandidates = findPboCandidates(addonDirs, worldKey, style).slice(0, 12);
  if (pboCandidates.length === 0) return null;

  let overallBest = null;

  for (let i = 0; i < pboCandidates.length; i += 1) {
    const pbo = pboCandidates[i];
    const tempRoot = path.join(os.tmpdir(), 'microdagr-map-extract', `${worldKey}-${Date.now()}-${i}`);
    await ensureDir(tempRoot);

    try {
      log(`Extracting PBO candidate: ${pbo.name}`);
      await extractPboToDir(pbo.fullPath, tempRoot);

      const candidates = findImageCandidates(tempRoot, worldKey, style);
      const bestCandidate = pickBestConvertible(candidates);
      if (bestCandidate) {
        const current = {
          candidate: bestCandidate,
          tempRoot,
          sourcePbo: pbo.fullPath,
          pboScore: pbo.score,
          totalScore: bestCandidate.score + pbo.score,
        };

        if (!overallBest || current.totalScore > overallBest.totalScore) {
          overallBest = current;
        }
      }
    } catch (error) {
      logError(`PBO extraction failed for ${pbo.name}: ${error.message}`);
    }
  }

  return overallBest;
}

async function findFromPboLayers(worldKey, addonDirs, outDir) {
  const enabled = parseBool(process.env.MICRODAGR_PBO_LAYERS_ENABLED, true);
  if (!enabled) return null;
  const startTs = Date.now();
  const maxTotalMs = parsePositiveInt(process.env.MICRODAGR_PBO_LAYERS_MAX_TIME_MS, 120000);

  const pboCandidates = findPboLayerCandidates(addonDirs, worldKey);
  const maxPbos = Math.max(1, parsePositiveInt(process.env.MICRODAGR_PBO_LAYERS_MAX_PBOS, 24));
  const shardCandidates = pboCandidates.filter((candidate) => !candidate.isMonolithic);
  const selectedPool = shardCandidates.length > 0 ? shardCandidates : pboCandidates;
  const selectedPbos = selectedPool.slice(0, maxPbos);

  if (selectedPbos.length === 0) return null;

  const tempRoot = path.join(os.tmpdir(), 'microdagr-map-extract-layers', `${worldKey}-${Date.now()}`);
  await ensureDir(tempRoot);

  try {
    let extractedCount = 0;
    for (let i = 0; i < selectedPbos.length; i += 1) {
      const elapsed = Date.now() - startTs;
      if (elapsed > maxTotalMs) {
        log(`PBO layers time budget reached (${Math.floor(elapsed / 1000)}s > ${Math.floor(maxTotalMs / 1000)}s), falling back.`);
        break;
      }

      const pbo = selectedPbos[i];
      try {
        log(`Extracting PBO layers candidate ${i + 1}/${selectedPbos.length}: ${pbo.name}`);
        const extractDirName = path.basename(pbo.name, path.extname(pbo.name));
        const extractDir = path.join(tempRoot, extractDirName);
        await ensureDir(extractDir);
        await extractPboToDir(pbo.fullPath, extractDir);
        extractedCount += 1;
      } catch (error) {
        logError(`PBO layers extraction failed for ${pbo.name}: ${error.message}`);
      }
    }

    if (extractedCount === 0) return null;

    const stitched = await stitchPboLayerTiles(tempRoot, worldKey, outDir, selectedPbos[0].fullPath);
    if (stitched) {
      stitched.source = `pbo-layers:${selectedPbos[0].fullPath}`;
      return stitched;
    }
  } finally {
    await fsp.rm(tempRoot, { recursive: true, force: true }).catch(() => {});
  }

  return null;
}

function worldKeyTokens(worldKey) {
  return String(worldKey || '')
    .split(/[_\-]+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3 && token !== 'map' && token !== 'world' && token !== 'terrain');
}

function hasTokenBoundaryMatch(text, token) {
  const escaped = String(token).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return regex.test(String(text || '').toLowerCase());
}

function scorePictureMapPboCandidate(pboName, worldKey, tokens) {
  const lower = String(pboName || '').toLowerCase();
  let score = 0;

  if (lower.includes(worldKey)) score += 320;
  if (lower.includes('maps')) score += 80;
  if (lower.includes('terrain')) score += 30;

  for (const token of tokens) {
    if (hasTokenBoundaryMatch(lower, token)) {
      score += 140;
    }
  }

  return score;
}

async function findPictureMap(worldKey, addonDirs, outDir) {
  // Prefer exact map_<world>_data.pbo, but fallback to token-matched map packs used by many mod terrains.
  const exactPattern = new RegExp(`^map_${worldKey}_data\\.pbo$`, 'i');
  const tokens = worldKeyTokens(worldKey);
  const pboCandidates = [];

  for (const dir of addonDirs) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const lower = entry.name.toLowerCase();
      if (!lower.endsWith('.pbo')) continue;
      if (/_data_layers/.test(lower)) continue;

      let score = 0;
      if (exactPattern.test(entry.name)) {
        score = 10000;
      } else {
        score = scorePictureMapPboCandidate(entry.name, worldKey, tokens);
      }

      if (score <= 0) continue;

      pboCandidates.push({
        name: entry.name,
        pboPath: path.join(dir, entry.name),
        score,
      });
    }
  }

  pboCandidates.sort((a, b) => b.score - a.score);
  const maxCandidates = Math.max(1, parsePositiveInt(process.env.MICRODAGR_PICTUREMAP_MAX_PBOS, 16));

  for (const candidate of pboCandidates.slice(0, maxCandidates)) {
    const tempRoot = path.join(os.tmpdir(), 'microdagr-picturemap', `${worldKey}-${Date.now()}`);
    await ensureDir(tempRoot);

    try {
      log(`Extracting PBO for pictureMap: ${candidate.name}`);
      await extractPboToDir(candidate.pboPath, tempRoot);

      // Search recursively for pictureMap first.
      const files = walkFiles(tempRoot, 9000);
      const picMapFile = files.find((f) => {
        const base = path.basename(f).toLowerCase();
        return base === 'picturemap_ca.paa' || base === 'picturemap.paa';
      });

      if (picMapFile) {
        log(`Found pictureMap: ${picMapFile}`);
        const outputPath = path.join(outDir, `${worldKey}.png`);
        await convertPaaToPng(picMapFile, outputPath);
        return {
          outputPath,
          source: `picturemap:${candidate.pboPath}`,
        };
      }

      // If pictureMap is absent (common in some mod maps), fallback to satout asset.
      const satOutCandidates = files.filter((f) => {
        const lowerPath = f.toLowerCase();
        const ext = path.extname(lowerPath);
        if (!['.paa', '.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return false;
        const base = path.basename(lowerPath);
        return base.includes('satout') || base.includes('satellite');
      }).map((filePath) => {
        let size = 0;
        try {
          size = fs.statSync(filePath).size;
        } catch {
          size = 0;
        }
        return { filePath, size };
      }).sort((a, b) => b.size - a.size);

      const minNativeDim = parsePositiveInt(process.env.MICRODAGR_NATIVE_MIN_DIMENSION, 1024);

      for (let satIdx = 0; satIdx < satOutCandidates.length; satIdx += 1) {
        const satOutFile = satOutCandidates[satIdx].filePath;
        const ext = path.extname(satOutFile).toLowerCase();
        log(`Found satout fallback candidate: ${satOutFile}`);

        if (ext === '.paa') {
          const probeOutputPath = path.join(tempRoot, `satout_probe_${satIdx}.png`);
          const maxDim = parsePositiveInt(process.env.MICRODAGR_NATIVE_MAX_DIMENSION, 2048);
          await convertPaaToPngWithMaxDimension(satOutFile, probeOutputPath, maxDim);

          const dims = readPngDimensions(probeOutputPath);
          const minDim = Math.min(Number(dims?.width || 0), Number(dims?.height || 0));
          if (!dims || minDim < minNativeDim) {
            log(`Skipping satout candidate (too small ${dims?.width || 0}x${dims?.height || 0}, min ${minNativeDim})`);
            continue;
          }

          const outputPath = path.join(outDir, `${worldKey}.png`);
          await fsp.copyFile(probeOutputPath, outputPath);
          return {
            outputPath,
            source: `satout:${candidate.pboPath}`,
          };
        }

        if (ext === '.png') {
          const dims = readPngDimensions(satOutFile);
          const minDim = Math.min(Number(dims?.width || 0), Number(dims?.height || 0));
          if (!dims || minDim < minNativeDim) {
            log(`Skipping satout candidate (too small ${dims?.width || 0}x${dims?.height || 0}, min ${minNativeDim})`);
            continue;
          }
        }

        const outputName = `${worldKey}${ext === '.jpeg' ? '.jpg' : ext}`;
        const outputPath = path.join(outDir, outputName);
        await fsp.copyFile(satOutFile, outputPath);
        return {
          outputPath,
          source: `satout:${candidate.pboPath}`,
        };
      }
    } catch (error) {
      logError(`pictureMap extraction failed for ${candidate.name}: ${error.message}`);
    } finally {
      await fsp.rm(tempRoot, { recursive: true, force: true }).catch(() => {});
    }
  }

  return null;
}

async function main() {
  const args = parseArgs(process.argv);
  const worldInput = args.world || args.worldName || '';
  const worldKey = normalizeWorldKey(worldInput);
  const style = normalizeStyle(args.style || process.env.MICRODAGR_MAP_STYLE || 'topographic');
  const preferNativeMaps = parseBool(process.env.MICRODAGR_PREFER_NATIVE_MAPS, true);
  const forcePboOnly = parseBool(process.env.MICRODAGR_FORCE_PBO_ONLY, false);
  const preferPboLayers = parseBool(process.env.MICRODAGR_PREFER_PBO_LAYERS, false);
  const outDir = path.resolve(args.out || process.env.MICRODAGR_MAP_OUT_DIR || path.join(process.cwd(), 'maps'));

  if (!worldKey) {
    throw new Error('Missing --world argument');
  }

  await ensureDir(outDir);

  log(`World key: ${worldKey}`);
  log(`Map style: ${style}`);
  log(`Force PBO only: ${forcePboOnly}`);
  log(`Prefer PBO layers: ${preferPboLayers}`);

  if (!forcePboOnly) {
    try {
      const stitched = await stitchExportedTiles(worldKey, outDir);
      if (stitched) {
        log(`Using exported map tiles (${stitched.grid}, ${stitched.tileCount} tiles)`);
        log(`Tile source: ${stitched.sourceDir}`);
        log(`Output file: ${stitched.outputPath}`);
        process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: stitched.outputPath, source: 'tile-export' })}\n`);
        return;
      }
    } catch (tileError) {
      logError(`Tile stitch failed: ${tileError.message}`);
    }
  }

  const atlasEligible = !forcePboOnly && (style === 'topographic' || parseBool(process.env.MICRODAGR_ATLAS_FORCE, false));

  if (!preferNativeMaps && atlasEligible) {
    try {
      const atlas = await stitchAtlasTiles(worldKey, outDir);
      if (atlas) {
        log(`Using Atlas tiles (${atlas.grid}, ${atlas.tileCount} tiles, z=${atlas.zoom})`);
        log(`Atlas page: ${atlas.pageUrl}`);
        log(`Output file: ${atlas.outputPath}`);
        process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: atlas.outputPath, source: 'atlas-tiles', transform: atlas.transform || null })}\n`);
        return;
      }
    } catch (atlasError) {
      logError(`Atlas fallback failed: ${atlasError.message}`);
    }
  }

  const armaRoot = detectArmaRoot(args.arma);
  let selected = null;
  let source = 'unpacked-search';

  if (armaRoot) {
    const addonDirs = collectAddonDirs(armaRoot);
    if (addonDirs.length > 0) {
      log(`Arma root: ${armaRoot}`);
      log(`Addon dirs: ${addonDirs.length}`);

      if (!forcePboOnly) {
        selected = await findFromUnpackedSources(worldKey, addonDirs, style);
      }
      if (!selected) {
        // For topographic mode, try whole-map PBO textures next.
        if (style === 'topographic') {
          const layersFirst = await findFromPboLayers(worldKey, addonDirs, outDir);
          if (layersFirst) {
            log(`Using PBO layers tiles (${layersFirst.grid}, ${layersFirst.tileCount} tiles, ${layersFirst.tileSize})`);
            log(`Output file: ${layersFirst.outputPath}`);
            log(`Source: ${layersFirst.source}`);
            process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: layersFirst.outputPath, source: layersFirst.source, transform: layersFirst.transform || null })}\n`);
            return;
          }

          // Try direct pictureMap extraction next (reliable fallback when layers are unavailable).
          const pictureMapResult = await findPictureMap(worldKey, addonDirs, outDir);
          if (pictureMapResult) {
            log(`Using pictureMap from PBO`);
            log(`Output file: ${pictureMapResult.outputPath}`);
            log(`Source: ${pictureMapResult.source}`);
            process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: pictureMapResult.outputPath, source: pictureMapResult.source })}\n`);
            return;
          }

          const pboResult = await findFromPbo(worldKey, addonDirs, style);
          if (pboResult && pboResult.candidate) {
            selected = pboResult.candidate;
            source = `pbo:${pboResult.sourcePbo}`;
          }

          // Optional late pbo-layers fallback if not found earlier.
          if (!selected) {
            const layersResult = await findFromPboLayers(worldKey, addonDirs, outDir);
            if (layersResult) {
              log(`Using PBO layers tiles (${layersResult.grid}, ${layersResult.tileCount} tiles, ${layersResult.tileSize})`);
              log(`Output file: ${layersResult.outputPath}`);
              log(`Source: ${layersResult.source}`);
              process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: layersResult.outputPath, source: layersResult.source, transform: layersResult.transform || null })}\n`);
              return;
            }
          }
        } else {
          const layersResult = await findFromPboLayers(worldKey, addonDirs, outDir);
          if (layersResult) {
            log(`Using PBO layers tiles (${layersResult.grid}, ${layersResult.tileCount} tiles, ${layersResult.tileSize})`);
            log(`Output file: ${layersResult.outputPath}`);
            log(`Source: ${layersResult.source}`);
            process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: layersResult.outputPath, source: layersResult.source, transform: layersResult.transform || null })}\n`);
            return;
          }

          const pboResult = await findFromPbo(worldKey, addonDirs, style);
          if (pboResult && pboResult.candidate) {
            selected = pboResult.candidate;
            source = `pbo:${pboResult.sourcePbo}`;
          }
        }
      }
    } else {
      logError('No addon directories found to search map assets');
    }
  } else {
    logError('Could not detect Arma 3 installation. Set --arma or ARMA3_DIR');
  }

  if (!selected && preferNativeMaps && atlasEligible) {
    try {
      const atlas = await stitchAtlasTiles(worldKey, outDir);
      if (atlas) {
        log(`Using Atlas fallback tiles (${atlas.grid}, ${atlas.tileCount} tiles, z=${atlas.zoom})`);
        log(`Atlas page: ${atlas.pageUrl}`);
        log(`Output file: ${atlas.outputPath}`);
        process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath: atlas.outputPath, source: 'atlas-tiles', transform: atlas.transform || null })}\n`);
        return;
      }
    } catch (atlasError) {
      logError(`Atlas fallback failed: ${atlasError.message}`);
    }
  }

  if (!selected) {
    throw new Error('No suitable image candidate found for this world');
  }

  const outputPath = await copyResultImage(selected, worldKey, outDir);

  log(`Selected candidate: ${selected.fileName}`);
  log(`Output file: ${outputPath}`);
  log(`Source: ${source}`);

  process.stdout.write(`${JSON.stringify({ ok: true, worldKey, outputPath, source })}\n`);
}

main().catch((error) => {
  logError(error.message || String(error));
  process.exit(1);
});
