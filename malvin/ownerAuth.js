'use strict';

const config = require('../config');

const FALLBACK_OWNER = '5563999215379';

function normalizeWhatsAppId(value) {
  if (!value) return '';
  const raw = typeof value === 'object' ? (value.jid || value.id || value.pn || value.phoneNumber || '') : value;
  const text = String(raw).trim().toLowerCase();
  if (!text || text.endsWith('@g.us') || text.endsWith('@broadcast')) return '';
  return text
    .split('@')[0]
    .split(':')[0]
    .split('/')[0]
    .replace(/\D/g, '');
}

function configuredOwnerNumbers(value = config.OWNER_NUMBER) {
  return String(value || FALLBACK_OWNER)
    .split(',')
    .map(normalizeWhatsAppId)
    .filter((number) => number.length >= 8);
}

function collectMessageIds(context = {}) {
  const key = context.messageKey || context.mek?.key || context.m?.key || {};
  const ids = [
    context.sender,
    context.authorMessage,
    context.messageAuthor,
    context.groupMember,
    context.user,
    key.senderPn,
    key.participantPn,
    key.participantAlt,
    key.remoteJidAlt,
    key.participant,
    key.remoteJid,
  ];

  const participants = context.groupInfo?.participants || context.participants || [];
  for (const candidate of ids) {
    const candidateText = String(candidate || '').toLowerCase();
    if (!candidateText.endsWith('@lid')) continue;
    const participant = participants.find((item) => {
      const idsForParticipant = [item?.id, item?.jid, item?.lid, item?.pn, item?.phoneNumber]
        .map((value) => String(value || '').toLowerCase());
      return idsForParticipant.includes(candidateText);
    });
    if (participant) ids.push(participant.pn, participant.phoneNumber, participant.jid, participant.id);
  }

  return ids.map(normalizeWhatsAppId).filter(Boolean);
}

function isOwnerAuthorized(context = {}, options = {}) {
  if (options.allowSuperUser && (context.isSuperUser === true || context.isOwner === true)) return true;
  const owners = new Set(configuredOwnerNumbers(options.ownerNumber));
  if (!owners.size) return false;
  return collectMessageIds(context).some((candidate) => owners.has(candidate));
}

function ownerNumberForDisplay(value = config.OWNER_NUMBER) {
  return configuredOwnerNumbers(value)[0] || FALLBACK_OWNER;
}

module.exports = {
  FALLBACK_OWNER,
  normalizeWhatsAppId,
  configuredOwnerNumbers,
  collectMessageIds,
  isOwnerAuthorized,
  ownerNumberForDisplay,
};
