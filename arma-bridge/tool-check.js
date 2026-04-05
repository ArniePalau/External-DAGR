#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function log(line = '') {
  process.stdout.write(`${line}\n`);
}

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function findFirstExisting(candidates) {
  for (const candidate of candidates) {
    if (exists(candidate)) return candidate;
  }
  return null;
}

function firstTokenFromCommand(command) {
  if (!command) return null;
  const trimmed = String(command).trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('"')) {
    const nextQuote = trimmed.indexOf('"', 1);
    if (nextQuote > 1) return trimmed.slice(1, nextQuote);
  }

  const parts = trimmed.split(/\s+/);
  return parts[0] || null;
}

function describeCommandStatus(name, commandValue, fallbackPath) {
  const token = firstTokenFromCommand(commandValue);
  const tokenLooksLikePath = token && (token.includes('\\') || token.includes('/') || token.includes(':'));
  const tokenExists = tokenLooksLikePath ? exists(token) : null;

  if (commandValue) {
    if (tokenExists === false) {
      return {
        name,
        status: 'configured-bad-path',
        detail: `${name}: configured but binary not found -> ${token}`,
        command: commandValue,
      };
    }

    return {
      name,
      status: 'configured-ok',
      detail: `${name}: configured`,
      command: commandValue,
    };
  }

  if (fallbackPath) {
    return {
      name,
      status: 'autodetected',
      detail: `${name}: auto-detected -> ${fallbackPath}`,
      command: null,
    };
  }

  return {
    name,
    status: 'missing',
    detail: `${name}: MISSING`,
    command: null,
  };
}

function getNodeInfo() {
  const nodeExecPath = process.execPath;
  const version = process.version;
  return { path: nodeExecPath, version };
}

function detectPboPath() {
  const candidates = [
    'C:\\Program Files (x86)\\Mikero\\DePboTools\\bin\\ExtractPbo.exe',
    'C:\\Program Files\\Mikero\\DePboTools\\bin\\ExtractPbo.exe',
    'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Arma 3 Tools\\ExtractPbo\\ExtractPbo.exe',
    'C:\\Program Files\\Steam\\steamapps\\common\\Arma 3 Tools\\ExtractPbo\\ExtractPbo.exe',
  ];
  return findFirstExisting(candidates);
}

function detectPaaPath() {
  const candidates = [
    'C:\\Program Files (x86)\\Mikero\\DePboTools\\bin\\PaaToPng.exe',
    'C:\\Program Files\\Mikero\\DePboTools\\bin\\PaaToPng.exe',
    'C:\\Program Files (x86)\\Mikero\\DePboTools\\bin\\paa2img.exe',
    'C:\\Program Files\\Mikero\\DePboTools\\bin\\paa2img.exe',
    'C:\\Program Files (x86)\\Mikero\\DePboTools\\bin\\paa2png.exe',
    'C:\\Program Files\\Mikero\\DePboTools\\bin\\paa2png.exe',
  ];
  return findFirstExisting(candidates);
}

function printSummary() {
  const node = getNodeInfo();
  const mapExtractor = process.env.MICRODAGR_MAP_EXTRACT_CMD || '';
  const pboCmd = process.env.MICRODAGR_PBO_EXTRACT_CMD || '';
  const paaCmd = process.env.MICRODAGR_PAA_CONVERT_CMD || '';

  const pboDetected = detectPboPath();
  const paaDetected = detectPaaPath();

  const pbo = describeCommandStatus('PBO extractor', pboCmd, pboDetected);
  const paa = describeCommandStatus('PAA converter', paaCmd, paaDetected);

  const hasPbo = pbo.status === 'configured-ok' || pbo.status === 'autodetected';
  const hasPaa = paa.status === 'configured-ok' || paa.status === 'autodetected';

  let readiness = 'PARTIAL';
  if (hasPbo && hasPaa) readiness = 'FULL';
  if (!hasPbo && !hasPaa) readiness = 'LIMITED';

  log('----------------------------------------------');
  log('[ToolCheck] Bridge startup diagnostics');
  log(`Node: ${node.version} (${node.path})`);
  log(`Map extractor cmd: ${mapExtractor || 'MISSING'}`);
  log(pbo.detail);
  if (pbo.command) log(`  cmd: ${pbo.command}`);
  log(paa.detail);
  if (paa.command) log(`  cmd: ${paa.command}`);
  log(`Readiness: ${readiness}`);

  if (!hasPbo) {
    log('Hint: Install/configure a PBO extractor to support packed terrain assets.');
  }

  if (!hasPaa) {
    log('Hint: Install/configure a PAA converter to render many Arma maps.');
  }

  log('----------------------------------------------');
}

printSummary();
