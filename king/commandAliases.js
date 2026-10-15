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
  ajudatexto: 'texthelp',
  conselho: 'council',
  aceitar: 'accept',
  aprovar: 'approve',
  adicionar: 'add',
  amizade: 'add-friend',
  conquistas: 'achievements',
  conselhos: 'council',
  ataque: 'attack',
  atacar: 'attack',
  defesa: 'defend',
  defender: 'defend',
  bloquear: 'block',
  bloqueados: 'blocklist',
  criar: 'craft',
  fabricar: 'craft',
  cozinhar: 'cook',
  converter: 'convert',
  escolher: 'choose',
  paises: 'country',
  definir: 'define',
  baixar: 'download',
  economia: 'economy',
  eventos: 'events',
  explorar: 'explore',
  amigos: 'friends',
  grupo: 'group',
  informacoes: 'info',
  informações: 'info',
  lideranca: 'leaderboard',
  liderança: 'leaderboard',
  lista: 'list',
  listaajuda: 'help',
  membros: 'members',
  minhasnotas: 'allnotes',
  nota: 'addnote',
  novanota: 'addnote',
  observacao: 'addnote',
  observar: 'viewnotes',
  pesquisarcomando: 'search',
  premio: 'daily',
  recompensa: 'daily',
  registrar: 'register',
  relatorio: 'report',
  removernota: 'delnote',
  rolar: 'dice',
  sorteio: 'random',
  statusbot: 'botstats',
  texto: 'texthelp',
  tempojogo: 'worldtime',
  traduzir: 'translate',
  usuario: 'profile',
  usuários: 'profile',
  vernotas: 'allnotes',
  votar: 'vote',
  avisos: 'notifications'
  ,baixaryoutube: 'yt'
  ,youtube: 'yt'
  ,baixarspotify: 'spotify'
  ,musica: 'spotify'
  ,baixartiktok: 'tiktok'
  ,tiktokbaixar: 'tiktok'
  ,baixarinstagram: 'ig'
  ,instagram: 'ig'
  ,baixarfacebook: 'fb'
  ,facebook: 'fb'
  ,baixarcapcut: 'capcut'
  ,baixarvideo: 'video'
  ,baixaraudio: 'sendaudio'
  ,baixarapk: 'apk'
  ,baixargdrive: 'gdrive'
  ,baixarmediafire: 'mediafire'
  ,baixarterabox: 'terabox'
  ,converteraudio: 'toaudio'
  ,converterimagem: 'toimg'
  ,convertervideo: 'tovideo'
  ,converterptt: 'toptt'
  ,download: 'download'
});

function normalizeCommand(command) {
  const normalized = String(command || '').trim().toLocaleLowerCase('pt-BR');
  return COMMAND_ALIASES_PT_BR[normalized] || normalized;
}

const COMMAND_LABELS_PT_BR = Object.freeze({
  ...Object.entries(COMMAND_ALIASES_PT_BR).reduce((labels, [alias, target]) => {
    if (!labels[target]) labels[target] = alias;
    return labels;
  }, {}),
  menu: 'menu',
});

function getCommandLabel(command) {
  const normalized = String(command || '').trim().toLocaleLowerCase('pt-BR');
  return COMMAND_LABELS_PT_BR[normalized] || normalized;
}

module.exports = {
  COMMAND_ALIASES_PT_BR,
  COMMAND_LABELS_PT_BR,
  normalizeCommand,
  getCommandLabel,
};
