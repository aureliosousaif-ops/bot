'use strict';
const assert = require('node:assert/strict');
const { isOwnerAuthorized } = require('../malvin/ownerAuth');
const { allowedOwner } = require('../malvin/rental');

const owner = '5563999215379';

const ownerContexts = [
  { sender: `${owner}@s.whatsapp.net` },
  { mek: { key: { participantPn: `${owner}:2@s.whatsapp.net` } } },
  { mek: { key: { senderPn: `${owner}@s.whatsapp.net` } } },
  {
    mek: { key: { participant: '123456789@lid' } },
    groupInfo: { participants: [{ lid: '123456789@lid', pn: `${owner}@s.whatsapp.net` }] },
  },
];

for (const context of ownerContexts) {
  assert.equal(isOwnerAuthorized(context), true, `Dono não reconhecido: ${JSON.stringify(context)}`);
  assert.equal(allowedOwner(context), true, `Aluguel bloqueou o dono: ${JSON.stringify(context)}`);
}

const otherUser = { mek: { key: { participantPn: '5511999999999@s.whatsapp.net' } } };
assert.equal(isOwnerAuthorized(otherUser), false);
assert.equal(allowedOwner(otherUser), false);
assert.equal(allowedOwner({ sender: '123456789@g.us' }), false);

console.log('OK: proprietário autorizado nos formatos sender/PN/LID; outro usuário e JID de grupo bloqueados.');
