'use strict';

/**
 * Aliases em português para comandos que já existem no projeto original.
 * Os nomes originais em inglês continuam válidos. Não adicione aqui um
 * destino sem confirmar que existe em algum módulo de comandos.
 */
const COMMAND_ALIASES_PT_BR = Object.freeze({
  ajuda: 'menu',
  figurinha: 'sticker',
  dono: 'owner',
  saldo: 'balance',
  clima: 'weather',
  piada: 'joke',
  pais: 'country',
  meuip: 'myip',
  perfil: 'profile',
  configuracoes: 'settings',
  configurações: 'settings',
  prefixo: 'setprefix',
  idioma: 'lang',
  idiomagrupo: 'setgrouplang',
  boasvindas: 'setwelcome',
  despedida: 'setgoodbye',
  calculadora: 'calc',
  calcular: 'calc',
  idade: 'age',
  senha: 'password',
  codigoqr: 'qr',
  qr: 'qr',
  uptime: 'uptime',
  menu: 'menu',
  jogos: 'games',
  notas: 'notes',
  anotacoes: 'notes',
  anotações: 'notes',
  sorte: 'random',
  moeda: 'coinflip',
  dado: 'dice',
  roleta: 'roulette',
  promover: 'promote',
  rebaixar: 'demote',
  remover: 'kick',
  mutar: 'mute',
  desmutar: 'unmute',
  marcar: 'tagall',
  marcaradmins: 'tagadmins',
  tempo: 'weather',
  hora: 'time',
  fuso: 'timezone',
  noticias: 'news',
  notícias: 'news',
  pesquisar: 'search-gate',
  inventario: 'inventory',
  inventário: 'inventory',
  missao: 'quests',
  missões: 'quests',
  ranking: 'leaderboard',
  nivel: 'level',
  nível: 'level',
  pontos: 'stats',
  ajudaesportes: 'sportshelp',
  ajudaia: 'aimenu',
  ajudatexto: 'texthelp'
});

function normalizeCommand(command) {
  const normalized = String(command || '').trim().toLocaleLowerCase('pt-BR');
  return COMMAND_ALIASES_PT_BR[normalized] || normalized;
}

module.exports = { COMMAND_ALIASES_PT_BR, normalizeCommand };
