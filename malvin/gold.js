'use strict';

const { mxd } = require('../king');
const { GlobalPlayer } = require('../king/rpg/model');
const {
  getPlayer, fetchPlayer, addGold, removeGold, transferGold,
  bankDeposit, bankWithdraw, addItem, removeItem, unlockAchievement,
  getTopByGold, forceSetGold, checkCooldown, setCooldown, formatCooldown,
} = require('../king/rpg/db');

const DAY = 24 * 60 * 60 * 1000;
const WORK_CD = 10 * 60 * 1000;
const SHOP = {
  escudo: { nome: 'Escudo de proteção', preco: 800, campo: null, descricao: 'protege contra um roubo por 24 horas' },
  amuleto: { nome: 'Amuleto Gold', preco: 500, campo: null, descricao: 'bônus virtual de 10% no próximo trabalho' },
  diamante: { nome: 'Diamante colecionável', preco: 1200, campo: 'diamonds', descricao: '+1 diamante' },
  vip: { nome: 'Título VIP', preco: 2500, campo: null, descricao: 'título virtual VIP' },
  caixa: { nome: 'Caixa de recompensa', preco: 350, campo: 'potions', descricao: 'contém uma poção virtual' },
};

const menu = `💎 *SOUSINHA BOT — GOLD* 💰

💵 *DINHEIRO*
• .saldo — carteira e banco
• .daily — recompensa diária
• .trabalhar — trabalhar e ganhar Gold
• .crime — evento fictício com risco
• .patrimonio — riqueza total

🏦 *BANCO*
• .banco • .depositar [valor] • .sacar [valor]
• .pix @usuario [valor] • .extrato

🛒 *LOJA*
• .loja • .comprar [item] • .vender [item]
• .inventario • .proteger

🥷 *EVENTOS*
• .roubar @usuario • .assaltar • .procurado
• .prisao • .fiança

🎮 *JOGOS*
• .apostar [valor] • .roleta • .duelo @usuario [valor]
• .missao • .dino

👑 *PERFIL E RANKING*
• .perfilgold • .rankmoney • .conquistas
• .transferir @usuario [valor]

⚙️ *ADMIN GOLD*
• .goldadd • .goldremove • .goldban
• .goldlogs • .goldconfig

ℹ️ .goldhelp • .goldregras`;

function amount(q) {
  const n = Number(String(q || '').match(/(?:^|\s)(\d+(?:[.,]\d+)?)(?:\s|$)/)?.[1]?.replace(',', '.'));
  return Number.isFinite(n) ? Math.floor(n) : 0;
}
function target(ctx) { return ctx.user || ctx.mentionedJid?.[0] || null; }
function fmt(n) { return Number(n || 0).toLocaleString('pt-BR'); }
function metaOf(player) { return player?.goldEconomy && typeof player.goldEconomy === 'object' ? player.goldEconomy : {}; }
async function saveMeta(jid, patch) {
  const player = await fetchPlayer(jid);
  const current = metaOf(player);
  const next = { ...current, ...patch };
  await GlobalPlayer.updateOne({ jid }, { $set: { goldEconomy: next } });
  return next;
}
async function logGold(jid, tipo, valor, detalhe = '') {
  const player = await fetchPlayer(jid);
  const history = Array.isArray(metaOf(player).history) ? metaOf(player).history : [];
  history.push({ tipo, valor, detalhe, em: new Date().toISOString() });
  await saveMeta(jid, { history: history.slice(-30) });
}
async function ensure(jid, botId) { return getPlayer(jid, botId); }
function validAmount(n) { return Number.isInteger(n) && n > 0 && n <= 1000000; }
function admin(ctx) { return Boolean(ctx.isSuperUser); }
function args(ctx) { return String(ctx.q || '').trim().split(/\s+/).filter(Boolean); }

mxd({ pattern: 'gold', aliases: ['goldhelp'], category: 'gold', react: '💎', description: 'Abrir o menu da economia Gold', filename: __filename }, async (from, Malvin, ctx) => ctx.reply(menu));
mxd({ pattern: 'goldregras', category: 'gold', react: '📜', description: 'Consultar as regras da economia Gold', filename: __filename }, async (from, Malvin, ctx) => ctx.reply('📜 *REGRAS GOLD*\n\nGold é uma moeda fictícia do bot. Não existe conversão para dinheiro real. Valores precisam ser positivos, transferências exigem saldo e comandos administrativos são exclusivos do dono/admin. Daily: 24 horas. Trabalho: 10 minutos.'));

