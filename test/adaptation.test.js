'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { COMMAND_ALIASES_PT_BR, normalizeCommand } = require('../king/commandAliases');

const root = path.join(__dirname, '..');
const malvinDir = path.join(root, 'malvin');
const commandFiles = fs.readdirSync(malvinDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => fs.readFileSync(path.join(malvinDir, file), 'utf8'));
const commandSource = commandFiles.join('\n');
const patterns = new Set(
  [...commandSource.matchAll(/pattern\s*:\s*["']([^"']+)["']/g)]
    .map((match) => match[1].toLocaleLowerCase('pt-BR'))
);
const existingNames = new Set(patterns);
for (const match of commandSource.matchAll(/aliases\s*:\s*\[([\s\S]*?)\]/g)) {
  for (const alias of match[1].matchAll(/["']([^"']+)["']/g)) {
    existingNames.add(alias[1].toLocaleLowerCase('pt-BR'));
  }
}

test('locale pt-BR contém as mesmas chaves de referência do inglês', () => {
  const en = JSON.parse(fs.readFileSync(path.join(root, 'king/i18n/locales/en.json'), 'utf8'));
  const pt = JSON.parse(fs.readFileSync(path.join(root, 'king/i18n/locales/pt-BR.json'), 'utf8'));
  assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort());
  assert.equal(pt._meta.code, 'pt-BR');
  assert.equal(pt._meta.name, 'Português (Brasil)');
});

test('aliases em português apontam para comandos registrados', () => {
  assert.ok(Object.keys(COMMAND_ALIASES_PT_BR).length >= 40);
  for (const [alias, target] of Object.entries(COMMAND_ALIASES_PT_BR)) {
    assert.ok(patterns.has(target), `Destino do alias ${alias} não encontrado: ${target}`);
    assert.ok(alias.trim(), 'Alias vazio encontrado');
  }
});

test('aliases não substituem nomes/aliases existentes de outro comando', () => {
  for (const [alias, target] of Object.entries(COMMAND_ALIASES_PT_BR)) {
    if (existingNames.has(alias) && alias !== target) {
      assert.fail(`O alias ${alias} já existe no projeto e conflita com ${target}`);
    }
  }
});

test('normalização preserva comandos originais e resolve aliases pt-BR', () => {
  assert.equal(normalizeCommand('ajuda'), 'menu');
  assert.equal(normalizeCommand('FIGURINHA'), 'sticker');
  assert.equal(normalizeCommand('dono'), 'owner');
  assert.equal(normalizeCommand('ping'), 'ping');
  assert.equal(normalizeCommand('comando-inexistente'), 'comando-inexistente');
});

test('serializador mantém prefixo preferencial / e compatibilidade com .', () => {
  const source = fs.readFileSync(path.join(root, 'king/socket/msgSerializer.js'), 'utf8');
  assert.match(source, /settings\.PREFIX === '\.'/);
  assert.match(source, /configuredPrefix === '\/' \? '\.' : '\/'/);
  assert.match(source, /normalizeCommand\(command\)/);
});

test('tradutor usa português brasileiro como idioma padrão e substitui variáveis', () => {
  const { GLOBAL_FALLBACK, translate, isValidLocale } = require('../king/i18n');
  assert.equal(GLOBAL_FALLBACK, 'pt-BR');
  assert.equal(isValidLocale('pt-BR'), true);
  assert.equal(translate('common.error_generic', 'pt-BR', { error: 'teste' }), '❌ Algo deu errado: teste');
  assert.equal(translate('chave.que.nao.existe', 'pt-BR'), 'chave.que.nao.existe');
});

test('package não instala módulos nativos do Node como dependências npm', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  for (const builtin of ['fs', 'path', 'stream', 'util', 'buffer']) {
    assert.equal(pkg.dependencies[builtin], undefined, `Remova a dependência npm desnecessária: ${builtin}`);
  }
  assert.equal(pkg.name, 'sousinha-bot-premium');
});

test('arquivo de exemplo não contém credenciais reais e o gitignore protege o .env', () => {
  const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
  const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  assert.match(envExample, /^SESSION_ID=\s*$/m);
  assert.match(envExample, /^MALVIN_API_KEY=\s*$/m);
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
});
