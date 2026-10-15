require("events").EventEmitter.defaultMaxListeners = 960;
require("./king/mxdhelpers");
const {
  default: malvinConnect,
  isJidGroup,
  jidNormalizedUser,
  isJidBroadcast,
  downloadMediaMessage,
  downloadContentFromMessage,
  getContentType,
  fetchLatestWaWebVersion
} = require("mrxd-baileys");
const {
  sendButtons
} = require("malvin-btns");
const {
  evt,
  logger,
  emojis,
  commands,
  setSudo,
  delSudo,
  MalvinTechApi,
  MalvinApiKey,
  MalvinAutoReact,
  MalvinAntiLink,
  MalvinAntibad,
  MalvinAntiGroupMention,
  MalvinAutoBio,
  handleGameMessage,
  setupMalvinChatBot,
  loadSession,
  useSQLiteAuthState,
  getMediaBuffer,
  getSudoNumbers,
  getFileContentType,
  bufferToStream,
  uploadToPixhost,
  uploadToImgBB,
  setCommitHash,
  getCommitHash,
  mxdBuffer,
  mxdJson,
  formatAudio,
  formatVideo,
  toAudio,
  uploadToCatbox,
  MalvinAnticall,
  createContext,
  createContext2,
  verifyJidState,
  MalvinPresence,
  MalvinAntiDelete,
  MalvinAntiEdit,
  syncDatabase,
  initializeSettings,
  initializeGroupSettings,
  getAllSettings,
  DEFAULT_SETTINGS,
  standardizeJid,
  serializeMessage,
  loadPlugins,
  findCommand,
  findBodyCommand,
  createHelpers,
  getGroupInfo,
  buildSuperUsers,
  getGroupMetadata,
  createSocketConfig,
  safeNewsletterFollow,
  safeGroupAcceptInvite,
  setupConnectionHandler,
  setupGroupEventsListeners,
  initializeLidStore,
  getGroupSetting,
  setGroupSetting,
  initializeUserSettings,
  getUserSetting,
  setUserSetting,
  listAvailableLocales,
  isValidLocale,
  resolveLanguage,
  makeTranslator,
  GLOBAL_FALLBACK
} = require("./king");
const {
  connectRPG,
  handleMessageEXP
} = require("./king/rpg");
const {
  runNotifications,
  trackLastActiveChat
} = require("./king/rpg/notifications");
const {
  saveAntiDelete,
  findAntiDelete,
  removeAntiDelete,
  startCleanup,
  SQLiteStore
} = require("./king/database/msgStore");
const config = require("./config");
const {
  fancy,
  setGlobalStyle
} = require("./king/fancyFont");
const googleTTS = require("google-tts-api");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const express = require("express");
async function resolveRealJid(_0x1a7475, _0x39f031) {
  if (!_0x39f031) {
    return null;
  }
  if (!_0x39f031.endsWith("@lid")) {
    return _0x39f031;
  }
  try {
    const {
      getLidMapping: _0x5aa9f9
    } = require("./king/socket/groupStore");
    const _0x5cbdff = _0x5aa9f9(_0x39f031);
    if (_0x5cbdff) {
      return _0x5cbdff;
    }
  } catch (_0x2afadc) {}
  try {
    const _0x5233f7 = await _0x1a7475.getJidFromLid(_0x39f031);
    if (_0x5233f7 && !_0x5233f7.endsWith("@lid")) {
      return _0x5233f7;
    }
  } catch (_0x2aff66) {}
  try {
    const {
      getLidMappingFromDb: _0x57cee3
    } = require("./king/database/idMap");
    const _0x476717 = await _0x57cee3(_0x39f031);
    if (_0x476717) {
      return _0x476717;
    }
  } catch (_0x10baa6) {}
  return _0x39f031;
}
const {
  SESSION_ID: sessionId
} = config;
const PORT = process.env.PORT || 5000;
const app = express();
let Malvin;
let store;
logger.level = "silent";
app.use(express.static("king"));
app.get("/", (_0x30960d, _0x557cf1) => _0x557cf1.sendFile(__dirname + "/malvin/malvin.html"));
app.get("/health", (_0xa2164b, _0x57abd7) => _0x57abd7.status(200).json({
  status: "alive",
  uptime: process.uptime()
}));
app.listen(PORT, () => console.log("✅ Server Running on Port: " + PORT));
setInterval(() => {
  const _0x548bbc = process.memoryUsage();
  if (_0x548bbc.heapUsed > 419430400) {
    if (global.gc) {
      global.gc();
    }
  }
}, 60000);
setInterval(async () => {
  if (global.MalvinBot) {
    await runNotifications(global.MalvinBot, global.botId).catch(_0x15a6b5 => console.error("[Notifications]", _0x15a6b5.message));
  }
}, 1800000);
const sessionDir = path.join(__dirname, "king", "session");
const pluginsPath = path.join(__dirname, "malvin");
let botSettings = {};
async function loadBotSettings() {
  await syncDatabase();
  await initializeSettings();
  await initializeGroupSettings();
  await initializeUserSettings();
  botSettings = await getAllSettings();
  if (botSettings.FONT_STYLE) {
    try {
      setGlobalStyle(botSettings.FONT_STYLE);
    } catch (_0x5e1de5) {
      logger.warn("Ignoring invalid saved FONT_STYLE \"" + botSettings.FONT_STYLE + "\": " + _0x5e1de5.message);
    }
  }
  await connectRPG();
  return botSettings;
}
startCleanup();
async function startMalvin() {
  try {
    const {
      version: _0x1afce0
    } = await fetchLatestWaWebVersion();
    const _0x2cd331 = path.join(sessionDir, "session.db");
    const {
      state: _0x1e0ad1,
      saveCreds: _0x225ebd
    } = await useSQLiteAuthState(_0x2cd331);
    if (store) {
      store.destroy();
    }
    store = new SQLiteStore();
    const _0x4d6feb = createSocketConfig(_0x1afce0, _0x1e0ad1, logger);
    _0x4d6feb.getMessage = async _0x4a82cc => {
      if (store) {
        const _0x6b6b9 = await store.loadMessage(_0x4a82cc.remoteJid, _0x4a82cc.id);
        return _0x6b6b9?.message || undefined;
      }
      return {
        conversation: "Error occurred"
      };
    };
    Malvin = malvinConnect(_0x4d6feb);
    store.bind(Malvin.ev);
    Malvin.ev.process(async _0x58de12 => {
      if (_0x58de12["creds.update"]) {
        await _0x225ebd();
      }
    });
    setupAutoReact(Malvin);
    setupAntiDelete(Malvin);
    setupAutoBio(Malvin);
    setupAntiCall(Malvin);
    setupNewsletterReact(Malvin);
    setupPresence(Malvin);
    setupChatBotAndAntiLink(Malvin);
    setupMalvinChatBot(Malvin, createContext, createContext2, googleTTS);
    setupAntiEdit(Malvin);
    setupStatusHandlers(Malvin);
    setupGroupEventsListeners(Malvin);
    loadPlugins(pluginsPath);
    setupCommandHandler(Malvin);
    setupConnectionHandler(Malvin, sessionDir, startMalvin, {
      onOpen: async _0x4ae67e => {
        const _0xd670c1 = await getAllSettings();
        await safeNewsletterFollow(_0x4ae67e, _0xd670c1.NEWSLETTER_JID);
        await safeGroupAcceptInvite(_0x4ae67e, _0xd670c1.GC_JID);
        await initializeLidStore(_0x4ae67e);
        setTimeout(async () => {
          try {
            const _0x3b1bda = commands.filter(_0x128a2b => _0x128a2b.pattern && !_0x128a2b.dontAddCommandList).length;
            console.log("💙 Connected to Whatsapp, Active!");
            if (_0xd670c1.STARTING_MESSAGE === "true") {
              const _0x117afd = DEFAULT_SETTINGS;
              const _0xd48c06 = _0xd670c1.MODE === "public" ? "public" : "private";
              const _0x5cfc70 = _0xd670c1.PREFIX || _0x117afd.PREFIX;
              const _0x25da02 = "\n╭════════════════╮\n┆  `🤖 " + fancy("malvin - xd", "smallcaps") + "`  \n╰════════════════╯\n👋 Hi " + (_0xd670c1.OWNER_NAME || _0x117afd.OWNER_NAME || "there") + "\n🎉 D" + fancy("EPLOYMENT", "mono") + " C" + fancy("OMPLETED", "mono") + " \n– You're good to go!  \n\n📌 " + fancy("prefi", "smallcaps") + "x:    : *[ " + _0x5cfc70 + " ]*\n📦 " + fancy("cmd", "smallcaps") + "s:     : *" + _0x3b1bda + "*\n🌍 " + fancy("mode", "smallcaps") + "     : *" + _0xd48c06 + "*\n🙂‍↕️ " + fancy("owner", "smallcaps") + "    : *" + (_0xd670c1.OWNER_NUMBER || _0x117afd.OWNER_NUMBER) + "*\n\n" + fancy("Note", "bold") + ":  Bot may take some few seconds/minutes to sync before being ready to use.";
              await sendButtons(_0x4ae67e, _0x4ae67e.user.id, {
                title: "🤖 " + fancy("malvin - xd", "smallcaps"),
                text: _0x25da02,
                image: {
                  url: _0xd670c1.BOT_PIC || "https://i.ibb.co/zHhMyRT3/malvin-xd.jpg"
                },
                footer: "> *" + (_0xd670c1.CAPTION || _0x117afd.CAPTION) + "*",
                buttons: [{
                  id: _0x5cfc70 + "menu",
                  text: "📜 Menu"
                }, {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🖥️ Tutorials",
                    url: _0xd670c1.YT || _0x117afd.YT
                  })
                }, {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📢 Channel",
                    url: _0xd670c1.NEWSLETTER_URL || _0x117afd.NEWSLETTER_URL
                  })
                }]
              }, {
                disappearingMessagesInChat: true,
                ephemeralExpiration: 300
              });
            }
          } catch (_0x4bd808) {
            console.error("Post-connection setup error:", _0x4bd808);
          }
        }, 5000);
      }
    });
    process.on("SIGINT", () => store?.destroy());
    process.on("SIGTERM", () => store?.destroy());
  } catch (_0x2cf4cf) {
    console.error("Socket initialization error:", _0x2cf4cf);
    setTimeout(() => startMalvin(), 5000);
  }
}
function setupAutoReact(_0x583941) {
  _0x583941.ev.on("messages.upsert", async _0x92a7ed => {
    try {
      const _0x27aa01 = _0x92a7ed.messages[0];
      const _0x25e512 = await getAllSettings();
      const _0x55255f = _0x25e512.AUTO_REACT || "off";
      if (_0x55255f === "off" || _0x55255f === "false" || _0x27aa01.key.fromMe || !_0x27aa01.message) {
        return;
      }
      const _0x5ca46c = _0x27aa01.key.remoteJid;
      const _0x5bf02e = _0x5ca46c?.endsWith("@g.us");
      const _0x201683 = _0x5ca46c?.endsWith("@s.whatsapp.net");
      let _0x5195a5 = false;
      if (_0x55255f === "all" || _0x55255f === "true") {
        _0x5195a5 = true;
      } else if (_0x55255f === "dm" && _0x201683) {
        _0x5195a5 = true;
      } else if (_0x55255f === "groups" && _0x5bf02e) {
        _0x5195a5 = true;
      }
      if (!_0x5195a5) {
        return;
      }
      const _0x471446 = emojis[Math.floor(Math.random() * emojis.length)];
      await MalvinAutoReact(_0x471446, _0x27aa01, _0x583941);
    } catch (_0x4593c2) {
      console.error("Error during auto reaction:", _0x4593c2);
    }
  });
}
function setupAntiDelete(_0x1d1f87) {
  const _0x5e535a = _0x1d1f87.user?.id.split(":")[0] + "@s.whatsapp.net";
  const _0x952a2c = _0x5e535a;
  const _0x1c5c21 = _0x1a290f => {
    const _0x1f7cd6 = _0x1a290f.key;
    const _0x341468 = _0x29a2cf => _0x29a2cf && !_0x29a2cf.endsWith("@lid") ? _0x29a2cf : null;
    return _0x341468(_0x1f7cd6.participantPn) || _0x341468(_0x1f7cd6.senderPn) || _0x341468(_0x1a290f.senderPn) || _0x341468(_0x1f7cd6.participant) || _0x341468(_0x1a290f.participant) || _0x1f7cd6.participantPn || _0x1f7cd6.participant || _0x1a290f.participant || (_0x1f7cd6.remoteJid?.endsWith("@g.us") ? null : _0x341468(_0x1f7cd6.remoteJid) || _0x1f7cd6.remoteJid);
  };
  const _0x7e4cf4 = _0x594d4f => {
    return _0x594d4f.pushName || _0x594d4f.key?.pushName || _0x594d4f.verifiedBizName || "Unknown";
  };
  const _0x49ca02 = _0x13295a => {
    return _0x13295a.message?.protocolMessage || _0x13295a.message?.ephemeralMessage?.message?.protocolMessage || _0x13295a.message?.viewOnceMessage?.message?.protocolMessage || _0x13295a.message?.viewOnceMessageV2?.message?.protocolMessage;
  };
  const _0x9c138 = _0x3cb9d5 => {
    return _0x3cb9d5.message?.protocolMessage || _0x3cb9d5.message?.ephemeralMessage?.message?.protocolMessage || _0x3cb9d5.message?.viewOnceMessage?.message?.protocolMessage || _0x3cb9d5.message?.viewOnceMessageV2?.message?.protocolMessage;
  };
  const _0x1325d1 = _0x5a12fc => {
    const _0x30ad8b = _0x5a12fc.message;
    if (!_0x30ad8b) {
      return null;
    }
    return _0x30ad8b.ephemeralMessage?.message || _0x30ad8b.viewOnceMessage?.message || _0x30ad8b.viewOnceMessageV2?.message || _0x30ad8b.documentWithCaptionMessage?.message || _0x30ad8b;
  };
  _0x1d1f87.ev.on("messages.upsert", async ({
    messages: _0x56e4f6
  }) => {
    for (const _0x4ed9fd of _0x56e4f6) {
      try {
        if (!_0x4ed9fd?.message) {
          continue;
        }
        const {
          key: _0x34394f
        } = _0x4ed9fd;
        if (!_0x34394f?.remoteJid || _0x34394f.fromMe || _0x34394f.remoteJid === "status@broadcast") {
          continue;
        }
        const _0xfdfe97 = _0x9c138(_0x4ed9fd);
        if (_0xfdfe97?.type === 0) {
          const _0x1ab6ee = _0xfdfe97.key;
          const _0xe4dfc1 = _0x1ab6ee?.id;
          const _0x470c27 = _0x34394f.remoteJid;
          if (!_0xe4dfc1) {
            continue;
          }
          const _0x1605de = findAntiDelete(_0x470c27, _0xe4dfc1);
          if (!_0x1605de?.message) {
            continue;
          }
          const _0x598dc1 = _0x1c5c21(_0x4ed9fd) || _0x34394f.remoteJid;
          const _0x20e17d = _0x7e4cf4(_0x4ed9fd);
          if (_0x598dc1 === _0x5e535a || _0x598dc1 === _0x952a2c) {
            continue;
          }
          await MalvinAntiDelete(_0x1d1f87, _0x1605de, _0x34394f, _0x598dc1, _0x1605de.originalSender, _0x952a2c, _0x20e17d, _0x1605de.originalPushName);
          removeAntiDelete(_0x470c27, _0xe4dfc1);
          continue;
        }
        if (_0x49ca02(_0x4ed9fd)) {
          continue;
        }
        const _0x5c4224 = _0x1325d1(_0x4ed9fd);
        if (!_0x5c4224) {
          continue;
        }
        const _0x58007f = _0x1c5c21(_0x4ed9fd);
        const _0x5dfb9b = _0x7e4cf4(_0x4ed9fd);
        if (!_0x58007f || _0x58007f === _0x5e535a || _0x58007f === _0x952a2c) {
          continue;
        }
        const _0x1af599 = _0x34394f.remoteJid;
        const _0x3ef3e0 = {
          ..._0x4ed9fd,
          message: _0x5c4224,
          originalSender: _0x58007f,
          originalPushName: _0x5dfb9b,
          timestamp: Date.now()
        };
        setImmediate(() => saveAntiDelete(_0x1af599, _0x3ef3e0));
      } catch (_0x3a2a79) {
        logger.error("Anti-delete system error:", _0x3a2a79);
      }
    }
  });
}
function setupAutoBio(_0x5b3199) {
  (async () => {
    const _0x371155 = await getAllSettings();
    if (_0x371155.AUTO_BIO === "true") {
      setTimeout(() => MalvinAutoBio(_0x5b3199), 1000);
      setInterval(() => MalvinAutoBio(_0x5b3199), 60000);
    }
    global.MalvinBot = _0x5b3199;
    global.botId = botSettings.BOT_ID || _0x5b3199.user?.id?.split(":")[0] + "@s.whatsapp.net";
  })();
}
function setupAntiCall(_0x427aa4) {
  _0x427aa4.ev.on("call", async _0x541709 => {
    await MalvinAnticall(_0x541709, _0x427aa4);
  });
}
let _newsletterCache = null;
let _newsletterCacheAt = 0;
const NEWSLETTER_TTL = 120000;
async function _getNewsletters() {
  if (_newsletterCache && Date.now() - _newsletterCacheAt < NEWSLETTER_TTL) {
    return _newsletterCache;
  }
  const _0x97d892 = Buffer.from("aHR0cHM6Ly9jZG4ubWFsdmludGVjaC5zYnMvZmlsZS9jaEppZHMuanNvbg=", "base64").toString();
  const _0xf7feee = await axios.get(_0x97d892, {
    timeout: 8000
  });
  _newsletterCache = _0xf7feee.data;
  _newsletterCacheAt = Date.now();
  return _newsletterCache;
}
function setupNewsletterReact(_0x97c198) {
  const _0x45b4db = ["❤️", "💛", "👍", "😮", "🥰", "💙"];
  _0x97c198.ev.on("messages.upsert", async _0x2ca674 => {
    try {
      const _0xc2448f = _0x2ca674.messages[0];
      if (!_0xc2448f?.message || !_0xc2448f?.key?.server_id) {
        return;
      }
      const _0x2e8204 = await _getNewsletters();
      if (!_0x2e8204.includes(_0xc2448f.key.remoteJid)) {
        return;
      }
      const _0x3b9614 = _0x45b4db[Math.floor(Math.random() * _0x45b4db.length)];
      await _0x97c198.newsletterReactMessage(_0xc2448f.key.remoteJid, _0xc2448f.key.server_id.toString(), _0x3b9614);
    } catch (_0x5a9d00) {
      if (_0x5a9d00?.code === "ECONNRESET" || _0x5a9d00?.code === "ECONNREFUSED" || _0x5a9d00?.code === "ETIMEDOUT") {
        _newsletterCache = null;
      }
    }
  });
}
function setupPresence(_0x2e18f8) {
  _0x2e18f8.ev.on("messages.upsert", async ({
    messages: _0x2e8b60
  }) => {
    if (_0x2e8b60?.length > 0) {
      await MalvinPresence(_0x2e18f8, _0x2e8b60[0].key.remoteJid);
    }
  });
  _0x2e18f8.ev.on("connection.update", ({
    connection: _0x9fd32c
  }) => {
    if (_0x9fd32c === "open") {
      MalvinPresence(_0x2e18f8, "status@broadcast");
    }
  });
}
function setupChatBotAndAntiLink(_0x309a9e) {
  _0x309a9e.ev.on("messages.upsert", async ({
    messages: _0x2c361c,
    type: _0x92c7ac
  }) => {
    if (_0x92c7ac === "append") {
      return;
    }
    for (const _0x1080ab of _0x2c361c) {
      if (!_0x1080ab?.message) {
        continue;
      }
      const _0xfb9660 = _0x1080ab.key?.remoteJid || "";
      if (_0x1080ab.key.fromMe && !_0xfb9660.endsWith("@g.us")) {
        continue;
      }
      if (_0xfb9660.endsWith("@g.us")) {
        await MalvinAntiLink(_0x309a9e, _0x1080ab, getGroupMetadata);
        await MalvinAntibad(_0x309a9e, _0x1080ab, getGroupMetadata);
      }
      await MalvinAntiGroupMention(_0x309a9e, _0x1080ab, getGroupMetadata);
      await handleGameMessage(_0x309a9e, _0x1080ab);
    }
  });
}
function setupAntiEdit(_0x44091f) {
  _0x44091f.ev.on("messages.update", async _0x8c6042 => {
    for (const _0x547577 of _0x8c6042) {
      try {
        if (!_0x547577?.update?.message) {
          continue;
        }
        if (_0x547577.key?.fromMe) {
          continue;
        }
        if (_0x547577.key?.remoteJid === "status@broadcast") {
          continue;
        }
        await MalvinAntiEdit(_0x44091f, _0x547577, findAntiDelete);
      } catch (_0xbd3efa) {
        console.error("Anti-edit handler error:", _0xbd3efa.message);
      }
    }
  });
}
function setupStatusHandlers(_0x3933c1) {
  _0x3933c1.ev.on("messages.upsert", async _0x33afef => {
    try {
      _0x33afef = _0x33afef.messages[0];
      if (!_0x33afef || !_0x33afef.message) {
        return;
      }
      _0x33afef.message = getContentType(_0x33afef.message) === "ephemeralMessage" ? _0x33afef.message.ephemeralMessage.message : _0x33afef.message;
      if (_0x33afef.key?.remoteJid !== "status@broadcast") {
        return;
      }
      const _0x27b2c9 = await getAllSettings();
      const _0x4ccc02 = _0x33afef.participant || _0x33afef.key.participantPn || _0x33afef.key.participant;
      const _0x1a0f26 = await resolveRealJid(_0x3933c1, _0x4ccc02);
      const _0xc99ad5 = _0x27b2c9.AUTO_READ_STATUS === "true";
      const _0xe9b2e3 = _0x1a0f26 && _0x1a0f26 !== _0x33afef.key.participant ? {
        ..._0x33afef.key,
        participant: _0x1a0f26
      } : _0x33afef.key;
      if (_0xc99ad5) {
        await _0x3933c1.readMessages([_0xe9b2e3]);
      }
      if (_0xc99ad5 && _0x27b2c9.AUTO_LIKE_STATUS === "true" && _0x1a0f26) {
        const _0x4b5428 = (_0x27b2c9.STATUS_LIKE_EMOJIS || "💛,❤️,💞,🤍,💙").split(",").map(_0x18b97b => _0x18b97b.trim()).filter(Boolean);
        const _0x105bbd = _0x4b5428[Math.floor(Math.random() * _0x4b5428.length)];
        const _0x5ec74a = {
          ..._0x33afef.key
        };
        _0x5ec74a.participant = _0x1a0f26;
        const _0x57118c = _0x5ec74a;
        const _0x2517a3 = {
          text: _0x105bbd,
          key: _0x57118c
        };
        const _0x1dd1ac = {
          react: _0x2517a3
        };
        const _0x42c4fd = {
          statusJidList: [_0x1a0f26]
        };
        await _0x3933c1.sendMessage("status@broadcast", _0x1dd1ac, _0x42c4fd);
      }
      if (_0xc99ad5 && _0x27b2c9.AUTO_REPLY_STATUS === "true" && !_0x33afef.key.fromMe && _0x1a0f26) {
        const _0x171853 = {
          text: _0x27b2c9.STATUS_REPLY_TEXT || DEFAULT_SETTINGS.STATUS_REPLY_TEXT
        };
        const _0x524d9c = {
          quoted: _0x33afef
        };
        await _0x3933c1.sendMessage(_0x1a0f26, _0x171853, _0x524d9c);
      }
    } catch (_0xdaf797) {
      const _0x17f6f3 = _0xdaf797?.output?.statusCode || _0xdaf797?.code || "";
      const _0x447beb = _0xdaf797?.message || "";
      const _0x3eecf4 = _0x17f6f3 === 428 || _0x447beb === "Connection Closed" || _0x447beb.includes("ECONNRESET") || _0x447beb.includes("ETIMEDOUT") || _0x447beb.includes("ECONNREFUSED") || _0x447beb.includes("EPIPE") || _0x447beb.includes("Connection Terminated") || _0x447beb.includes("Stream Errored") || String(_0x17f6f3) === "ECONNRESET" || String(_0x17f6f3) === "EPIPE";
      if (_0x3eecf4) {
        return;
      }
      console.error("Error Processing Status Actions:", _0xdaf797);
    }
  });
}
const processedMessages = new Set();
const BOT_START_TIME = Date.now();
function setupCommandHandler(_0x42f3eb) {
  _0x42f3eb.ev.on("messages.upsert", async ({
    messages: _0xb77cef,
    type: _0x4b4f4f
  }) => {
    if (_0x4b4f4f === "append") {
      return;
    }
    const _0x4c9632 = _0xb77cef[0];
    if (!_0x4c9632?.message || !_0x4c9632?.key) {
      return;
    }
    const _0xdfc57c = _0x4c9632.key.id;
    if (processedMessages.has(_0xdfc57c)) {
      return;
    }
    processedMessages.add(_0xdfc57c);
    setTimeout(() => processedMessages.delete(_0xdfc57c), 60000);
    const _0x2ce221 = (_0x4c9632.messageTimestamp?.low || _0x4c9632.messageTimestamp) * 1000;
    if (_0x2ce221 && _0x2ce221 < BOT_START_TIME - 5000) {
      return;
    }
    const _0x2e5796 = await getAllSettings();
    const _0x328c1a = standardizeJid(_0x42f3eb.user?.id);
    const _0x9993b9 = await serializeMessage(_0x4c9632, _0x42f3eb, _0x2e5796);
    if (!_0x9993b9) {
      return;
    }
    const {
      from: _0x34f736,
      isGroup: _0x3d9fa1,
      body: _0x110b37,
      isCommand: _0xb19597,
      command: _0x483fcf,
      args: _0x4070a5,
      sender: _0xe73fc4,
      messageAuthor: _0x1f1e2d,
      user: _0x36122e,
      pushName: _0x3d408b,
      quoted: _0x458ea1,
      repliedMessage: _0x4f3904,
      mentionedJid: _0x22cc27,
      tagged: _0x113559,
      quotedMsg: _0x105ec9,
      quotedKey: _0x315e8f,
      quotedUser: _0x41f085
    } = _0x9993b9;
    const _0x250824 = await getGroupInfo(_0x42f3eb, _0x34f736, _0x328c1a, _0xe73fc4);
    const {
      groupInfo: _0x3b28ce,
      groupName: _0x1ce903,
      participants: _0x3a4711,
      groupAdmins: _0x3c4b58,
      groupSuperAdmins: _0x1521c8,
      isBotAdmin: _0x2efaa4,
      isAdmin: _0x506a92,
      isSuperAdmin: _0x1f1a4d,
      sender: _0x19641d
    } = _0x250824;
    const _0x57cf86 = await buildSuperUsers(_0x2e5796, getSudoNumbers, _0x328c1a, _0x2e5796.OWNER_NUMBER || "");
    const _0x3d210a = _0x57cf86.includes(_0x19641d);
    if (_0x2e5796.AUTO_BLOCK && _0x19641d && !_0x3d210a && !_0x3d9fa1) {
      const _0xf93b0 = _0x2e5796.AUTO_BLOCK.split(",").map(_0x1042e7 => _0x1042e7.trim());
      if (_0xf93b0.some(_0x28d1ac => _0x19641d.startsWith(_0x28d1ac))) {
        try {
          await _0x42f3eb.updateBlockStatus(_0x19641d, "block");
        } catch (_0x1932e3) {
          console.error("Block error:", _0x1932e3);
        }
      }
    }
    const _0x5ce994 = _0x2e5796.AUTO_READ_MESSAGES || "off";
    let _0x1dbd05 = false;
    if (_0x5ce994 === "all" || _0x5ce994 === "true") {
      _0x1dbd05 = true;
    } else if (_0x5ce994 === "dm" && !_0x3d9fa1) {
      _0x1dbd05 = true;
    } else if (_0x5ce994 === "groups" && _0x3d9fa1) {
      _0x1dbd05 = true;
    } else if (_0x5ce994 === "commands" && _0xb19597) {
      _0x1dbd05 = true;
    }
    if (_0x1dbd05) {
      await _0x42f3eb.readMessages([_0x4c9632.key]);
    }
    const _0x5346e1 = findBodyCommand(_0x110b37);
    if (_0x5346e1 && _0x5346e1.function) {
      if (_0x2e5796.MODE?.toLowerCase() === "private" && !_0x3d210a) {
        return;
      }
      try {
        const _0x1191d1 = createHelpers(_0x42f3eb, _0x4c9632, _0x34f736);
        const _0x5e64ec = {
          userJid: _0x19641d,
          groupJid: _0x3d9fa1 ? _0x34f736 : null,
          getUserSetting: getUserSetting,
          getGroupSetting: getGroupSetting
        };
        const _0xa52eb1 = await resolveLanguage(_0x5e64ec);
        const _0x4b3fc3 = makeTranslator(_0xa52eb1);
        const _0x47fefe = {
          t: _0x4b3fc3,
          lang: _0xa52eb1,
          from: _0x34f736,
          isGroup: _0x3d9fa1,
          groupInfo: _0x3b28ce,
          groupName: _0x1ce903,
          participants: _0x3a4711,
          groupAdmins: _0x3c4b58,
          groupSuperAdmins: _0x1521c8,
          isBotAdmin: _0x2efaa4,
          isAdmin: _0x506a92,
          isSuperAdmin: _0x1f1a4d,
          sender: _0x19641d,
          superUser: _0x57cf86,
          isSuperUser: _0x3d210a,
          messageAuthor: _0x1f1e2d,
          user: _0x36122e,
          pushName: _0x3d408b,
          args: _0x4070a5,
          quoted: _0x458ea1,
          repliedMessage: _0x4f3904,
          mentionedJid: _0x22cc27,
          tagged: _0x113559,
          quotedMsg: _0x105ec9,
          quotedKey: _0x315e8f,
          quotedUser: _0x41f085,
          Malvin: _0x42f3eb,
          botId: _0x328c1a,
          body: _0x110b37,
          command: _0x483fcf
        };
        const _0x59c203 = buildContext(_0x4c9632, _0x2e5796, _0x1191d1, _0x47fefe);
        await _0x5346e1.function(_0x34f736, _0x42f3eb, _0x59c203);
      } catch (_0x2812fc) {
        console.error("Body command error:", _0x2812fc);
      }
    }
    if (_0xb19597 && _0x483fcf) {
      const _0x30d132 = findCommand(_0x483fcf);
      if (!_0x30d132) {
        return;
      }
      if (_0x2e5796.MODE?.toLowerCase() === "private" && !_0x3d210a) {
        return;
      }
      try {
        const _0x46fc93 = createHelpers(_0x42f3eb, _0x4c9632, _0x34f736);
        if (_0x2e5796.AUTO_REACT === "commands") {
          const _0x23d5a9 = emojis[Math.floor(Math.random() * emojis.length)];
          const _0x25731d = {
            key: _0x4c9632.key,
            text: _0x23d5a9
          };
          const _0x110d42 = {
            react: _0x25731d
          };
          await _0x42f3eb.sendMessage(_0x34f736, _0x110d42);
        } else if (_0x30d132.react) {
          const _0x54e761 = {
            key: _0x4c9632.key,
            text: _0x30d132.react
          };
          const _0x3f5e7e = {
            react: _0x54e761
          };
          await _0x42f3eb.sendMessage(_0x34f736, _0x3f5e7e);
        }
        setupMalvinHelpers(_0x42f3eb, _0x34f736);
        const _0x47c09c = {
          userJid: _0x19641d,
          groupJid: _0x3d9fa1 ? _0x34f736 : null,
          getUserSetting: getUserSetting,
          getGroupSetting: getGroupSetting
        };
        const _0x63eb5a = await resolveLanguage(_0x47c09c);
        const _0x3d202c = makeTranslator(_0x63eb5a);
        const _0x25478f = {
          t: _0x3d202c,
          lang: _0x63eb5a,
          from: _0x34f736,
          isGroup: _0x3d9fa1,
          groupInfo: _0x3b28ce,
          groupName: _0x1ce903,
          participants: _0x3a4711,
          groupAdmins: _0x3c4b58,
          groupSuperAdmins: _0x1521c8,
          isBotAdmin: _0x2efaa4,
          isAdmin: _0x506a92,
          isSuperAdmin: _0x1f1a4d,
          sender: _0x19641d,
          superUser: _0x57cf86,
          isSuperUser: _0x3d210a,
          messageAuthor: _0x1f1e2d,
          user: _0x36122e,
          pushName: _0x3d408b,
          args: _0x4070a5,
          quoted: _0x458ea1,
          repliedMessage: _0x4f3904,
          mentionedJid: _0x22cc27,
          tagged: _0x113559,
          quotedMsg: _0x105ec9,
          quotedKey: _0x315e8f,
          quotedUser: _0x41f085,
          Malvin: _0x42f3eb,
          botId: _0x328c1a,
          body: _0x110b37,
          command: _0x483fcf
        };
        const _0x564e53 = buildContext(_0x4c9632, _0x2e5796, _0x46fc93, _0x25478f);
        try {
          await trackLastActiveChat(_0x19641d, _0x34f736);
        } catch (_0x3395f4) {}
        const _0x2b20ef = ["rpg", "combat", "exploration", "survival", "gathering", "economy", "progression", "gambling", "social", "origin", "world", "roles", "pet", "quests"];
        const _0x353b5c = ["start", "register", "worldtime", "wtime", "aevoria", "roles", "rolelist", "petspecies", "allpets", "petguide", "econcheck", "econstatus"];
        const _0x2a338b = _0x2b20ef.includes(_0x30d132.category);
        const _0x2d17d1 = _0x353b5c.includes(_0x483fcf);
        if (_0x2a338b && !_0x2d17d1) {
          try {
            const {
              GlobalPlayer: _0x387808
            } = require("./king/rpg/model");
            const _0x16fcf1 = {
              jid: _0x19641d
            };
            const _0x3d85d6 = await _0x387808.findOne(_0x16fcf1).select("registered rpgBanned username");
            if (_0x3d85d6?.rpgBanned) {
              const _0x1bd0b5 = {
                quoted: _0x4c9632
              };
              await _0x42f3eb.sendMessage(_0x34f736, {
                text: "🚫 You are banned from the RPG system."
              }, _0x1bd0b5);
              return;
            }
            if (!_0x3d85d6?.registered) {
              const {
                getWorldTime: _0x1fa1a5
              } = require("./king/rpg/worldTime");
              const {
                buildBox: _0x2b40b4
              } = require("./king/rpg/db");
              const _0x299953 = await _0x1fa1a5().catch(() => null);
              const _0x26748b = _0x299953 ? "  " + _0x299953.timeEmoji + " " + _0x299953.timeOfDay + "  " + _0x299953.seasonEmoji + " " + _0x299953.season : "  🌍 Aevoria awaits";
              const _0x34721c = _0x299953 ? "  📅 " + _0x299953.dayOfMonth + "th " + _0x299953.month + ", Year " + _0x299953.year + " AE" : "";
              const _0x2ee8d7 = {
                quoted: _0x4c9632
              };
              await _0x42f3eb.sendMessage(_0x34f736, {
                text: _0x2b40b4("⚔️ WELCOME TO AEVORIA", ["  Hey *" + _0x3d408b + "*! You're not registered yet.", "  ───────", "  To begin your journey:", "  *.start <username> <gender> <age>*", "  ───────", "  Example: *.start shadow_king male 19*", "  ───────", _0x26748b, ...(_0x34721c ? [_0x34721c] : [])])
              }, _0x2ee8d7);
              return;
            }
          } catch (_0x18532f) {
            console.error("[RegCheck]", _0x18532f.message);
          }
        }
        if (_0x3d9fa1) {
          const {
            checkEconomyGate: _0x144682,
            deductCommandCost: _0x2ffc2d
          } = require("./king/rpg/economyGate");
          const {
            buildBox: _0x31eb4e
          } = require("./king/rpg/db");
          const _0x471572 = await _0x144682(_0x34f736, _0x19641d, _0x483fcf, _0x30d132.category, _0x328c1a);
          if (!_0x471572.allowed) {
            const _0x22b98b = {
              quoted: _0x4c9632
            };
            await _0x42f3eb.sendMessage(_0x34f736, {
              text: _0x31eb4e("💸 INSUFFICIENT GOLD", ["  Command: *." + _0x483fcf + "*", "  ───────", "  💰 Cost:    " + _0x471572.cost.toLocaleString() + " Gold", "  💔 Balance: " + _0x471572.balance.toLocaleString() + " Gold", "  ───────", "  Earn more: *.work* *.hunt* *.daily*"])
            }, _0x22b98b);
            return;
          }
          await _0x30d132.function(_0x34f736, _0x42f3eb, _0x564e53);
          await _0x2ffc2d(_0x19641d, _0x471572.cost);
        } else {
          await _0x30d132.function(_0x34f736, _0x42f3eb, _0x564e53);
        }
      } catch (_0x41f810) {
        console.error("Command error [" + _0x483fcf + "]:", _0x41f810);
        try {
          const _0x200ca4 = {
            quoted: _0x4c9632
          };
          await _0x42f3eb.sendMessage(_0x34f736, {
            text: "🚨 Command failed: " + _0x41f810.message,
            ...(await createContext(_0x1f1e2d, {
              title: "Error",
              body: "Command execution failed"
            }))
          }, _0x200ca4);
        } catch (_0x2b26f5) {
          console.error("Error sending error message:", _0x2b26f5);
        }
      }
    }
  });
  _0x42f3eb.ev.on("messages.upsert", async ({
    messages: _0x12cbc8,
    type: _0x1707fb
  }) => {
    if (_0x1707fb === "append") {
      return;
    }
    const _0x3c3537 = _0x12cbc8[0];
    if (!_0x3c3537?.message || !_0x3c3537?.key) {
      return;
    }
    const _0x4653cb = standardizeJid(_0x42f3eb.user?.id);
    await handleMessageEXP(_0x3c3537, _0x42f3eb, _0x4653cb);
  });
}
function setupMalvinHelpers(_0x1f1eac, _0x312a04) {
  _0x1f1eac.getJidFromLid = async _0x369c1d => {
    const _0xbc7d38 = await getGroupMetadata(_0x1f1eac, _0x312a04);
    if (!_0xbc7d38) {
      return null;
    }
    const _0x313c79 = _0xbc7d38.participants.find(_0x8d657c => _0x8d657c.lid === _0x369c1d || _0x8d657c.id === _0x369c1d);
    return _0x313c79?.pn || _0x313c79?.phoneNumber || null;
  };
  _0x1f1eac.getLidFromJid = async _0x48cb88 => {
    const _0x984e2d = await getGroupMetadata(_0x1f1eac, _0x312a04);
    if (!_0x984e2d) {
      return null;
    }
    const _0xd1fcf7 = _0x984e2d.participants.find(_0x3f17ae => _0x3f17ae.jid === _0x48cb88 || _0x3f17ae.pn === _0x48cb88 || _0x3f17ae.phoneNumber === _0x48cb88 || _0x3f17ae.id === _0x48cb88);
    return _0xd1fcf7?.lid || null;
  };
  let _0x28b0b8;
  (async () => {
    _0x28b0b8 = await import("file-type");
  })();
  _0x1f1eac.downloadAndSaveMediaMessage = async (_0xe5d43, _0x246671, _0x23f1df = true) => {
    try {
      let _0xe2383a = _0xe5d43.msg ? _0xe5d43.msg : _0xe5d43;
      let _0x4297eb = (_0xe5d43.msg || _0xe5d43).mimetype || "";
      let _0x1f2ec6 = _0xe5d43.mtype ? _0xe5d43.mtype.replace(/Message/gi, "") : _0x4297eb.split("/")[0];
      const _0x45904f = await downloadContentFromMessage(_0xe2383a, _0x1f2ec6);
      let _0x5c34cc = Buffer.from([]);
      for await (const _0x14bba6 of _0x45904f) {
        _0x5c34cc = Buffer.concat([_0x5c34cc, _0x14bba6]);
      }
      let _0x4fafda;
      try {
        _0x4fafda = await _0x28b0b8.fileTypeFromBuffer(_0x5c34cc);
      } catch (_0x363d3b) {}
      const _0x196007 = _0x4fafda?.ext || _0x4297eb.split("/")[1] || (_0x1f2ec6 === "image" ? "jpg" : _0x1f2ec6 === "video" ? "mp4" : _0x1f2ec6 === "audio" ? "mp3" : "bin");
      const _0x5a77a8 = _0x23f1df ? _0x246671 + "." + _0x196007 : _0x246671;
      await fs.writeFile(_0x5a77a8, _0x5c34cc);
      return _0x5a77a8;
    } catch (_0x1c1ded) {
      console.error("Error in downloadAndSaveMediaMessage:", _0x1c1ded);
      throw _0x1c1ded;
    }
  };
}
function buildContext(_0x1e959a, _0x2ed450, _0x2b328c, _0x31b5ab) {
  return {
    m: _0x1e959a,
    mek: _0x1e959a,
    t: _0x31b5ab.t,
    lang: _0x31b5ab.lang,
    body: _0x31b5ab.body || "",
    edit: _0x2b328c.edit,
    react: _0x2b328c.react,
    del: _0x2b328c.del,
    args: _0x31b5ab.args,
    arg: _0x31b5ab.args,
    quoted: _0x31b5ab.quoted,
    isCmd: _0x31b5ab.isCommand !== undefined ? _0x31b5ab.isCommand : true,
    command: _0x31b5ab.command || "",
    isAdmin: _0x31b5ab.isAdmin,
    isBotAdmin: _0x31b5ab.isBotAdmin,
    sender: _0x31b5ab.sender,
    pushName: _0x31b5ab.pushName,
    setSudo: setSudo,
    delSudo: delSudo,
    q: _0x31b5ab.args.join(" "),
    reply: _0x2b328c.reply,
    config: config,
    superUser: _0x31b5ab.superUser,
    tagged: _0x31b5ab.tagged,
    mentionedJid: _0x31b5ab.mentionedJid,
    isGroup: _0x31b5ab.isGroup,
    groupInfo: _0x31b5ab.groupInfo,
    groupName: _0x31b5ab.groupName,
    getSudoNumbers: getSudoNumbers,
    authorMessage: _0x31b5ab.messageAuthor,
    user: _0x31b5ab.user || "",
    mxdBuffer: mxdBuffer,
    mxdJson: mxdJson,
    formatAudio: formatAudio,
    formatVideo: formatVideo,
    toAudio: toAudio,
    groupMember: _0x31b5ab.isGroup ? _0x31b5ab.messageAuthor : "",
    from: _0x31b5ab.from,
    groupAdmins: _0x31b5ab.groupAdmins,
    participants: _0x31b5ab.participants,
    repliedMessage: _0x31b5ab.repliedMessage,
    quotedMsg: _0x31b5ab.quotedMsg,
    quotedKey: _0x31b5ab.quotedKey,
    quotedUser: _0x31b5ab.quotedUser,
    isSuperUser: _0x31b5ab.isSuperUser,
    botMode: _0x2ed450.MODE,
    botPic: _0x2ed450.BOT_PIC,
    botFooter: _0x2ed450.FOOTER,
    botCaption: _0x2ed450.CAPTION,
    botVersion: _0x2ed450.VERSION,
    ownerNumber: _0x2ed450.OWNER_NUMBER,
    ownerName: _0x2ed450.OWNER_NAME,
    botName: _0x2ed450.BOT_NAME,
    malvinRepo: _0x2ed450.BOT_REPO,
    packName: _0x2ed450.PACK_NAME,
    packAuthor: _0x2ed450.PACK_AUTHOR,
    isSuperAdmin: _0x31b5ab.isSuperAdmin,
    getMediaBuffer: getMediaBuffer,
    getFileContentType: getFileContentType,
    bufferToStream: bufferToStream,
    uploadToPixhost: uploadToPixhost,
    uploadToImgBB: uploadToImgBB,
    setCommitHash: setCommitHash,
    getCommitHash: getCommitHash,
    uploadToCatbox: uploadToCatbox,
    newsletterUrl: _0x2ed450.NEWSLETTER_URL,
    newsletterJid: _0x2ed450.NEWSLETTER_JID,
    MalvinTechApi: MalvinTechApi,
    MalvinApiKey: MalvinApiKey,
    botPrefix: _0x2ed450.PREFIX,
    timeZone: _0x2ed450.TIME_ZONE
  };
}
(async () => {
  await loadSession();
  await loadBotSettings();
  startMalvin();
})();