mxd({ pattern: 'goldbalance', aliases: ['saldo', 'gold-saldo'], category: 'gold', react: '💰', description: 'Consultar carteira e banco', filename: __filename }, async (from, Malvin, ctx) => {
  const p = await ensure(ctx.sender, ctx.botId); return ctx.reply(`💰 *SEU SALDO*\n\n💵 Carteira: *${fmt(p.gold)} Gold*\n🏦 Banco: *${fmt(p.bank?.balance)} Gold*\n💎 Diamantes: *${fmt(p.diamonds)}*`);
});

mxd({ pattern: 'trabalhar', aliases: ['work'], category: 'gold', react: '💼', description: 'Trabalhar e ganhar Gold', filename: __filename }, async (from, Malvin, ctx) => {
  const p = await ensure(ctx.sender, ctx.botId); const cd = checkCooldown(p, 'work', WORK_CD);
  if (cd.onCooldown) return ctx.reply(`⏳ Aguarde *${formatCooldown(cd.remaining)}* para trabalhar novamente.`);
  const ganho = 100 + Math.floor(Math.random() * 251); await setCooldown(ctx.sender, 'work'); await addGold(ctx.sender, ganho); await logGold(ctx.sender, 'trabalho', ganho); return ctx.reply(`💼 Você trabalhou e recebeu *${fmt(ganho)} Gold*!`);
});

mxd({ pattern: 'crime', category: 'gold', react: '🥷', description: 'Participar de um crime fictício com risco', filename: __filename }, async (from, Malvin, ctx) => {
  const p = await ensure(ctx.sender, ctx.botId); const cd = checkCooldown(p, 'work', WORK_CD);
  if (cd.onCooldown) return ctx.reply(`⏳ Aguarde *${formatCooldown(cd.remaining)}* para tentar outro evento.`);
  await setCooldown(ctx.sender, 'work'); const risco = Math.min(300, Math.max(50, Math.floor(p.gold * 0.1))); const sucesso = Math.random() >= 0.35;
  if (sucesso) { const ganho = 150 + Math.floor(Math.random() * 401); await addGold(ctx.sender, ganho); await logGold(ctx.sender, 'crime', ganho, 'sucesso'); return ctx.reply(`🥷 Crime fictício concluído! Você ganhou *${fmt(ganho)} Gold*.`); }
  const perdido = Math.min(risco, p.gold); if (perdido) await removeGold(ctx.sender, perdido); await logGold(ctx.sender, 'crime', -perdido, 'falha'); return ctx.reply(`🚔 Você foi pego no evento fictício e perdeu *${fmt(perdido)} Gold*.`);
});

mxd({ pattern: 'patrimonio', category: 'gold', react: '🏛️', description: 'Consultar patrimônio total', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); const total = (p.gold || 0) + (p.bank?.balance || 0) + (p.diamonds || 0) * 100; return ctx.reply(`🏛️ *PATRIMÔNIO*\n\n💵 Carteira: ${fmt(p.gold)}\n🏦 Banco: ${fmt(p.bank?.balance)}\n💎 Diamantes: ${fmt(p.diamonds)}\n📊 Total estimado: *${fmt(total)} Gold*`); });

mxd({ pattern: 'banco', category: 'gold', react: '🏦', description: 'Consultar o banco virtual', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); return ctx.reply(`🏦 *BANCO GOLD*\nSaldo: *${fmt(p.bank?.balance)} Gold*\nCapacidade: *${fmt(p.bank?.capacity)} Gold*`); });
mxd({ pattern: 'depositar', category: 'gold', react: '📥', description: 'Depositar Gold no banco', filename: __filename }, async (from, Malvin, ctx) => { const n = amount(ctx.q); if (!validAmount(n)) return ctx.reply('❌ Informe um valor positivo. Exemplo: .depositar 500'); await ensure(ctx.sender, ctx.botId); const result = await bankDeposit(ctx.sender, n); if (!result || result.success === false) return ctx.reply('❌ Não foi possível depositar: saldo ou capacidade insuficiente.'); await logGold(ctx.sender, 'deposito', -n); return ctx.reply(`📥 Depósito realizado: *${fmt(n)} Gold*.`); });
mxd({ pattern: 'sacar', category: 'gold', react: '📤', description: 'Sacar Gold do banco', filename: __filename }, async (from, Malvin, ctx) => { const n = amount(ctx.q); if (!validAmount(n)) return ctx.reply('❌ Informe um valor positivo. Exemplo: .sacar 500'); await ensure(ctx.sender, ctx.botId); const result = await bankWithdraw(ctx.sender, n); if (!result) return ctx.reply('❌ Saldo bancário insuficiente.'); await logGold(ctx.sender, 'saque', n); return ctx.reply(`📤 Saque realizado: *${fmt(n)} Gold*.`); });

