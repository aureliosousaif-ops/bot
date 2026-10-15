var __importDefault = this && this.__importDefault || function (_0x4c7cf8) {
  if (_0x4c7cf8 && _0x4c7cf8.__esModule) {
    return _0x4c7cf8;
  } else {
    return {
      default: _0x4c7cf8
    };
  }
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const util = require("util");
const zlib = require("zlib");
const sharp = require("sharp");
const config = require("../config");
const FormData = require("form-data");
const {
  fromBuffer
} = require("file-type");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const {
  Readable
} = require("stream");
const {
  fancy
} = require("./fancyFont");
ffmpeg.setFfmpegPath(ffmpegPath);
const sessionDir = path.join(__dirname, "session");
const sessionPath = path.join(sessionDir, "creds.json");
async function stickerToImage(_0xa73177, _0x29ec16 = {}) {
  try {
    const {
      upscale = true,
      targetSize = 512,
      framesToProcess = 200
    } = _0x29ec16;
    if (Buffer.isBuffer(_0xa73177)) {
      const _0x53f5d8 = {
        sequentialRead: true,
        animated: true,
        limitInputPixels: false,
        pages: framesToProcess
      };
      const _0x518670 = sharp(_0xa73177, _0x53f5d8);
      const _0x2e81ee = await _0x518670.metadata();
      const _0x5f05f8 = _0x2e81ee.pages > 1 || _0x2e81ee.hasAlpha;
      if (_0x5f05f8) {
        const _0x156c7b = {
          width: upscale ? targetSize : _0x2e81ee.width,
          height: upscale ? targetSize : _0x2e81ee.height,
          fit: "contain",
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
          },
          kernel: "lanczos3"
        };
        return await _0x518670.gif({
          compressionLevel: 0,
          quality: 100,
          effort: 1,
          loop: 0
        }).resize(_0x156c7b).toBuffer();
      } else {
        const _0x1e133a = {
          width: upscale ? targetSize : _0x2e81ee.width,
          height: upscale ? targetSize : _0x2e81ee.height,
          fit: "contain",
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
          },
          kernel: "lanczos3"
        };
        return await _0x518670.ensureAlpha().resize(_0x1e133a).png({
          compressionLevel: 0,
          quality: 100,
          progressive: false,
          palette: true
        }).toBuffer();
      }
    } else if (typeof _0xa73177 === "string") {
      const _0x58e299 = _0xa73177.replace(/\.webp$/, _0x421d62 ? ".gif" : ".png");
      const _0x8a37e6 = {
        sequentialRead: true,
        animated: true,
        limitInputPixels: false,
        pages: framesToProcess
      };
      const _0x17f0aa = sharp(_0xa73177, _0x8a37e6);
      const _0x8aac59 = await _0x17f0aa.metadata();
      const _0x421d62 = _0x8aac59.pages > 1 || _0x8aac59.hasAlpha;
      if (_0x421d62) {
        const _0x3546a1 = {
          width: upscale ? targetSize : _0x8aac59.width,
          height: upscale ? targetSize : _0x8aac59.height,
          fit: "contain",
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
          },
          kernel: "lanczos3"
        };
        await _0x17f0aa.gif({
          compressionLevel: 0,
          quality: 100,
          effort: 1,
          loop: 0
        }).resize(_0x3546a1).toFile(_0x58e299);
      } else {
        const _0x6abc6f = {
          width: upscale ? targetSize : _0x8aac59.width,
          height: upscale ? targetSize : _0x8aac59.height,
          fit: "contain",
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
          },
          kernel: "lanczos3"
        };
        await _0x17f0aa.ensureAlpha().resize(_0x6abc6f).png({
          compressionLevel: 0,
          quality: 100,
          progressive: false,
          palette: true
        }).toFile(_0x58e299);
      }
      const _0x363d80 = await fs.promises.readFile(_0x58e299);
      await fs.promises.unlink(_0x58e299);
      await fs.promises.unlink(_0xa73177);
      return _0x363d80;
    } else {
      throw new Error("Invalid input type for stickerToImage");
    }
  } catch (_0xa32827) {
    console.error("Error in stickerToImage:", _0xa32827);
    throw _0xa32827;
  }
}
async function withTempFiles(_0x2fdef7, _0x55a164, _0x25e236) {
  const _0x32e868 = path.join(__dirname, "temp");
  if (!fs.existsSync(_0x32e868)) {
    fs.mkdirSync(_0x32e868, {
      recursive: true
    });
  }
  const _0x3028c0 = Date.now() + "_" + Math.random().toString(36).substring(2, 8);
  const _0x226afa = path.join(_0x32e868, "input_" + _0x3028c0 + ".tmp");
  const _0x83bba6 = path.join(_0x32e868, "output_" + _0x3028c0 + "." + _0x55a164);
  try {
    fs.writeFileSync(_0x226afa, _0x2fdef7);
    await _0x25e236(_0x226afa, _0x83bba6);
    const _0x5310bf = fs.readFileSync(_0x83bba6);
    return _0x5310bf;
  } finally {
    try {
      if (fs.existsSync(_0x226afa)) {
        fs.unlinkSync(_0x226afa);
      }
    } catch (_0x327f4e) {}
    try {
      if (fs.existsSync(_0x83bba6)) {
        fs.unlinkSync(_0x83bba6);
      }
    } catch (_0x2ac138) {}
  }
}
async function toAudio(_0x261cd8) {
  return withTempFiles(_0x261cd8, "mp3", (_0x4fed87, _0x5ecd06) => {
    return new Promise((_0xed865e, _0x25647b) => {
      const {
        execFile: _0x203806
      } = require("child_process");
      _0x203806(ffmpegPath, ["-i", _0x4fed87, "-hide_banner"], {
        timeout: 30000
      }, (_0x448c10, _0x443b1a, _0x446c14) => {
        const _0x4294bd = _0x446c14 && (_0x446c14.includes("Audio:") || _0x446c14.includes("audio"));
        if (!_0x4294bd) {
          return _0x25647b(new Error("This video has no audio track to extract"));
        }
        _0x203806(ffmpegPath, ["-i", _0x4fed87, "-vn", "-acodec", "libmp3lame", "-ab", "128k", "-ac", "2", "-y", _0x5ecd06], {
          timeout: 120000
        }, (_0x3e43af, _0x5897db, _0x2a68f2) => {
          if (_0x3e43af) {
            console.error("FFmpeg toAudio error:", _0x2a68f2 || _0x3e43af.message);
            _0x25647b(_0x3e43af);
          } else {
            _0xed865e();
          }
        });
      });
    });
  });
}
async function toVideo(_0x13fb10) {
  return withTempFiles(_0x13fb10, "mp4", (_0x47f95e, _0x1777f3) => {
    return new Promise((_0x18c18c, _0x529a57) => {
      ffmpeg().input("color=black:s=640x360:r=1").inputOptions(["-f lavfi"]).input(_0x47f95e).outputOptions(["-shortest", "-preset ultrafast", "-movflags faststart", "-pix_fmt yuv420p"]).videoCodec("libx264").audioCodec("aac").toFormat("mp4").on("error", _0x15eafd => {
        console.error("FFmpeg error:", _0x15eafd);
        _0x529a57(_0x15eafd);
      }).on("end", _0x18c18c).save(_0x1777f3);
    });
  });
}
async function toPtt(_0xa88a6b) {
  const {
    execFile: _0xf93d4d
  } = require("child_process");
  const _0x34088a = path.join(__dirname, "temp");
  if (!fs.existsSync(_0x34088a)) {
    fs.mkdirSync(_0x34088a, {
      recursive: true
    });
  }
  const _0xf8a50e = Date.now();
  const _0x5bfad0 = path.join(_0x34088a, "ptt_in_" + _0xf8a50e + ".tmp");
  const _0x47243d = path.join(_0x34088a, "ptt_out_" + _0xf8a50e + ".ogg");
  fs.writeFileSync(_0x5bfad0, _0xa88a6b);
  const _0x27f2cb = () => {
    try {
      if (fs.existsSync(_0x5bfad0)) {
        fs.unlinkSync(_0x5bfad0);
      }
    } catch {}
    try {
      if (fs.existsSync(_0x47243d)) {
        fs.unlinkSync(_0x47243d);
      }
    } catch {}
  };
  return new Promise((_0xef8a12, _0x2d9b6d) => {
    _0xf93d4d(ffmpegPath, ["-y", "-i", _0x5bfad0, "-c:a", "libopus", "-b:a", "64k", "-ar", "48000", "-ac", "1", "-f", "ogg", _0x47243d], {
      timeout: 120000
    }, _0x4706ba => {
      if (_0x4706ba) {
        _0x27f2cb();
        return _0x2d9b6d(_0x4706ba);
      }
      try {
        const _0x2c8cbf = fs.readFileSync(_0x47243d);
        _0x27f2cb();
        _0xef8a12(_0x2c8cbf);
      } catch (_0xc3d798) {
        _0x27f2cb();
        _0x2d9b6d(_0xc3d798);
      }
    });
  });
}
async function waitForFileToStabilize(_0x45eecf, _0x1fab8e = 500000) {
  let _0xa4cc1a = -1;
  let _0x4f3d81 = 0;
  const _0x27a822 = 200;
  return new Promise((_0x47606d, _0x3799cc) => {
    const _0x52b8bd = Date.now();
    const _0x32f6bf = setInterval(async () => {
      try {
        const {
          size: _0x3a4d85
        } = await fs.promises.stat(_0x45eecf);
        if (_0x3a4d85 === _0xa4cc1a) {
          _0x4f3d81++;
          if (_0x4f3d81 >= 3) {
            clearInterval(_0x32f6bf);
            return _0x47606d();
          }
        } else {
          _0x4f3d81 = 0;
          _0xa4cc1a = _0x3a4d85;
        }
        if (Date.now() - _0x52b8bd > _0x1fab8e) {
          clearInterval(_0x32f6bf);
          return _0x3799cc(new Error("File stabilization timed out."));
        }
      } catch (_0x1c9632) {}
    }, _0x27a822);
  });
}
async function formatAudio(_0x45a3ac) {
  const {
    execFile: _0x316dfc
  } = require("child_process");
  const _0x51070a = path.join(__dirname, "temp");
  if (!fs.existsSync(_0x51070a)) {
    fs.mkdirSync(_0x51070a, {
      recursive: true
    });
  }
  const _0x4f354b = Date.now();
  const _0x3c4ff6 = path.join(_0x51070a, "aud_in" + _0x4f354b + ".tmp");
  const _0x8b5e99 = path.join(_0x51070a, "aud_out" + _0x4f354b + ".mp3");
  fs.writeFileSync(_0x3c4ff6, _0x45a3ac);
  const _0x59c6ea = () => {
    try {
      if (fs.existsSync(_0x3c4ff6)) {
        fs.unlinkSync(_0x3c4ff6);
      }
    } catch {}
    try {
      if (fs.existsSync(_0x8b5e99)) {
        fs.unlinkSync(_0x8b5e99);
      }
    } catch {}
  };
  return new Promise((_0x51d1f4, _0x1aec04) => {
    _0x316dfc(ffmpegPath, ["-y", "-i", _0x3c4ff6, "-vn", "-c:a", "copy", _0x8b5e99], {
      timeout: 30000
    }, _0x55a010 => {
      if (!_0x55a010) {
        try {
          const _0x31e2d6 = fs.readFileSync(_0x8b5e99);
          _0x59c6ea();
          return _0x51d1f4(_0x31e2d6);
        } catch (_0x9c7b0b) {
          _0x59c6ea();
          return _0x1aec04(_0x9c7b0b);
        }
      }
      try {
        if (fs.existsSync(_0x8b5e99)) {
          fs.unlinkSync(_0x8b5e99);
        }
      } catch {}
      _0x316dfc(ffmpegPath, ["-y", "-i", _0x3c4ff6, "-vn", "-c:a", "libmp3lame", "-b:a", "128k", "-ac", "2", _0x8b5e99], {
        timeout: 180000
      }, _0x4268a4 => {
        if (_0x4268a4) {
          _0x59c6ea();
          return _0x1aec04(_0x4268a4);
        }
        try {
          const _0x5d645c = fs.readFileSync(_0x8b5e99);
          _0x59c6ea();
          _0x51d1f4(_0x5d645c);
        } catch (_0x44cc73) {
          _0x59c6ea();
          _0x1aec04(_0x44cc73);
        }
      });
    });
  });
}
async function formatVideo(_0xb842b4) {
  const {
    execFile: _0x2942a7
  } = require("child_process");
  const _0xed3dd0 = path.join(__dirname, "temp");
  if (!fs.existsSync(_0xed3dd0)) {
    fs.mkdirSync(_0xed3dd0, {
      recursive: true
    });
  }
  const _0x1ebeaa = Date.now();
  const _0x225a23 = path.join(_0xed3dd0, "vid_in" + _0x1ebeaa + ".tmp");
  const _0x18342e = path.join(_0xed3dd0, "vid_out" + _0x1ebeaa + ".mp4");
  fs.writeFileSync(_0x225a23, _0xb842b4);
  const _0x38fcce = () => {
    try {
      if (fs.existsSync(_0x225a23)) {
        fs.unlinkSync(_0x225a23);
      }
    } catch {}
    try {
      if (fs.existsSync(_0x18342e)) {
        fs.unlinkSync(_0x18342e);
      }
    } catch {}
  };
  return new Promise((_0x37adaf, _0x374756) => {
    _0x2942a7(ffmpegPath, ["-y", "-i", _0x225a23, "-c", "copy", "-movflags", "+faststart", _0x18342e], {
      timeout: 60000
    }, _0x2bbf69 => {
      if (!_0x2bbf69) {
        try {
          const _0xad60e9 = fs.readFileSync(_0x18342e);
          _0x38fcce();
          return _0x37adaf(_0xad60e9);
        } catch (_0x2c26eb) {
          _0x38fcce();
          return _0x374756(_0x2c26eb);
        }
      }
      try {
        if (fs.existsSync(_0x18342e)) {
          fs.unlinkSync(_0x18342e);
        }
      } catch {}
      _0x2942a7(ffmpegPath, ["-y", "-i", _0x225a23, "-map", "0:v:0", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", "-c:a", "aac", "-b:a", "128k", "-ac", "2", "-ar", "44100", "-movflags", "+faststart", "-pix_fmt", "yuv420p", _0x18342e], {
        timeout: 600000
      }, _0x3e7c17 => {
        if (_0x3e7c17) {
          _0x38fcce();
          return _0x374756(_0x3e7c17);
        }
        try {
          const _0x397547 = fs.readFileSync(_0x18342e);
          _0x38fcce();
          _0x37adaf(_0x397547);
        } catch (_0x4e641f) {
          _0x38fcce();
          _0x374756(_0x4e641f);
        }
      });
    });
  });
}
function monospace(_0x374b44) {
  const _0x1d0ef6 = {
    A: fancy("A", "mono"),
    B: fancy("B", "mono"),
    C: fancy("C", "mono"),
    D: fancy("D", "mono"),
    E: fancy("E", "mono"),
    F: fancy("F", "mono"),
    G: fancy("G", "mono"),
    H: fancy("H", "mono"),
    I: fancy("I", "mono"),
    J: fancy("J", "mono"),
    K: fancy("K", "mono"),
    L: fancy("L", "mono"),
    M: fancy("M", "mono"),
    N: fancy("N", "mono"),
    O: fancy("O", "mono"),
    P: fancy("P", "mono"),
    Q: fancy("Q", "mono"),
    R: fancy("R", "mono"),
    S: fancy("S", "mono"),
    T: fancy("T", "mono"),
    U: fancy("U", "mono"),
    V: fancy("V", "mono"),
    W: fancy("W", "mono"),
    X: fancy("X", "mono"),
    Y: fancy("Y", "mono"),
    Z: fancy("Z", "mono"),
    "0": fancy("0", "bold"),
    "1": fancy("1", "bold"),
    "2": fancy("2", "bold"),
    "3": fancy("3", "bold"),
    "4": fancy("4", "bold"),
    "5": fancy("5", "bold"),
    "6": fancy("6", "bold"),
    "7": fancy("7", "bold"),
    "8": fancy("8", "bold"),
    "9": fancy("9", "bold"),
    " ": " "
  };
  return _0x374b44.split("").map(_0x43d61c => _0x1d0ef6[_0x43d61c] || _0x43d61c).join("");
}
const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;
function formatBytes(_0x53803f) {
  if (_0x53803f >= Math.pow(1024, 3)) {
    return (_0x53803f * byteToGB).toFixed(2) + " GB";
  } else if (_0x53803f >= Math.pow(1024, 2)) {
    return (_0x53803f * byteToMB).toFixed(2) + " MB";
  } else if (_0x53803f >= 1024) {
    return (_0x53803f * byteToKB).toFixed(2) + " KB";
  } else {
    return _0x53803f.toFixed(2) + " bytes";
  }
}
async function loadSession() {
  try {
    if (fs.existsSync(sessionDir)) {
      const _0xa133e3 = fs.readdirSync(sessionDir);
      _0xa133e3.forEach(_0x5ea7bd => {
        try {
          fs.unlinkSync(path.join(sessionDir, _0x5ea7bd));
        } catch (_0x76ea3c) {}
      });
    }
    if (!config.SESSION_ID || typeof config.SESSION_ID !== "string") {
      throw new Error("❌ SESSION_ID is missing or invalid");
    }
    let _0x552f1c = config.SESSION_ID;
    const [_0x570df1, _0xd76dce] = _0x552f1c.split("~");
    if (_0x570df1 !== "king" || !_0xd76dce) {
      throw new Error("❌ Invalid session format. Expected 'king~.....'");
    }
    if (!_0xd76dce.startsWith("H4sI")) {
      const _0x24dc73 = "https://session.malvintech.co.zw/session/" + _0xd76dce;
      const _0x3f1107 = await axios.get(_0x24dc73, {
        timeout: 15000
      });
      const _0x113b7f = (_0x3f1107.data || "").toString().trim();
      if (!_0x113b7f.startsWith("king~H4sI")) {
        throw new Error("❌ Session server returned invalid data");
      }
      _0x552f1c = _0x113b7f;
    }
    const [_0x131f01, _0x3444c9] = _0x552f1c.split("~");
    if (_0x131f01 !== "king" || !_0x3444c9) {
      throw new Error("❌ Invalid session format. Expected 'king~.....'");
    }
    const _0x455a6c = _0x3444c9.replace("...", "");
    const _0x49aab9 = Buffer.from(_0x455a6c, "base64");
    const _0x3169b9 = zlib.gunzipSync(_0x49aab9);
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, {
        recursive: true
      });
    }
    fs.writeFileSync(sessionPath, _0x3169b9, "utf8");
    console.log("✅ Session File Loaded");
  } catch (_0x39934b) {
    console.error("❌ Session Error:", _0x39934b.message);
    throw _0x39934b;
  }
}
async function useSQLiteAuthState(_0x4bf765) {
  const _0x2d625d = require("better-sqlite3");
  const {
    proto: _0x16c74e,
    initAuthCreds: _0x240f1d,
    BufferJSON: _0x15cbe5
  } = require("mrxd-baileys");
  const _0x13676a = _0x4bf765.endsWith(".db") ? _0x4bf765 : _0x4bf765 + "/session.db";
  const _0x5a5190 = path.dirname(_0x13676a);
  if (!fs.existsSync(_0x5a5190)) {
    fs.mkdirSync(_0x5a5190, {
      recursive: true
    });
  }
  const _0x538eca = path.join(path.dirname(_0x13676a), "creds.json");
  let _0x264200 = null;
  if (fs.existsSync(_0x538eca)) {
    try {
      const _0x560004 = fs.readFileSync(_0x538eca, "utf8");
      _0x264200 = JSON.parse(_0x560004, _0x15cbe5.reviver);
    } catch (_0x2b92d0) {
      console.error("Failed to read creds.json:", _0x2b92d0.message);
    }
  }
  const _0x8e88df = new _0x2d625d(_0x13676a);
  _0x8e88df.pragma("journal_mode = WAL");
  _0x8e88df.exec("\n        CREATE TABLE IF NOT EXISTS session (\n            id TEXT PRIMARY KEY,\n            value TEXT\n        )\n    ");
  const _0x211d50 = _0x2e0e71 => {
    const _0x48c898 = _0x8e88df.prepare("SELECT value FROM session WHERE id = ?").get(_0x2e0e71);
    if (_0x48c898) {
      return JSON.parse(_0x48c898.value, _0x15cbe5.reviver);
    }
    return null;
  };
  const _0x576e03 = (_0x386892, _0xe1084c) => {
    _0x8e88df.prepare("INSERT OR REPLACE INTO session (id, value) VALUES (?, ?)").run(_0x386892, JSON.stringify(_0xe1084c, _0x15cbe5.replacer));
  };
  const _0x3bbb4e = _0x51fd2a => {
    _0x8e88df.prepare("DELETE FROM session WHERE id = ?").run(_0x51fd2a);
  };
  if (_0x264200) {
    _0x576e03("creds", _0x264200);
    try {
      fs.unlinkSync(_0x538eca);
    } catch (_0x21d4f9) {}
  }
  const _0x41ddd3 = _0x211d50("creds") || _0x240f1d();
  return {
    state: {
      creds: _0x41ddd3,
      keys: {
        get: async (_0x354e0e, _0x23722c) => {
          const _0xb0cdb0 = {};
          for (const _0x1a3fe0 of _0x23722c) {
            const _0x1bf2e9 = _0x211d50(_0x354e0e + "-" + _0x1a3fe0);
            if (_0x1bf2e9) {
              _0xb0cdb0[_0x1a3fe0] = _0x1bf2e9;
            }
          }
          return _0xb0cdb0;
        },
        set: async _0x3f0d31 => {
          for (const _0x35ca0d in _0x3f0d31) {
            for (const _0x3b9c1d in _0x3f0d31[_0x35ca0d]) {
              const _0x2182f8 = _0x3f0d31[_0x35ca0d][_0x3b9c1d];
              const _0x98a550 = _0x35ca0d + "-" + _0x3b9c1d;
              if (_0x2182f8) {
                _0x576e03(_0x98a550, _0x2182f8);
              } else {
                _0x3bbb4e(_0x98a550);
              }
            }
          }
        }
      }
    },
    saveCreds: () => {
      _0x576e03("creds", _0x41ddd3);
    }
  };
}
const runtime = _0x3f0af7 => {
  _0x3f0af7 = Number(_0x3f0af7);
  var _0x4e9920 = Math.floor(_0x3f0af7 / 86400);
  var _0x18e366 = Math.floor(_0x3f0af7 % 86400 / 3600);
  var _0x46a19d = Math.floor(_0x3f0af7 % 3600 / 60);
  var _0x562985 = Math.floor(_0x3f0af7 % 60);
  var _0xe62f9b = _0x4e9920 > 0 ? _0x4e9920 + (_0x4e9920 == 1 ? " day, " : " days, ") : "";
  var _0x4c5c42 = _0x18e366 > 0 ? _0x18e366 + (_0x18e366 == 1 ? " hour, " : " hours, ") : "";
  var _0x187e9c = _0x46a19d > 0 ? _0x46a19d + (_0x46a19d == 1 ? " minute, " : " minutes, ") : "";
  var _0x1e3c52 = _0x562985 > 0 ? _0x562985 + (_0x562985 == 1 ? " second" : " seconds") : "";
  return _0xe62f9b + _0x4c5c42 + _0x187e9c + _0x1e3c52;
};
const sleep = async _0x528d0a => {
  return new Promise(_0x4c9bc1 => setTimeout(_0x4c9bc1, _0x528d0a));
};
function mxdRandom(_0x56029f) {
  const _0x59adf4 = Date.now();
  const _0x13d789 = Math.floor(Math.random() * 10000);
  const _0x565cbf = path.join(__dirname, "temp");
  if (!fs.existsSync(_0x565cbf)) {
    fs.mkdirSync(_0x565cbf, {
      recursive: true
    });
  }
  return path.join(_0x565cbf, _0x59adf4 + "_" + _0x13d789 + _0x56029f);
}
async function mxdFancy(_0x4ea4c2) {
  return new Promise((_0x3c874f, _0x1a28aa) => {
    axios.get("http://qaz.wtf/u/convert.cgi?text=" + _0x4ea4c2).then(({
      data: _0x349d09
    }) => {
      let _0x144aa9 = cheerio.load(_0x349d09);
      let _0x417e54 = [];
      _0x144aa9("table > tbody > tr").each(function (_0x3f2141, _0x2e7746) {
        _0x417e54.push({
          name: _0x144aa9(_0x2e7746).find("td:nth-child(1) > h6 > a").text(),
          result: _0x144aa9(_0x2e7746).find("td:nth-child(2)").text().trim()
        });
      });
      _0x3c874f(_0x417e54);
    });
  });
}
const mxdBuffer = async (_0x46f4e4, _0x57d900 = {}) => {
  try {
    const _0x420f14 = await axios({
      method: "GET",
      url: _0x46f4e4,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
        DNT: 1,
        "Upgrade-Insecure-Request": 1
      },
      ..._0x57d900,
      responseType: "arraybuffer",
      timeout: 2400000
    });
    if (!_0x420f14.data || _0x420f14.data.length === 0) {
      throw new Error("Empty response data");
    }
    return _0x420f14.data;
  } catch (_0xa5cf33) {
    console.error("mxdBuffer Error:", _0xa5cf33);
    return _0xa5cf33;
  }
};
const mxdJson = async (_0x20c5ea, _0x5a1964 = {}) => {
  try {
    const _0x32ec87 = await axios({
      method: "GET",
      url: _0x20c5ea,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        Accept: "application/json"
      },
      ..._0x5a1964,
      timeout: 2400000
    });
    if (!_0x32ec87.data) {
      throw new Error("Empty response data");
    }
    return _0x32ec87.data;
  } catch (_0x351017) {
    console.error("mxdJson Error:", _0x351017);
    return _0x351017;
  }
};
const latestWaVersion = async () => {
  const _0x41a6bf = await mxdJson("https://web.whatsapp.com/check-update?version=1&platform=web");
  const _0x35c892 = [_0x41a6bf.currentVersion.replace(/[.]/g, ", ")];
  return _0x35c892;
};
const isUrl = _0x35939c => {
  return _0x35939c.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "gi"));
};
const isNumber = _0x59719f => {
  const _0x4dccea = parseInt(_0x59719f);
  return typeof _0x4dccea === "number" && !isNaN(_0x4dccea);
};
function verifyJidState(_0x5c6e83) {
  if (!_0x5c6e83.endsWith("@s.whatsapp.net")) {
    console.error("Your verified", _0x5c6e83);
    return false;
  }
  console.log("Welcome to " + fancy("MALVIN XD", "mono"), _0x5c6e83);
  return true;
}
async function eBase(_0x104c2a = "") {
  return Buffer.from(_0x104c2a).toString("base64");
}
async function dBase(_0x5c0146) {
  return Buffer.from(_0x5c0146, "base64").toString("utf-8");
}
async function eBinary(_0x344873 = "") {
  return _0x344873.split("").map(_0x4c28bf => _0x4c28bf.charCodeAt(0).toString(2)).join(" ");
}
async function dBinary(_0x281d88) {
  let _0x52a356 = _0x281d88.split(" ");
  let _0x4c58b0 = [];
  for (let _0x7a621c = 0; _0x7a621c < _0x52a356.length; _0x7a621c++) {
    _0x4c58b0.push(String.fromCharCode(parseInt(_0x52a356[_0x7a621c], 2)));
  }
  return _0x4c58b0.join("");
}
class mxdStore {
  constructor() {
    this.messages = new Map();
    this.contacts = new Map();
    this.chats = new Map();
    this.maxMessages = 10000;
    this.maxChats = 5000;
    this.cleanupInterval = setInterval(() => this.cleanup(), 300000);
  }
  loadMessage(_0xdb31cb, _0x2365e1) {
    const _0x25a75b = this.messages.get(_0xdb31cb);
    return _0x25a75b?.get(_0x2365e1) || null;
  }
  saveMessage(_0x4f6450, _0x441b32) {
    if (!this.messages.has(_0x4f6450)) {
      this.messages.set(_0x4f6450, new Map());
    }
    const _0x3d815c = this.messages.get(_0x4f6450);
    _0x3d815c.set(_0x441b32.key.id, _0x441b32);
    if (_0x3d815c.size > this.maxMessages) {
      const _0x3d6a86 = _0x3d815c.keys().next().value;
      _0x3d815c.delete(_0x3d6a86);
    }
  }
  cleanup() {
    try {
      if (this.messages.size > this.maxChats) {
        const _0x5b690b = this.messages.size - this.maxChats;
        const _0x42a8d7 = Array.from(this.messages.keys()).slice(0, _0x5b690b);
        _0x42a8d7.forEach(_0x2642af => this.messages.delete(_0x2642af));
      }
    } catch (_0x5afbeb) {
      console.error("Store cleanup error:", _0x5afbeb);
    }
  }
  bind(_0x233048) {
    _0x233048.on("messages.upsert", ({
      messages: _0x1aa073
    }) => {
      _0x1aa073.forEach(_0x29c5eb => {
        if (_0x29c5eb.key?.remoteJid && _0x29c5eb.key?.id) {
          this.saveMessage(_0x29c5eb.key.remoteJid, _0x29c5eb);
        }
      });
    });
    _0x233048.on("chats.set", ({
      chats: _0x587ccc
    }) => {
      _0x587ccc.forEach(_0x976607 => {
        this.chats.set(_0x976607.id, _0x976607);
      });
    });
    _0x233048.on("contacts.set", ({
      contacts: _0x5ac733
    }) => {
      _0x5ac733.forEach(_0x50fad9 => {
        this.contacts.set(_0x50fad9.id, _0x50fad9);
      });
    });
  }
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.messages.clear();
    this.contacts.clear();
    this.chats.clear();
  }
}
const {
  Sticker
} = require("wa-sticker-formatter");
const {
  exec
} = require("child_process");
function runFFmpeg(_0x548e9d, _0xfd1ab7, _0x30ae0a = 320, _0x3f2e14 = 15, _0x5efcab = 8) {
  return new Promise((_0xbf9d9b, _0xbccfb9) => {
    const _0x3a7dd8 = "\"" + ffmpegPath + "\" -i \"" + _0x548e9d + "\" -vf \"scale=" + _0x30ae0a + ":-1:force_original_aspect_ratio=decrease,fps=" + _0x3f2e14 + "\" -t " + _0x5efcab + " -an -vcodec libwebp -loop 0 -preset default -vsync 0 \"" + _0xfd1ab7 + "\" -y";
    exec(_0x3a7dd8, _0x5aa72a => {
      if (_0x5aa72a) {
        _0xbccfb9(_0x5aa72a);
      } else {
        _0xbf9d9b(_0xfd1ab7);
      }
    });
  });
}
async function getVideoDuration(_0x2842f1) {
  return new Promise(_0x56ab59 => {
    ffmpeg.ffprobe(_0x2842f1, (_0xeeea5c, _0x3aad1a) => {
      if (!_0xeeea5c && _0x3aad1a?.format?.duration) {
        return _0x56ab59(parseFloat(_0x3aad1a.format.duration));
      }
      exec("ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 \"" + _0x2842f1 + "\"", (_0x321a5b, _0x179b92) => {
        if (_0x321a5b || !_0x179b92) {
          return _0x56ab59(8);
        }
        _0x56ab59(parseFloat(_0x179b92));
      });
    });
  });
}
async function mxdSticker(_0x3ecf9c, _0x488a26) {
  let _0x248ae4;
  let _0x1d7143 = 0;
  let _0x52af67 = 320;
  let _0x1c56bd = 15;
  let _0x389321 = _0x488a26.quality || 75;
  while (_0x1d7143 < 15) {
    const _0x47c5dd = {
      ..._0x488a26
    };
    _0x47c5dd.quality = _0x389321;
    const _0x5e204e = new Sticker(_0x3ecf9c, _0x47c5dd);
    _0x248ae4 = await _0x5e204e.toBuffer();
    if (_0x248ae4.length <= 524288) {
      break;
    }
    _0x1d7143++;
    _0x389321 = Math.max(40, _0x389321 - 15);
    _0x1c56bd = Math.max(8, _0x1c56bd - 2);
    _0x52af67 = Math.max(180, _0x52af67 - 60);
  }
  return _0x248ae4;
}
function copyFolderSync(_0x185b84, _0x58dda8, _0xf9d6b7 = [".env"]) {
  if (!fs.existsSync(_0x58dda8)) {
    fs.mkdirSync(_0x58dda8, {
      recursive: true
    });
  }
  const _0xa211ea = fs.readdirSync(_0x185b84);
  for (const _0x47dd15 of _0xa211ea) {
    const _0x51ae0a = path.join(_0x185b84, _0x47dd15);
    const _0x249fc1 = path.join(_0x58dda8, _0x47dd15);
    let _0x38afaf = false;
    for (const _0x3c4937 of _0xf9d6b7) {
      if (_0x47dd15 === _0x3c4937) {
        _0x38afaf = true;
        break;
      }
      const _0x595d89 = path.relative(_0x185b84, _0x51ae0a);
      if (_0x595d89 === _0x3c4937 || _0x595d89.startsWith(_0x3c4937 + path.sep)) {
        _0x38afaf = true;
        break;
      }
    }
    if (_0x38afaf) {
      continue;
    }
    const _0x311c2b = fs.lstatSync(_0x51ae0a);
    if (_0x311c2b.isDirectory()) {
      copyFolderSync(_0x51ae0a, _0x249fc1, _0xf9d6b7);
    } else {
      fs.copyFileSync(_0x51ae0a, _0x249fc1);
    }
  }
}
const gitRepoRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\s]+)\/([^\s\/]+)/i;
const MAX_MEDIA_SIZE = 52428800;
async function getFileSize(_0x3cbfe1) {
  try {
    const _0x42d533 = await axios.head(_0x3cbfe1, {
      timeout: 10000
    });
    const _0x2b9c33 = _0x42d533.headers["content-length"];
    if (_0x2b9c33) {
      return parseInt(_0x2b9c33);
    } else {
      return 0;
    }
  } catch {
    return 0;
  }
}
function getMimeCategory(_0x17c1dc) {
  if (!_0x17c1dc) {
    return "document";
  }
  if (_0x17c1dc.startsWith("audio/")) {
    return "audio";
  }
  if (_0x17c1dc.startsWith("video/")) {
    return "video";
  }
  if (_0x17c1dc.startsWith("image/")) {
    return "image";
  }
  return "document";
}
function getMimeFromUrl(_0x24f4a6) {
  const _0x3ebbd3 = _0x24f4a6.split("?")[0].split(".").pop().toLowerCase();
  const _0x38fda8 = {
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    webm: "video/webm",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    zip: "application/zip",
    rar: "application/x-rar-compressed"
  };
  return _0x38fda8[_0x3ebbd3] || "application/octet-stream";
}
const MIME_EXTENSIONS = {
  "application/json": ".json",
  "text/html": ".html",
  "text/css": ".css",
  "text/javascript": ".js",
  "application/javascript": ".js",
  "text/plain": ".txt",
  "text/xml": ".xml",
  "application/xml": ".xml",
  "text/csv": ".csv",
  "text/markdown": ".md",
  "application/pdf": ".pdf",
  "application/zip": ".zip",
  "application/x-rar-compressed": ".rar",
  "application/x-7z-compressed": ".7z",
  "application/gzip": ".gz",
  "application/x-tar": ".tar",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/bmp": ".bmp",
  "image/tiff": ".tiff",
  "image/x-icon": ".ico",
  "audio/mpeg": ".mp3",
  "audio/wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/flac": ".flac",
  "audio/aac": ".aac",
  "audio/m4a": ".m4a",
  "audio/webm": ".weba",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/avi": ".avi",
  "video/x-msvideo": ".avi",
  "video/quicktime": ".mov",
  "video/x-matroska": ".mkv",
  "video/3gpp": ".3gp",
  "application/octet-stream": ".bin",
  "application/x-executable": ".exe",
  "application/x-sh": ".sh",
  "application/x-python": ".py",
  "text/x-python": ".py",
  "application/x-httpd-php": ".php",
  "text/x-java-source": ".java",
  "text/x-c": ".c",
  "text/x-c++": ".cpp",
  "application/typescript": ".ts",
  "text/typescript": ".ts",
  "application/wasm": ".wasm",
  "font/woff": ".woff",
  "font/woff2": ".woff2",
  "font/ttf": ".ttf",
  "font/otf": ".otf",
  "application/vnd.android.package-archive": ".apk",
  "application/x-apple-diskimage": ".dmg",
  "application/x-debian-package": ".deb",
  "application/x-rpm": ".rpm",
  "application/sql": ".sql",
  "application/x-sqlite3": ".db",
  "application/yaml": ".yaml",
  "text/yaml": ".yaml",
  "application/toml": ".toml"
};
function getExtensionFromMime(_0x1a5e31) {
  const _0x2706ed = _0x1a5e31.split(";")[0].trim().toLowerCase();
  if (MIME_EXTENSIONS[_0x2706ed]) {
    return MIME_EXTENSIONS[_0x2706ed];
  }
  for (const [_0x48cfd3, _0x42e31d] of Object.entries(MIME_EXTENSIONS)) {
    if (_0x2706ed.includes(_0x48cfd3.split("/")[1])) {
      return _0x42e31d;
    }
  }
  if (_0x2706ed.startsWith("text/")) {
    return ".txt";
  }
  if (_0x2706ed.startsWith("image/")) {
    return ".bin";
  }
  if (_0x2706ed.startsWith("audio/")) {
    return ".bin";
  }
  if (_0x2706ed.startsWith("video/")) {
    return ".bin";
  }
  return ".bin";
}
function isTextContent(_0x4b5e20) {
  const _0x4a9f49 = ["text/", "application/json", "application/javascript", "application/xml", "application/sql", "application/yaml", "application/toml", "+json", "+xml"];
  return _0x4a9f49.some(_0x3d1cb5 => _0x4b5e20.includes(_0x3d1cb5));
}
const _0x5bf3ae = {
  dBinary: dBinary,
  eBinary: eBinary,
  dBase: dBase,
  eBase: eBase,
  runtime: runtime,
  sleep: sleep,
  mxdFancy: mxdFancy,
  stickerToImage: stickerToImage,
  toAudio: toAudio,
  toVideo: toVideo,
  toPtt: toPtt,
  formatVideo: formatVideo,
  formatAudio: formatAudio,
  monospace: monospace,
  formatBytes: formatBytes,
  mxdBuffer: mxdBuffer,
  mxdJson: mxdJson,
  latestWaVersion: latestWaVersion,
  mxdRandom: mxdRandom,
  isUrl: isUrl,
  mxdStore: mxdStore,
  isNumber: isNumber,
  loadSession: loadSession,
  useSQLiteAuthState: useSQLiteAuthState,
  verifyJidState: verifyJidState,
  runFFmpeg: runFFmpeg,
  getVideoDuration: getVideoDuration,
  mxdSticker: mxdSticker,
  copyFolderSync: copyFolderSync,
  gitRepoRegex: gitRepoRegex,
  MAX_MEDIA_SIZE: MAX_MEDIA_SIZE,
  getFileSize: getFileSize,
  getMimeCategory: getMimeCategory,
  getMimeFromUrl: getMimeFromUrl,
  MIME_EXTENSIONS: MIME_EXTENSIONS,
  getExtensionFromMime: getExtensionFromMime,
  isTextContent: isTextContent
};
module.exports = _0x5bf3ae;
