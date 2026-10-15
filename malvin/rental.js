'use strict';

const { mxd } = require('../king');
const { getGroupSetting, setGroupSetting, getAllGroupSettings, getConfiguredGroupJids } = require('../king/database/groupConfig');

const OWNER_NUMBER = '5563999215379';
const CONTROL_COMMANDS = new Set(['ativarbot', 'desativarbot', 'alugar', 'statusaluguel']);
let rentalMonitorStarted = false;

function parseDate(value, endOfDay = false) {
  const m = String(value || '').trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!m) return null;
  const date = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
  if (date.getFullYear() !== Number(m[3]) || date.getMonth() !== Number(m[2]) - 1 || date.getDate() !== Number(m[1])) return null;
  return date;
}

function formatDate(value) {
  if (!value) return 'não cadastrada';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'inválida' : date.toLocaleDateString('pt-BR');
}

function allowedOwner(ctx) {
  return String(ctx.sender || '').split('@')[0] === OWNER_NUMBER;
}

function groupOnly(ctx) {
  return ctx.isGroup === true;
}

function remainingDays(end) {
  if (!end) return 0;
  const ms = new Date(end).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / 86400000) : 0;
}

async function checkRentalExpirations(Malvin) {
  const jids = await getConfiguredGroupJids();
  const thresholds = [1, 3, 7];
  const ownerJid = `${OWNER_NUMBER}@s.whatsapp.net`;
  for (const jid of jids) {
    try {
      const settings = await getAllGroupSettings(jid);
      if (settings.BOT_ENABLED !== 'true' || !settings.RENT_END) continue;
      const end = new Date(settings.RENT_END);
      const days = remainingDays(end);
      const threshold = thresholds.find((value) => days <= value);
      if (!threshold || days < 1) continue;
      const noticeKey = `RENT_NOTICE_${threshold}`;
      if (settings[noticeKey] === settings.RENT_END) continue;
      await Malvin.sendMessage(ownerJid, {
        text: `⚠️ *AVISO DE VENCIMENTO DE ALUGUEL*\n\nGrupo: *${jid}*\nO aluguel vence em *${days} dia(s)*, no dia *${formatDate(settings.RENT_END)}*.\n\nUse no grupo:\n.renovaraluguel 30\n\nO aviso de ${threshold} dia(s) foi enviado automaticamente pelo Sousinha Bot.`
      });
      await setGroupSetting(jid, noticeKey, settings.RENT_END);
    } catch (error) {
      console.error(`[RENTAL_MONITOR] Falha ao verificar ${jid}:`, error.message);
    }
  }
}

function startRentalExpiryMonitor(Malvin) {
  if (rentalMonitorStarted || !Malvin) return;
  rentalMonitorStarted = true;
  const run = () => checkRentalExpirations(Malvin).catch((error) => console.error('[RENTAL_MONITOR] Erro:', error.message));
  run();
  const interval = setInterval(run, 6 * 60 * 60 * 1000);
  if (typeof interval.unref === 'function') interval.unref();
}

mxd({
  pattern: 'ativarbot',
  aliases: ['ativargrupo', 'botativar'],
  category: 'settings',
  react: '✅',
  description: 'Ativar o bot neste grupo após autorização do dono',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx)) return ctx.reply(`❌ Somente o dono pode ativar o bot. Dono: ${OWNER_NUMBER}`);
  const start = await getGroupSetting(from, 'RENT_START');
  const end = await getGroupSetting(from, 'RENT_END');
  if (!start || !end) return ctx.reply('❌ Cadastre o período primeiro com:\n.alugar DD/MM/AAAA DD/MM/AAAA');
  const now = Date.now();
  if (now < new Date(start).getTime() || now > new Date(end).getTime()) return ctx.reply(`❌ O período cadastrado não está vigente.\nInício: ${formatDate(start)}\nFim: ${formatDate(end)}`);
  await setGroupSetting(from, 'BOT_ENABLED', 'true');
  return ctx.reply(`✅ *Sousinha Bot ativado neste grupo.*\nAluguel: ${formatDate(start)} até ${formatDate(end)}`);
});