async function doTransfer(ctx, label) { const t = target(ctx); const n = amount(ctx.q); if (!t || t === ctx.sender) return ctx.reply('❌ Marque um usuário diferente. Exemplo: .pix @usuario 100'); if (!validAmount(n)) return ctx.reply('❌ Informe um valor positivo.'); await ensure(ctx.sender, ctx.botId); await ensure(t, ctx.botId); const r = await transferGold(ctx.sender, t, n); if (!r.success) return ctx.reply('❌ Saldo insuficiente para essa transferência.'); await logGold(ctx.sender, label, -n, t); await logGold(t, label, n, ctx.sender); return ctx.reply(`✅ ${label} realizado: *${fmt(n)} Gold* transferidos.`); }
mxd({ pattern: 'pix', category: 'gold', react: '💸', description: 'Transferir Gold para outro jogador', filename: __filename }, async (from, Malvin, ctx) => doTransfer(ctx, 'PIX'));
mxd({ pattern: 'transferir', aliases: ['transfergold'], category: 'gold', react: '💸', description: 'Transferir Gold para outro jogador', filename: __filename }, async (from, Malvin, ctx) => doTransfer(ctx, 'Transferência'));
mxd({ pattern: 'extrato', category: 'gold', react: '🧾', description: 'Consultar histórico de transações Gold', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); const h = metaOf(p).history || []; if (!h.length) return ctx.reply('🧾 Nenhuma transação registrada.'); return ctx.reply('🧾 *EXTRATO GOLD*\n\n' + h.slice(-10).reverse().map(x => `${new Date(x.em).toLocaleString('pt-BR')} — ${x.tipo}: ${x.valor > 0 ? '+' : ''}${fmt(x.valor)}`).join('\n')); });

mxd({ pattern: 'loja', category: 'gold', react: '🛒', description: 'Abrir a loja Gold', filename: __filename }, async (from, Malvin, ctx) => ctx.reply('🛒 *LOJA GOLD*\n\n' + Object.entries(SHOP).map(([k, v]) => `• ${k} — ${fmt(v.preco)} Gold — ${v.descricao}`).join('\n') + '\n\nUse .comprar [item]'));
mxd({ pattern: 'comprar', category: 'gold', react: '🛍️', description: 'Comprar item na loja Gold', filename: __filename }, async (from, Malvin, ctx) => { const key = args(ctx)[0]?.toLowerCase(); const item = SHOP[key]; if (!item) return ctx.reply('❌ Item inválido. Use .loja.'); const p = await ensure(ctx.sender, ctx.botId); const r = await removeGold(ctx.sender, item.preco); if (!r) return ctx.reply('❌ Gold insuficiente.'); if (item.campo === 'diamonds') await GlobalPlayer.updateOne({ jid: ctx.sender }, { $inc: { diamonds: 1 } }); else if (item.campo) await addItem(ctx.sender, item.campo, 1); const m = metaOf(p); const patch = item === SHOP.escudo ? { protectionUntil: new Date(Date.now() + DAY).toISOString() } : item === SHOP.amuleto ? { amuletUntil: new Date(Date.now() + DAY).toISOString() } : {}; if (item === SHOP.vip) await GlobalPlayer.updateOne({ jid: ctx.sender }, { $addToSet: { 'achievements.titles': 'Gold VIP' } }); if (Object.keys(patch).length) await saveMeta(ctx.sender, patch); await logGold(ctx.sender, 'compra', -item.preco, key); return ctx.reply(`✅ Você comprou *${item.nome}* por *${fmt(item.preco)} Gold*.`); });
mxd({ pattern: 'vender', category: 'gold', react: '💱', description: 'Vender itens permitidos por Gold', filename: __filename }, async (from, Malvin, ctx) => { const key = args(ctx)[0]?.toLowerCase(); const map = { potion: ['potions', 80], pocao: ['potions', 80], comida: ['food', 30], agua: ['water', 30] }; const item = map[key]; if (!item) return ctx.reply('❌ Itens revendíveis: pocao, comida ou agua.'); await ensure(ctx.sender, ctx.botId); if (!await removeItem(ctx.sender, item[0], 1)) return ctx.reply('❌ Você não possui esse item.'); await addGold(ctx.sender, item[1]); await logGold(ctx.sender, 'venda', item[1], key); return ctx.reply(`💱 Venda concluída: +${fmt(item[1])} Gold.`); });
mxd({ pattern: 'inventariogold', aliases: ['goldinventario'], category: 'gold', react: '🎒', description: 'Consultar inventário da economia Gold', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); const i = p.inventory || {}; return ctx.reply(`🎒 *INVENTÁRIO GOLD*\nPoções: ${i.potions || 0}\nComida: ${i.food || 0}\nÁgua: ${i.water || 0}\nDiamantes: ${p.diamonds || 0}\nProteção: ${metaOf(p).protectionUntil ? 'ativa' : 'inativa'}`); });
mxd({ pattern: 'proteger', category: 'gold', react: '🛡️', description: 'Ativar proteção contra roubos', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); if (!metaOf(p).protectionUntil || new Date(metaOf(p).protectionUntil) < new Date()) return ctx.reply('❌ Compre o item escudo na .loja para ativar a proteção.'); return ctx.reply('🛡️ Sua proteção contra roubos está ativa.'); });

