let commands = [];
const tabCmds = [];
const evt = {
  events: {},
  on(_0x30332c, _0x20168f) {
    if (!this.events[_0x30332c]) {
      this.events[_0x30332c] = [];
    }
    this.events[_0x30332c].push(_0x20168f);
  },
  emit(_0x32ef0a, _0x5ba4fd) {
    if (this.events[_0x32ef0a]) {
      this.events[_0x32ef0a].forEach(_0x10b2d3 => _0x10b2d3(_0x5ba4fd));
    }
  }
};
function mxd(_0x170526, _0x2e6cc5) {
  let _0x4181d7 = _0x170526;
  if (!_0x170526.category) {
    _0x4181d7.category = "general";
  }
  if (!_0x170526.react) {
    _0x4181d7.react = "🚀";
  }
  if (!_0x170526.dontAddCommandList) {
    _0x4181d7.dontAddCommandList = false;
  }
  _0x4181d7.function = _0x2e6cc5;
  const _0xa10bed = new Error().stack;
  const _0x48d8d4 = _0xa10bed.split("\n")[2].match(/\((.*):\d+:\d+\)/)[1];
  _0x4181d7.filename = _0x48d8d4;
  commands.push(_0x4181d7);
  return _0x4181d7;
}
const _0x359fe4 = {
  mxd: mxd,
  commands: commands,
  evt: evt
};
module.exports = _0x359fe4;
evt.commands = commands;