mxd({
  pattern: 'desativarbot',
  aliases: ['desativargrupo', 'botdesativar'],
  category: 'settings',
  react: '⏸️',
  description: 'Desativar o bot neste grupo',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx)) return ctx.reply(`❌ Somente o dono pode desativar o bot. Dono: ${OWNER_NUMBER}`);
  await setGroupSetting(from, 'BOT_ENABLED', 'false');
  return ctx.reply('⏸️ Sousinha Bot desativado neste grupo.');
});

mxd({
  pattern: 'alugar',
  aliases: ['cadastraraluguel'],
  category: 'settings',
  react: '📅',
  description: 'Cadastrar as datas de início e encerramento do aluguel',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx)) return ctx.reply(`❌ Somente o dono pode cadastrar o aluguel. Dono: ${OWNER_NUMBER}`);
  const parts = String(ctx.q || '').trim().split(/\s+/);
  const start = parseDate(parts[0]);
  const end = parseDate(parts[1], true);
  if (!start || !end || end <= start) return ctx.reply('❌ Use duas datas válidas no formato:\n.alugar DD/MM/AAAA DD/MM/AAAA\n\nExemplo: .alugar 15/10/2026 15/11/2026');
  await setGroupSetting(from, 'RENT_START', start.toISOString());
  await setGroupSetting(from, 'RENT_END', end.toISOString());
  await setGroupSetting(from, 'BOT_ENABLED', 'false');
  return ctx.reply(`📅 *Aluguel cadastrado.*\n\nInício: *${formatDate(start)}*\nEncerramento: *${formatDate(end)}*\n\nAgora use *.ativarbot* para liberar o bot neste grupo.`);
});

mxd({
  pattern: 'statusaluguel',
  aliases: ['aluguels', 'statusgrupo'],
  category: 'settings',
  react: '📊',
  description: 'Consultar o status de ativação e aluguel do grupo',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx) && !ctx.isAdmin) return ctx.reply(`❌ Somente o dono ou administrador pode consultar. Dono: ${OWNER_NUMBER}`);
  const enabled = await getGroupSetting(from, 'BOT_ENABLED');
  const start = await getGroupSetting(from, 'RENT_START');
  const end = await getGroupSetting(from, 'RENT_END');
  const vigente = start && end && Date.now() >= new Date(start).getTime() && Date.now() <= new Date(end).getTime();
  return ctx.reply(`📊 *STATUS DO SOUSINHA BOT*\n\nAtivado: *${enabled === 'true' ? 'sim' : 'não'}*\nAluguel vigente: *${vigente ? 'sim' : 'não'}*\nInício: *${formatDate(start)}*\nEncerramento: *${formatDate(end)}*`);
});

