let commands = [];
const tabCmds = [];
// Variantes legadas que duplicavam os baixadores principais. Mantemos os
// comandos estáveis (yt, tiktok, twitter, snack) e evitamos poluir o menu.
const DISABLED_COMMANDS = new Set([
  "tiktok2",
  "tiktok5",
  "tiktok7",
  "tiktokv2",
  "twitter2",
  "snackvideo2"
]);
const evt = {
  events: {},
  on(cleanVar0005, cleanVar0003) {
    if (!this.events[cleanVar0005]) {
      this.events[cleanVar0005] = [];
    }
    this.events[cleanVar0005].push(cleanVar0003);
  },
  emit(cleanVar0006, cleanVar0010) {
    if (this.events[cleanVar0006]) {
      this.events[cleanVar0006].forEach(cleanVar0001 => cleanVar0001(cleanVar0010));
    }
  }
};
function mxd(cleanVar0002, cleanVar0004) {
  let cleanVar0008 = cleanVar0002;
  if (DISABLED_COMMANDS.has(String(cleanVar0002?.pattern || "").toLowerCase())) {
    return cleanVar0008;
  }
  if (!cleanVar0002.category) {
    cleanVar0008.category = "general";
  }
  if (!cleanVar0002.react) {
    cleanVar0008.react = "🚀";
  }
  if (!cleanVar0002.dontAddCommandList) {
    cleanVar0008.dontAddCommandList = false;
  }
  cleanVar0008.function = cleanVar0004;
  const cleanVar0011 = new Error().stack;
  const cleanVar0009 = cleanVar0011.split("\n")[2].match(/\((.*):\d+:\d+\)/)[1];
  cleanVar0008.filename = cleanVar0009;
  commands.push(cleanVar0008);
  return cleanVar0008;
}
const cleanVar0007 = {
  mxd: mxd,
  commands: commands,
  evt: evt
};
module.exports = cleanVar0007;
evt.commands = commands;
