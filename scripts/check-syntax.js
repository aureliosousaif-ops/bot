'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const ignored = new Set(['node_modules', '.git', 'temp']);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && fullPath.endsWith('.js')) files.push(fullPath);
  }
}

walk(root);
let failures = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures += 1;
    process.stderr.write(`\nERRO DE SINTAXE: ${path.relative(root, file)}\n${result.stderr || result.stdout}`);
  }
}
console.log(`Arquivos JavaScript verificados: ${files.length}`);
console.log(`Falhas de sintaxe: ${failures}`);
process.exitCode = failures ? 1 : 0;