mxd({ pattern: 'assaltar', category: 'gold', react: '🚨', description: 'Participar de um assalto fictício', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); const cd = checkCooldown(p, 'work', WORK_CD); if (cd.onCooldown) return ctx.reply(`⏳ Aguarde ${formatCooldown(cd.remaining)}.`); await setCooldown(ctx.sender, 'work'); const ganho = 80 + Math.floor(Math.random() * 321); await addGold(ctx.sender, ganho); await logGold(ctx.sender, 'assalto', ganho); return ctx.reply(`🚨 Evento fictício concluído. Você recebeu *${fmt(ganho)} Gold*.`); });
mxd({ pattern: 'procurado', category: 'gold', react: '🔎', description: 'Consultar nível de procurado', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); return ctx.reply(`🔎 Seu nível de procurado: *${fmt(p.bounty)}*`); });
mxd({ pattern: 'prisao', aliases: ['prisão'], category: 'gold', react: '⛓️', description: 'Consultar situação na prisão virtual', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); const preso = p.isJailed && (!p.jailUntil || new Date(p.jailUntil) > new Date()); return ctx.reply(preso ? `⛓️ Você está preso até ${new Date(p.jailUntil).toLocaleString('pt-BR')}.` : '✅ Você está livre.'); });
mxd({ pattern: 'fianca', aliases: ['fiança'], category: 'gold', react: '🔓', description: 'Pagar fiança virtual', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); if (!p.isJailed) return ctx.reply('✅ Você não está preso.'); const custo = 500; if (!await removeGold(ctx.sender, custo)) return ctx.reply(`❌ A fiança custa ${fmt(custo)} Gold.`); await GlobalPlayer.updateOne({ jid: ctx.sender }, { $set: { isJailed: false, jailUntil: null } }); return ctx.reply('🔓 Fiança paga. Você está livre.'); });

mxd({ pattern: 'apostar', aliases: ['aposta'], category: 'gold', react: '🎲', description: 'Apostar Gold em um minijogo', filename: __filename }, async (from, Malvin, ctx) => { const n = amount(ctx.q); if (!validAmount(n)) return ctx.reply('❌ Use .apostar [valor].'); await ensure(ctx.sender, ctx.botId); if (!await removeGold(ctx.sender, n)) return ctx.reply('❌ Gold insuficiente.'); const ganhou = Math.random() >= 0.5; const valor = ganhou ? n * 2 : 0; if (valor) await addGold(ctx.sender, valor); await logGold(ctx.sender, 'aposta', ganhou ? n : -n); return ctx.reply(ganhou ? `🎉 Você ganhou *${fmt(valor)} Gold*!` : `😔 Você perdeu *${fmt(n)} Gold*.`); });
mxd({ pattern: 'goldduelo', aliases: ['duelo'], category: 'gold', react: '⚔️', description: 'Disputar Gold em um duelo', filename: __filename }, async (from, Malvin, ctx) => { const t = target(ctx); const n = amount(ctx.q); if (!t || t === ctx.sender || !validAmount(n)) return ctx.reply('❌ Use .duelo @usuario [valor].'); await ensure(ctx.sender, ctx.botId); const other = await ensure(t, ctx.botId); if (!other || !await removeGold(ctx.sender, n)) return ctx.reply('❌ Você não tem Gold suficiente.'); if (!await removeGold(t, n)) { await addGold(ctx.sender, n); return ctx.reply('❌ O outro jogador não tem Gold suficiente.'); } const winner = Math.random() < 0.5 ? ctx.sender : t; await addGold(winner, n * 2); await logGold(ctx.sender, 'duelo', winner === ctx.sender ? n : -n); await logGold(t, 'duelo', winner === t ? n : -n); return ctx.reply(`⚔️ Vencedor do duelo: @${winner.split('@')[0]}\n💰 Prêmio: *${fmt(n * 2)} Gold*`, { mentions: [winner] }); });

