#!/usr/bin/env node
const { execSync } = require('child_process');

function isDockerAvailable() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isMongoContainerRunning() {
  try {
    // Look for a running container named colman-mongo
    const out = execSync('docker ps --filter name=colman-mongo --filter status=running --format "{{.Names}}"', { encoding: 'utf8' });
    return out.trim().length > 0;
  } catch (e) {
    return false;
  }
}

function upMongo() {
  try {
    console.log('Starting mongo using docker compose...');
    execSync('docker compose up -d mongo', { stdio: 'inherit' });
    console.log('Mongo is up.');
  } catch (e) {
    console.error('Failed to start mongo via docker compose:', e.message || e);
    process.exit(1);
  }
}

function main() {
  if (!isDockerAvailable()) {
    console.warn('Docker not found on PATH. Skipping mongo auto-start.');
    return;
  }

  if (isMongoContainerRunning()) {
    console.log('Mongo container already running.');
    return;
  }

  // Not running -> try to start
  upMongo();
}

main();