mxd({
  pattern: 'renovaraluguel',
  aliases: ['estenderaluguel', 'renovargrupo', 'estendergrupo'],
  category: 'settings',
  react: '🔄',
  description: 'Estender ou renovar o período de aluguel do grupo',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx)) return ctx.reply(`❌ Somente o dono pode renovar o aluguel. Dono: ${OWNER_NUMBER}`);

  const value = String(ctx.q || '').trim();
  if (!value) return ctx.reply('❌ Informe uma quantidade de dias ou uma nova data final.\n\nExemplos:\n.renovaraluguel 30\n.renovaraluguel 15/12/2026');

  const currentEnd = await getGroupSetting(from, 'RENT_END');
  const currentStart = await getGroupSetting(from, 'RENT_START');
  const parsedDate = parseDate(value, true);
  let newEnd;
  let message;

  if (parsedDate) {
    newEnd = parsedDate;
    message = `nova data final: *${formatDate(newEnd)}*`;
  } else if (/^\d+$/.test(value)) {
    const days = Number(value);
    if (days < 1 || days > 3650) return ctx.reply('❌ Informe entre 1 e 3650 dias.');
    const base = currentEnd && new Date(currentEnd).getTime() > Date.now() ? new Date(currentEnd) : new Date();
    newEnd = new Date(base.getTime() + days * 86400000);
    newEnd.setHours(23, 59, 59, 999);
    message = `extensão de *${days} dia(s)* a partir do período atual`;
  } else {
    return ctx.reply('❌ Use uma quantidade de dias ou uma data no formato DD/MM/AAAA.');
  }

  const start = currentStart && !Number.isNaN(new Date(currentStart).getTime())
    ? new Date(currentStart)
    : new Date();
  if (newEnd <= start) return ctx.reply('❌ A nova data final precisa ser posterior ao início do aluguel.');

  await setGroupSetting(from, 'RENT_START', start.toISOString());
  await setGroupSetting(from, 'RENT_END', newEnd.toISOString());
  await setGroupSetting(from, 'BOT_ENABLED', 'true');
  return ctx.reply(`✅ *Aluguel renovado com sucesso!*\n\n${message}\n📅 Início: *${formatDate(start)}*\n📅 Encerramento: *${formatDate(newEnd)}*\n⏳ Dias restantes: *${remainingDays(newEnd)}*\n\n🟢 O bot foi reativado neste grupo.`);
});

mxd({
  pattern: 'listaalugueis',
  aliases: ['aluguéis', 'alugueis', 'gruposativos'],
  category: 'settings',
  react: '📋',
  description: 'Listar grupos cadastrados e dias restantes de aluguel',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx)) return ctx.reply(`❌ Somente o dono pode consultar a lista. Dono: ${OWNER_NUMBER}`);
  const jids = await getConfiguredGroupJids();
  if (!jids.length) return ctx.reply('📋 Nenhum grupo possui aluguel cadastrado.');
  const rows = [];
  for (const jid of jids) {
    const settings = await getAllGroupSettings(jid);
    const end = settings.RENT_END;
    const days = remainingDays(end);
    const enabled = settings.BOT_ENABLED === 'true' && days > 0;
    rows.push(`${enabled ? '🟢' : '🔴'} ${jid}\n   ${enabled ? 'ATIVO' : 'INATIVO'} | ${days} dia(s) restante(s)\n   ${formatDate(settings.RENT_START)} até ${formatDate(end)}`);
  }
  return ctx.reply(`📋 *LISTA DE ALUGUÉIS DO SOUSINHA BOT*\n\n${rows.join('\n\n')}`);
});

mxd({
  pattern: 'gruposalugados',
  aliases: ['gruposcomaluguel', 'alugueisativos', 'aluguelativo'],
  category: 'settings',
  react: '🟢',
  description: 'Listar somente grupos com aluguel vigente e bot ativo',
  filename: __filename,
}, async (from, Malvin, ctx) => {
  if (!groupOnly(ctx)) return ctx.reply(`❌ Este comando só funciona em grupo. Dono: ${OWNER_NUMBER}`);
  if (!allowedOwner(ctx)) return ctx.reply(`❌ Somente o dono pode consultar a lista. Dono: ${OWNER_NUMBER}`);
  const jids = await getConfiguredGroupJids();
  const rows = [];
  for (const jid of jids) {
    const settings = await getAllGroupSettings(jid);
    const days = remainingDays(settings.RENT_END);
    if (settings.BOT_ENABLED === 'true' && days > 0) {
      rows.push(`🟢 ${jid}\n   ${days} dia(s) restante(s)\n   ${formatDate(settings.RENT_START)} até ${formatDate(settings.RENT_END)}`);
    }
  }
  if (!rows.length) return ctx.reply('📋 Nenhum grupo está com aluguel vigente e bot ativo no momento.');
  return ctx.reply(`🟢 *GRUPOS COM ALUGUEL ATIVO*\n\n${rows.join('\n\n')}`);
});

module.exports = { CONTROL_COMMANDS, startRentalExpiryMonitor, checkRentalExpirations };
