const {
  getSetting
} = require("./database/settings");
const {
  fancy
} = require("./fancyFont");
const originalConsoleInfo = console.info;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const suppressedPatterns = [/Closing session/i, /Closing open session/i, /Removing old closed session/i, /Decrypted message with closed session/i, /in favor of incoming/i, /prekey bundle/i, /SessionEntry/i, /failed to decrypt/i, /Bad MAC/i, /Session error/i, /libsignal/i, /session_cipher/i, /_chains/i, /ephemeralKeyPair/i, /rootKey/i, /baseKey/i, /pendingPreKey/i, /indexInfo/i, /currentRatchet/i, /registrationId/i, /remoteIdentityKey/i, /lastRemoteEphemeralKey/i, /verifyMAC/i, /decryptWithSessions/i, /doDecryptWhisperMessage/i, /_asyncQueueExecutor/i, /Interactive send/i];
const argToString = _0x312041 => {
  if (typeof _0x312041 === "string") {
    return _0x312041;
  }
  if (_0x312041 instanceof Error) {
    return _0x312041.message + " " + (_0x312041.stack || "");
  }
  if (_0x312041 && typeof _0x312041 === "object") {
    try {
      return JSON.stringify(_0x312041);
    } catch (_0x3781b4) {}
    try {
      return String(_0x312041);
    } catch (_0x45883a) {}
  }
  return String(_0x312041 ?? "");
};
const shouldSuppress = _0x4585fb => {
  const _0x13da04 = _0x4585fb.map(argToString).join(" ");
  if (suppressedPatterns.some(_0xd95189 => _0xd95189.test(_0x13da04))) {
    return true;
  }
  if (_0x4585fb.some(_0x46af7d => _0x46af7d && typeof _0x46af7d === "object" && (_0x46af7d._chains || _0x46af7d.indexInfo || _0x46af7d.currentRatchet))) {
    return true;
  }
  return false;
};
function setupConsoleFilters() {
  console.info = (..._0x3d0190) => {
    if (shouldSuppress(_0x3d0190)) {
      return;
    }
    originalConsoleInfo.apply(console, _0x3d0190);
  };
  console.log = (..._0xb36077) => {
    if (shouldSuppress(_0xb36077)) {
      return;
    }
    originalConsoleLog.apply(console, _0xb36077);
  };
  console.error = (..._0x41a8f2) => {
    if (shouldSuppress(_0x41a8f2)) {
      return;
    }
    originalConsoleError.apply(console, _0x41a8f2);
  };
  console.warn = (..._0x1f3f37) => {
    if (shouldSuppress(_0x1f3f37)) {
      return;
    }
    originalConsoleWarn.apply(console, _0x1f3f37);
  };
}
setupConsoleFilters();
const createContext = async (_0x4f885c, _0x3fea17 = {}) => {
  const _0x51d3e2 = (await getSetting("BOT_NAME")) || fancy("malvin-xd", "smallcaps");
  const _0x23da5a = (await getSetting("BOT_PIC")) || "https://files.catbox.moe/hffiqp.jpg";
  const _0x1c7efa = (await getSetting("NEWSLETTER_JID")) || "120363402507750390@newsletter";
  const _0x435b03 = (await getSetting("NEWSLETTER_URL")) || "https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S";
  const _0x2cba8c = {
    businessOwnerJid: _0x1c7efa
  };
  return {
    contextInfo: {
      mentionedJid: [_0x4f885c],
      forwardingScore: 1,
      isForwarded: true,
      businessMessageForwardInfo: _0x2cba8c,
      forwardedNewsletterMessageInfo: {
        newsletterJid: _0x1c7efa,
        newsletterName: _0x51d3e2,
        serverMessageId: Math.floor(100000 + Math.random() * 900000)
      },
      externalAdReply: {
        title: _0x3fea17.title || _0x51d3e2,
        body: _0x3fea17.body || "Powered by MalvinTech",
        thumbnailUrl: _0x23da5a,
        mediaType: 1,
        mediaUrl: _0x3fea17.mediaUrl || _0x23da5a,
        sourceUrl: _0x3fea17.sourceUrl || _0x435b03,
        showAdAttribution: true,
        renderLargerThumbnail: false
      }
    }
  };
};
const createContext2 = async (_0x3d7e04, _0x29d749 = {}) => {
  const _0x214b40 = (await getSetting("BOT_NAME")) || fancy("malvin-xd", "smallcaps");
  const _0x2eaa00 = (await getSetting("BOT_PIC")) || "https://files.catbox.moe/hffiqp.jpg";
  const _0x23acc8 = (await getSetting("NEWSLETTER_JID")) || "120363402507750390@newsletter";
  return {
    contextInfo: {
      mentionedJid: [_0x3d7e04],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: _0x23acc8,
        newsletterName: _0x214b40,
        serverMessageId: Math.floor(100000 + Math.random() * 900000)
      },
      externalAdReply: {
        title: _0x29d749.title || _0x214b40,
        body: _0x29d749.body || "Powered by Malvin Tech",
        thumbnailUrl: _0x2eaa00,
        mediaType: 1,
        showAdAttribution: true,
        renderSmallerThumbnail: true
      }
    }
  };
};
const _0x5e6c65 = {
  createContext: createContext,
  createContext2: createContext2
};
module.exports = _0x5e6c65;