'use strict';

const { mxd } = require('../king');
const { getPlayer, grantExp, addGold } = require('../king/rpg/db');

const partidas = new Map();
const MAX_PONTOS = 30;

function ajuda(reply) {
  return reply(
    '🦖 *DINO RUNNER*\n\n' +
    '`.dino` — iniciar uma corrida\n' +
    '`.dino pular` — pular o obstáculo\n' +
    '`.dino parar` — encerrar e receber Gold\n\n' +
    'A cada pulo você ganha pontos. Se bater no obstáculo, a corrida termina.'
  );
}

mxd(
  {
    pattern: 'dino',
    aliases: ['dinossauro', 'dinohelp'],
    category: 'game',
    react: '🦖',
    description: 'Jogar Dino Runner e ganhar Gold',
    filename: __filename,
  },
  async (from, Malvin, conText) => {
    const { sender, q = '', reply, react, botId } = conText;
    const acao = String(q).trim().toLowerCase();

    if (acao === 'ajuda' || acao === 'help' || conText.pattern === 'dinohelp') {
      return ajuda(reply);
    }

    if (acao === 'parar' || acao === 'stop') {
      const partida = partidas.get(from);
      if (!partida || partida.sender !== sender) return reply('❌ Você não tem uma corrida Dino ativa.');
      partidas.delete(from);
      const premio = Math.max(0, partida.pontos * 5);
      if (premio > 0) await addGold(sender, premio);
      return reply(`🏁 *Corrida encerrada!*\n\n🦖 Pontos: *${partida.pontos}*\n💰 Recompensa: *+${premio} Gold*`);
    }

    if (acao && !['pular', 'pulo', 'jump', 'iniciar', 'start'].includes(acao)) {
      return ajuda(reply);
    }

    let partida = partidas.get(from);
    if (!partida || partida.sender !== sender) {
      await getPlayer(sender, botId);
      partida = { sender, pontos: 0, rodada: 0 };
      partidas.set(from, partida);
      return reply('🦖 *Dino iniciado!*\n\nDigite `.dino pular` para desviar do primeiro obstáculo.\nDigite `.dino parar` para encerrar e receber Gold.');
    }

    partida.rodada += 1;
    const bateu = Math.random() < 0.22;
    if (bateu) {
      partidas.delete(from);
      const premio = partida.pontos * 5;
      if (premio > 0) await addGold(sender, premio);
      await react('💥');
      return reply(`💥 *O Dino bateu no obstáculo!*\n\n🦖 Pontos: *${partida.pontos}*\n💰 Recompensa: *+${premio} Gold*\n\nDigite ".dino" para tentar novamente.`);
    }

    partida.pontos += 1;
    const premioAtual = partida.pontos * 5;
    if (partida.pontos >= MAX_PONTOS) {
      partidas.delete(from);
      await grantExp(sender, 50, premioAtual, botId);
      await react('🏆');
      return reply(`🏆 *Você venceu o Dino Runner!*\n\n🦖 Pontos: *${partida.pontos}*\n💰 Recompensa: *+${premioAtual} Gold*\n✨ EXP: *+50*`);
    }

    await react('⬆️');
    return reply(`⬆️ *Pulo perfeito!*\n\n🦖 Pontos: *${partida.pontos}*\n💰 Gold ao encerrar: *${premioAtual}*\n\nDigite ".dino pular" novamente ou ".dino parar".`);
  }
);