mxd({ pattern: 'perfilgold', category: 'gold', react: '👑', description: 'Consultar perfil econômico', filename: __filename }, async (from, Malvin, ctx) => { const p = await ensure(ctx.sender, ctx.botId); return ctx.reply(`👑 *PERFIL GOLD*\n\n💰 Patrimônio: ${fmt((p.gold || 0) + (p.bank?.balance || 0))}\n📈 Gold ganho: ${fmt(metaOf(p).history?.filter(x => x.valor > 0).reduce((a, x) => a + x.valor, 0))}\n🛡️ Proteção: ${metaOf(p).protectionUntil ? 'ativa' : 'inativa'}\n🏆 Título: ${p.achievements?.activeTitle || 'nenhum'}`); });
mxd({ pattern: 'rankmoney', category: 'gold', react: '🏆', description: 'Ver ranking dos usuários mais ricos', filename: __filename }, async (from, Malvin, ctx) => { const list = await getTopByGold(10); if (!list?.length) return ctx.reply('🏆 Ainda não há ranking disponível.'); return ctx.reply('🏆 *RANKING GOLD*\n\n' + list.map((p, i) => `${i + 1}. ${p.username || p.jid.split('@')[0]} — ${fmt(p.gold)} Gold`).join('\n')); });

mxd({ pattern: 'goldadd', category: 'gold', react: '➕', description: 'Adicionar Gold a um usuário (admin)', filename: __filename }, async (from, Malvin, ctx) => { if (!admin(ctx)) return ctx.reply('❌ Comando exclusivo do administrador.'); const t = target(ctx); const n = amount(ctx.q); if (!t || !validAmount(n)) return ctx.reply('❌ Use .goldadd @usuario [valor].'); await ensure(t, ctx.botId); await addGold(t, n); await logGold(t, 'goldadd', n, ctx.sender); return ctx.reply(`✅ Foram adicionados *${fmt(n)} Gold* ao usuário marcado.`); });
mxd({ pattern: 'goldremove', category: 'gold', react: '➖', description: 'Remover Gold de um usuário (admin)', filename: __filename }, async (from, Malvin, ctx) => { if (!admin(ctx)) return ctx.reply('❌ Comando exclusivo do administrador.'); const t = target(ctx); const n = amount(ctx.q); if (!t || !validAmount(n)) return ctx.reply('❌ Use .goldremove @usuario [valor].'); await ensure(t, ctx.botId); const r = await removeGold(t, n); if (!r) return ctx.reply('❌ O usuário não possui Gold suficiente.'); await logGold(t, 'goldremove', -n, ctx.sender); return ctx.reply('✅ Gold removido com sucesso.'); });
mxd({ pattern: 'goldban', category: 'gold', react: '🚫', description: 'Bloquear usuário da economia Gold (admin)', filename: __filename }, async (from, Malvin, ctx) => { if (!admin(ctx)) return ctx.reply('❌ Comando exclusivo do administrador.'); const t = target(ctx); if (!t) return ctx.reply('❌ Marque um usuário.'); await ensure(t, ctx.botId); await GlobalPlayer.updateOne({ jid: t }, { $set: { rpgBanned: true } }); return ctx.reply('🚫 Usuário bloqueado da economia Gold/RPG.'); });
mxd({ pattern: 'goldlogs', category: 'gold', react: '📚', description: 'Consultar registros Gold (admin)', filename: __filename }, async (from, Malvin, ctx) => { if (!admin(ctx)) return ctx.reply('❌ Comando exclusivo do administrador.'); const p = await fetchPlayer(target(ctx) || ctx.sender); const h = metaOf(p).history || []; return ctx.reply('📚 *REGISTROS GOLD*\n' + (h.slice(-20).map(x => `${x.em} — ${x.tipo}: ${x.valor}`).join('\n') || 'Nenhum registro.')); });
mxd({ pattern: 'goldconfig', category: 'gold', react: '⚙️', description: 'Consultar configuração Gold (admin)', filename: __filename }, async (from, Malvin, ctx) => { if (!admin(ctx)) return ctx.reply('❌ Comando exclusivo do administrador.'); return ctx.reply('⚙️ *CONFIGURAÇÃO GOLD*\nDaily: 24 horas\nTrabalho: 10 minutos\nLimite de operação: 1.000.000 Gold\nMoeda: fictícia, sem conversão real.'); });
