'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const source = fs.readFileSync('malvin/rental.js', 'utf8');
const match = source.match(/const OWNER_NUMBER[\s\S]*?function groupOnly/);
assert.ok(match, 'Não foi possível localizar a autorização em rental.js');
const authorizationSource = match[0].replace(/function groupOnly$/, '');
const context = { module: { exports: {} }, console, config: { OWNER_NUMBER: '5563999215379' } };
vm.runInNewContext(`${authorizationSource}\nmodule.exports = { normalizeNumber, allowedOwner };`, context);
const { allowedOwner, normalizeNumber } = context.module.exports;

assert.equal(normalizeNumber('5563999215379@s.whatsapp.net'), '5563999215379');
assert.equal(normalizeNumber('5563999215379:7@s.whatsapp.net'), '5563999215379');
assert.equal(allowedOwner({ sender: '5563999215379@s.whatsapp.net' }), true);
assert.equal(allowedOwner({ mek: { key: { participantPn: '5563999215379@s.whatsapp.net' } } }), true);
assert.equal(allowedOwner({ m: { key: { senderPn: '5563999215379:2@s.whatsapp.net' } } }), true);
assert.equal(allowedOwner({ authorMessage: '5563999215379@s.whatsapp.net' }), true);
assert.equal(allowedOwner({ sender: '5511999999999@s.whatsapp.net' }), false);
assert.equal(allowedOwner({ mek: { key: { participantPn: '5511999999999@s.whatsapp.net' } } }), false);
console.log('OK: autorização do dono reconhece sender, participantPn e senderPn e rejeita outro número.');
