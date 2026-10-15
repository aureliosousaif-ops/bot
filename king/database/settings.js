const {
  DATABASE
} = require("./db");
const {
  DataTypes
} = require("sequelize");
const path = require("path");
const config = require("../../config");
const packageJson = require("../../package.json");
const {
  fancy
} = require("../fancyFont");
const _0x2b3bed = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
};
const _0x13f793 = {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true
};
const _0x2c78d1 = {
  type: DataTypes.TEXT,
  allowNull: true
};
const _0x21bf31 = {
  id: _0x2b3bed,
  key: _0x13f793,
  value: _0x2c78d1
};
const SettingsDB = DATABASE.define("BotSettings", _0x21bf31, {
  tableName: "bot_settings",
  timestamps: true
});
const DEFAULT_SETTINGS = {
  PREFIX: ".",
  OWNER_NAME: config.OWNER_NAME || "Administrador",
  OWNER_NUMBER: config.OWNER_NUMBER || "6399215379",
  BOT_NAME: "Sousinha Bot",
  FOOTER: "Menu de comandos",
  CAPTION: "Bot WhatsApp",
  BOT_PIC: "https://files.catbox.moe/5dm25l.png",
  VERSION: packageJson.version || "3.0.0",
  MODE: config.MODE || "public",
  WARN_COUNT: "3",
  TIME_ZONE: config.TIME_ZONE || "America/Sao_Paulo",
  DM_PRESENCE: "online",
  GC_PRESENCE: "online",
  CHATBOT: "false",
  CHATBOT_MODE: "inbox",
  STARTING_MESSAGE: "true",
  ANTIDELETE: "indm",
  ANTI_EDIT: "indm",
  ANTICALL: "false",
  ANTICALL_MSG: "*_📞 Modo de rejeição automática de chamadas ativo. 📵 Chamadas não permitidas!_*",
  AUTO_LIKE_STATUS: config.AUTO_LIKE_STATUS || "true",
  AUTO_READ_STATUS: config.AUTO_READ_STATUS || "true",
  STATUS_LIKE_EMOJIS: "💛,❤️,💜,🤍,💙",
  AUTO_REPLY_STATUS: "false",
  STATUS_REPLY_TEXT: "*Seu status foi visualizado com sucesso ✅*",
  AUTO_REACT: "off",
  AUTO_REPLY: "false",
  AUTO_READ_MESSAGES: "off",
  AUTO_BIO: "false",
  AUTO_BLOCK: "",
  YT: "",
  NEWSLETTER_JID: "",
  GC_JID: "",
  NEWSLETTER_URL: "https://chat.whatsapp.com/B5AYb0bMR2j5Z6zIw9QgKH",
  BOT_REPO: "",
  PACK_NAME: "Sousinha Bot",
  PACK_AUTHOR: "Sousinha Bot",
  SUDO_NUMBERS: "",
  PM_PERMIT: "false",
  ANTIVIEWONCE: "indm",
  FONT_STYLE: ""
};
let initialized = false;
const GROUP_ONLY_SETTINGS = ["WELCOME_MESSAGE", "GOODBYE_MESSAGE", "GROUP_EVENTS", "ANTILINK"];
async function initializeSettings() {
  if (initialized) {
    return;
  }
  await SettingsDB.sync();
  const _0x521d53 = {
    key: GROUP_ONLY_SETTINGS
  };
  const _0x517413 = {
    where: _0x521d53
  };
  await SettingsDB.destroy(_0x517413);
  for (const [_0x5c0405, _0x28bc99] of Object.entries(DEFAULT_SETTINGS)) {
    const _0x378e82 = {
      key: _0x5c0405
    };
    const _0x4ab549 = {
      key: _0x5c0405,
      value: _0x28bc99
    };
    const _0x2715aa = {
      where: _0x378e82,
      defaults: _0x4ab549
    };
    const [_0x5b6d0e] = await SettingsDB.findOrCreate(_0x2715aa);
    if (["PREFIX", "BOT_NAME", "FOOTER", "CAPTION", "BOT_PIC", "OWNER_NUMBER", "YT", "NEWSLETTER_JID", "GC_JID", "NEWSLETTER_URL", "BOT_REPO", "PACK_NAME", "PACK_AUTHOR"].includes(_0x5c0405) && _0x5b6d0e.value !== String(_0x28bc99)) {
      _0x5b6d0e.value = String(_0x28bc99);
      await _0x5b6d0e.save();
    }
  }
  initialized = true;
  console.log("✅ Bot Settings Initialized");
}
async function getSetting(_0x350f89) {
  if (!initialized) {
    await initializeSettings();
  }
  const _0x31dc20 = {
    key: _0x350f89
  };
  const _0x5a49e8 = {
    where: _0x31dc20
  };
  const _0x3e2cc5 = await SettingsDB.findOne(_0x5a49e8);
  if (_0x3e2cc5) {
    return _0x3e2cc5.value;
  }
  return DEFAULT_SETTINGS[_0x350f89] || null;
}
async function setSetting(_0x3bc152, _0x40a875) {
  if (!initialized) {
    await initializeSettings();
  }
  const _0x375b66 = {
    key: _0x3bc152
  };
  const _0xa1207b = {
    key: _0x3bc152,
    value: _0x40a875
  };
  const _0x4121eb = {
    where: _0x375b66,
    defaults: _0xa1207b
  };
  const [_0x5b6d0e, _0x3bc3ef] = await SettingsDB.findOrCreate(_0x4121eb);
  if (!_0x3bc3ef) {
    _0x5b6d0e.value = _0x40a875;
    await _0x5b6d0e.save();
  }
  return true;
}
async function getAllSettings() {
  if (!initialized) {
    await initializeSettings();
  }
  const _0x979909 = await SettingsDB.findAll();
  const _0x24fdaf = {};
  for (const _0x49de8c of _0x979909) {
    _0x24fdaf[_0x49de8c.key] = _0x49de8c.value;
  }
  return _0x24fdaf;
}
async function resetSetting(_0x439fd0) {
  if (!initialized) {
    await initializeSettings();
  }
  const _0x240a4a = DEFAULT_SETTINGS[_0x439fd0];
  if (_0x240a4a !== undefined) {
    await setSetting(_0x439fd0, _0x240a4a);
    return _0x240a4a;
  }
  return null;
}
async function resetAllSettings() {
  if (!initialized) {
    await initializeSettings();
  }
  for (const [_0x44ee31, _0x26734c] of Object.entries(DEFAULT_SETTINGS)) {
    await setSetting(_0x44ee31, _0x26734c);
  }
  return true;
}
const _0x3e234a = {
  SettingsDB: SettingsDB,
  DEFAULT_SETTINGS: DEFAULT_SETTINGS,
  initializeSettings: initializeSettings,
  getSetting: getSetting,
  setSetting: setSetting,
  getAllSettings: getAllSettings,
  resetSetting: resetSetting,
  resetAllSettings: resetAllSettings
};
module.exports = _0x3e234a;
