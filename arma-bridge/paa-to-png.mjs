#!/usr/bin/env node

import fs from 'node:fs';
import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { Paa } from '@bis-toolkit/paa';
import { PNG } from 'pngjs';

function logError(message) {
  process.stderr.write(`[PaaToPng] ${message}\n`);
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

function resolvePaaClass() {
  if (typeof Paa === 'function') return Paa;
  throw new Error('Paa class not available from @bis-toolkit/paa');
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function pickMipLevel(mipmaps, maxDimension) {
  if (!Array.isArray(mipmaps) || mipmaps.length === 0) return 0;

  for (let i = 0; i < mipmaps.length; i += 1) {
    const mip = mipmaps[i];
    if (!mip || !mip.width || !mip.height) continue;
    if (mip.width <= maxDimension && mip.height <= maxDimension) {
      return i;
    }
  }

  // If all levels exceed maxDimension, use smallest available mip.
  return mipmaps.length - 1;
}

async function writePng(outputPath, width, height, argbBuffer) {
  const png = new PNG({ width, height });
  const pixelCount = width * height;
  const pixelBytes = Buffer.isBuffer(argbBuffer) ? argbBuffer : Buffer.from(argbBuffer);

  if (!pixelBytes || pixelBytes.length < pixelCount * 4) {
    throw new Error('Decoded pixel buffer is invalid or too small');
  }

  for (let i = 0; i < pixelCount; i += 1) {
    const src = i * 4;
    const dst = i * 4;

    // getArgb32PixelData is ARGB32; read as LE uint32 to avoid channel-order confusion.
    const pixel = pixelBytes.readUInt32LE(src);
    const a = (pixel >>> 24) & 0xff;
    const r = (pixel >>> 16) & 0xff;
    const g = (pixel >>> 8) & 0xff;
    const b = pixel & 0xff;

    png.data[dst] = r;
    png.data[dst + 1] = g;
    png.data[dst + 2] = b;
    png.data[dst + 3] = a;
  }

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(outputPath);
    stream.on('error', reject);
    stream.on('finish', resolve);
    png.pack().on('error', reject).pipe(stream);
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input;
  const output = args.output;
  const maxDimension = parsePositiveInt(
    args['max-dimension'] || process.env.MICRODAGR_MAP_MAX_DIMENSION,
    4096,
  );

  if (!input || !output) {
    throw new Error('Usage: node paa-to-png.mjs --input <file.paa> --output <file.png>');
  }

  const inputPath = path.resolve(input);
  const outputPath = path.resolve(output);

  const inputBuffer = await fsp.readFile(inputPath);
  const PaaClass = resolvePaaClass();
  const paa = new PaaClass();
  paa.read(inputBuffer);

  if (!paa.mipmaps || paa.mipmaps.length === 0) {
    throw new Error('PAA file has no mipmaps');
  }

  const mipLevel = pickMipLevel(paa.mipmaps, maxDimension);
  const mip = paa.mipmaps[mipLevel];
  if (!mip || !mip.width || !mip.height) {
    throw new Error('Invalid top mipmap in PAA file');
  }

  const argbPixels = paa.getArgb32PixelData(inputBuffer, mipLevel);
  await writePng(outputPath, mip.width, mip.height, argbPixels);

  process.stdout.write(`${JSON.stringify({ ok: true, input: inputPath, output: outputPath, width: mip.width, height: mip.height, mipLevel, maxDimension })}\n`);
}

main().catch((error) => {
  logError(error.message || String(error));
  process.exit(1);
});
