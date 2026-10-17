require("events").EventEmitter.defaultMaxListeners = 960;
require("./king/mxdhelpers");
const { usePostgresAuthState } = require("./king/socket/postgresAuthState");
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
  getCacheStats,
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
const { isOwnerAuthorized } = require("./malvin/ownerAuth");
const { setupGeminiAutoReply } = require("./king/geminiChat");
const {
  fancy,
  setGlobalStyle
} = require("./king/fancyFont");
const googleTTS = require("google-tts-api");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const express = require("express");
const crypto = require("crypto");
const qrcode = require("qrcode");
const dns = require("dns").promises;
const https = require("https");

const DEBUG_WHATSAPP = process.env.DEBUG_WHATSAPP === "true";
const safeErrorText = (error) => String(error?.message || error || "erro desconhecido").replace(/(token|session|authorization|cookie|password|secret)\s*[:=]\s*[^\s,;]+/gi, "$1=[oculto]");
const safeDisconnectDetails = (error) => JSON.stringify({
  message: safeErrorText(error),
  statusCode: error?.output?.statusCode ?? error?.statusCode ?? null,
  reason: error?.data?.reason ?? error?.data?.status ?? null,
  stage: error?.data?.stage ?? null,
  description: error?.data?.description ?? null,
  dataKeys: error?.data && typeof error.data === "object" ? Object.keys(error.data) : []
});
async function diagnoseWhatsAppNetwork() {
  if (!DEBUG_WHATSAPP) return;
  const host = "web.whatsapp.com";
  try {
    const addresses = await Promise.race([
      dns.lookup(host, { all: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout DNS 8s")), 8000))
    ]);
    console.log("[WA-DIAG] DNS OK: " + addresses.map((item) => item.address).join(","));
  } catch (error) {
    console.error("[WA-DIAG] DNS FALHOU: " + safeErrorText(error));
    return;
  }
  await new Promise((resolve) => {
    const request = https.request({ hostname: host, port: 443, method: "HEAD", path: "/", timeout: 8000 }, (response) => {
      console.log("[WA-DIAG] TLS/HTTPS OK: status=" + response.statusCode);
      response.resume();
      resolve();
    });
    request.on("timeout", () => request.destroy(new Error("timeout TLS 8s")));
    request.on("error", (error) => {
      console.error("[WA-DIAG] TLS/HTTPS FALHOU: " + safeErrorText(error));
      resolve();
    });
    request.end();
  });
}

if (!global.__sousinhaWhatsAppDiagnostics) {
  process.on("unhandledRejection", (reason) => console.error("[WA-DIAG] Promise rejeitada: " + safeErrorText(reason)));
  process.on("uncaughtException", (error) => console.error("[WA-DIAG] Exceção não capturada: " + safeErrorText(error)));
  global.__sousinhaWhatsAppDiagnostics = true;
}
async function resolveRealJid(cleanVar0031, cleanVar0117) {
  if (!cleanVar0117) {
    return null;
  }
  if (!cleanVar0117.endsWith("@lid")) {
    return cleanVar0117;
  }
  try {
    const {
      getLidMapping: cleanVar0197
    } = require("./king/socket/groupStore");
    const cleanVar0203 = cleanVar0197(cleanVar0117);
    if (cleanVar0203) {
      return cleanVar0203;
    }
  } catch (cleanVar0074) {}
  try {
    const cleanVar0173 = await cleanVar0031.getJidFromLid(cleanVar0117);
    if (cleanVar0173 && !cleanVar0173.endsWith("@lid")) {
      return cleanVar0173;
    }
  } catch (cleanVar0075) {}
  try {
    const {
      getLidMappingFromDb: cleanVar0186
    } = require("./king/database/idMap");
    const cleanVar0153 = await cleanVar0186(cleanVar0117);
    if (cleanVar0153) {
      return cleanVar0153;
    }
  } catch (cleanVar0005) {}
  return cleanVar0117;
}
const {
  SESSION_ID: sessionId
} = config;
const PORT = process.env.PORT || 5000;
const app = express();
let Malvin;
let store;
let pairingCodeState = { code: null, expiresAt: 0, used: false, status: "aguardando", error: null };
let qrState = { value: null, generatedAt: 0, expiresAt: 0 };
const primaryAuthSessionId = config.WHATSAPP_AUTH_SESSION_ID || "sousinha-bot";
const recoveryAuthSessionId = config.WHATSAPP_AUTH_RECOVERY_SESSION_ID || `${primaryAuthSessionId}-recovery`;
let activeAuthSessionId = config.WHATSAPP_AUTH_RECOVERY ? recoveryAuthSessionId : primaryAuthSessionId;
let authRecoveryStarted = false;
let socketStartInFlight = false;
let activeAuthClose = null;
let activeSocket = null;
let processHandlersInstalled = false;
let pluginsLoaded = false;
let autoBioTimer = null;
let autoBioStartupTimer = null;
let waConnectionState = "starting";
let memoryTelemetryTimer = null;
logger.level = "silent";
app.use(express.static("king"));
app.use(express.urlencoded({ extended: false }));
app.get("/", (cleanVar0094, cleanVar0181) => cleanVar0181.status(200).send("Sousinha Bot está online."));
app.get("/health", (cleanVar0225, cleanVar0185) => cleanVar0185.status(200).json({
  status: "alive",
  uptime: process.uptime(),
  whatsapp: waConnectionState,
  authStorage: String(config.WHATSAPP_AUTH_STORAGE).toLowerCase()
}));
function pairingTokenIsValid(token) {
  const expected = String(config.PAIRING_HTTP_TOKEN || "");
  const received = String(token || "");
  if (!expected || !received || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}
function pairingTokenFromRequest(req) {
  return req.body?.token || req.query?.token || req.get("x-pairing-token") || "";
}
app.get("/pairing", (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!config.PAIRING_HTTP_TOKEN) return res.status(404).send("Pareamento HTTP desativado.");
  res.type("html").send(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sousinha Bot</title><style>body{font-family:system-ui;max-width:420px;margin:48px auto;padding:20px;background:#111;color:#eee}input,button{box-sizing:border-box;width:100%;padding:13px;margin-top:10px;border-radius:8px;border:1px solid #555;background:#222;color:#fff}button{background:#25d366;border:0;color:#111;font-weight:700}</style><h1>Pareamento do Sousinha Bot</h1><p>Digite o token temporário configurado no Render.</p><form method="post" action="/pairing"><input name="token" type="password" autocomplete="off" required placeholder="Token de acesso"><button>Exibir código</button></form>`);
});
app.post("/pairing", (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!pairingTokenIsValid(pairingTokenFromRequest(req))) return res.status(401).type("html").send("Token inválido.");
  const available = pairingCodeState.code && Date.now() < pairingCodeState.expiresAt && !pairingCodeState.used;
  if (!available) {
    const detail = pairingCodeState.error || (pairingCodeState.status === "aguardando" ? "O WhatsApp ainda não liberou o código." : "Código indisponível, expirado ou já utilizado.");
    return res.status(pairingCodeState.status === "erro" ? 503 : 410).type("html").send(detail + " Aguarde a próxima tentativa do serviço.");
  }
  const code = pairingCodeState.code;
  pairingCodeState.used = true;
  pairingCodeState.status = "usado";
  res.type("html").send(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Código de pareamento</title><style>body{font-family:system-ui;text-align:center;margin:48px auto;padding:20px;background:#111;color:#eee}.code{font-size:2.2rem;letter-spacing:.25rem;font-weight:800;background:#222;padding:20px;border-radius:12px}</style><h1>Sousinha Bot</h1><p>Digite este código no WhatsApp em Aparelhos conectados:</p><div class="code">${code}</div><p>Este código foi exibido uma única vez.</p>`);
});
app.get("/qr", async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!config.PAIRING_HTTP_TOKEN && !config.PUBLIC_QR) return res.status(404).send("QR HTTP desativado.");
  if (config.PUBLIC_QR || req.query?.token) {
    if (!config.PUBLIC_QR && !pairingTokenIsValid(pairingTokenFromRequest(req))) return res.status(401).json({ error: "Token inválido." });
    if (waConnectionState === "open") return res.status(200).json({ status: "connected", message: "WhatsApp já conectado; não é necessário escanear um QR Code." });
    if (!qrState.value || Date.now() >= qrState.expiresAt) {
      res.set("Retry-After", "3");
      return res.status(202).json({ status: "waiting_for_qr", whatsapp: waConnectionState, message: "Aguardando um QR Code real do WhatsApp. Atualize em alguns segundos." });
    }
    try {
      const imageDataUrl = await qrcode.toDataURL(qrState.value, { errorCorrectionLevel: "M", margin: 2, width: 360 });
      const secondsLeft = Math.max(0, Math.ceil((qrState.expiresAt - Date.now()) / 1000));
      return res.type("html").send(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR Code do Sousinha Bot</title><style>body{font-family:system-ui;text-align:center;margin:32px auto;padding:20px;background:#111;color:#eee}img{display:block;width:360px;max-width:100%;height:auto;margin:20px auto;background:#fff;padding:12px;border-radius:12px}</style><h1>QR Code do Sousinha Bot</h1><p>Escaneie este QR no WhatsApp em Aparelhos conectados.</p><img src="${imageDataUrl}" alt="QR Code para conectar o Sousinha Bot"><p>Este QR expira em aproximadamente ${secondsLeft}s.</p><p>Se expirar, atualize e consulte novamente com o token.</p>`);
    } catch (error) {
      console.error("[QR] Falha ao renderizar QR:", safeErrorText(error));
      return res.status(500).json({ error: "Não foi possível renderizar o QR Code atual." });
    }
  }
  res.type("html").send(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR Code do Sousinha Bot</title><style>body{font-family:system-ui;max-width:420px;margin:48px auto;padding:20px;background:#111;color:#eee}input,button{box-sizing:border-box;width:100%;padding:13px;margin-top:10px;border-radius:8px;border:1px solid #555;background:#222;color:#fff}button{background:#25d366;border:0;color:#111;font-weight:700}</style><h1>QR Code do Sousinha Bot</h1><p>O endpoint retorna o payload atual para uma interface QR compatível.</p><form method="post" action="/qr"><input name="token" type="password" autocomplete="off" required placeholder="Token de acesso"><button>Consultar QR atual</button></form>`);
});
app.post("/qr", async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!config.PUBLIC_QR && !pairingTokenIsValid(pairingTokenFromRequest(req))) return res.status(401).json({ error: "Token inválido." });
  if (waConnectionState === "open") return res.status(200).json({ status: "connected", message: "WhatsApp já conectado; não é necessário escanear um QR Code." });
  if (!qrState.value || Date.now() >= qrState.expiresAt) {
    res.set("Retry-After", "3");
    return res.status(202).json({ status: "waiting_for_qr", whatsapp: waConnectionState, message: "Aguardando um QR Code real do WhatsApp. Atualize em alguns segundos." });
  }
  try {
    const imageDataUrl = await qrcode.toDataURL(qrState.value, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 360
    });
    const secondsLeft = Math.max(0, Math.ceil((qrState.expiresAt - Date.now()) / 1000));
    return res.type("html").send(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR Code do Sousinha Bot</title><style>body{font-family:system-ui;text-align:center;margin:32px auto;padding:20px;background:#111;color:#eee}img{display:block;width:360px;max-width:100%;height:auto;margin:20px auto;background:#fff;padding:12px;border-radius:12px}code{word-break:break-all;color:#aaa;font-size:.75rem}</style><h1>QR Code do Sousinha Bot</h1><p>Escaneie este QR no WhatsApp em Aparelhos conectados.</p><img src="${imageDataUrl}" alt="QR Code para conectar o Sousinha Bot"><p>Este QR expira em aproximadamente ${secondsLeft}s.</p><p>Se expirar, atualize e consulte novamente com o token.</p>`);
  } catch (error) {
    console.error("[QR] Falha ao renderizar QR:", safeErrorText(error));
    return res.status(500).json({ error: "Não foi possível renderizar o QR Code atual." });
  }
});
app.listen(PORT, () => console.log("✅ Server Running on Port: " + PORT));
setInterval(() => {
  const cleanVar0178 = process.memoryUsage();
  if (cleanVar0178.heapUsed > 419430400) {
    if (global.gc) {
      global.gc();
    }
  }
}, 60000);
setInterval(async () => {
  if (global.MalvinBot) {
    await runNotifications(global.MalvinBot, global.botId).catch(cleanVar0018 => console.error("[Notifications]", cleanVar0018.message));
  }
}, 1800000);
const emitMemoryTelemetry = () => {
  try {
    const usage = process.memoryUsage();
    const listeners = activeSocket?.ev;
    const cache = typeof getCacheStats === "function" ? getCacheStats() : {};
    const mb = (value) => Math.round(Number(value || 0) / 1048576);
    console.log(`[MEMORY] heap=${mb(usage.heapUsed)}/${mb(usage.heapTotal)}MB rss=${mb(usage.rss)}MB external=${mb(usage.external)}MB arrayBuffers=${mb(usage.arrayBuffers)}MB uptime=${Math.round(process.uptime())}s groups=${cache.groups ?? "unavailable"} lids=${cache.lids ?? "unavailable"} listeners=${listeners?.listenerCount?.("messages.upsert") || 0} sockets=${activeSocket ? 1 : 0}`);
  } catch (error) {
    console.error(`[MEMORY] telemetry error: ${safeErrorText(error)}`);
  }
};
emitMemoryTelemetry();
memoryTelemetryTimer = setInterval(emitMemoryTelemetry, 30000);
if (typeof memoryTelemetryTimer.unref === "function") memoryTelemetryTimer.unref();
const sessionDir = process.env.SESSION_DIR || path.join(__dirname, "king", "session");
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
    } catch (cleanVar0207) {
      logger.warn("Ignoring invalid saved FONT_STYLE \"" + botSettings.FONT_STYLE + "\": " + cleanVar0207.message);
    }
  }
  if (config.ENABLE_RPG) {
    await connectRPG();
  } else {
    console.log("[RPG] Sistema RPG desativado; ENABLE_RPG=false.");
  }
  return botSettings;
}
startCleanup();
async function startMalvin() {
  if (socketStartInFlight) {
    console.warn("[WA-DIAG] Inicialização de socket já em andamento; nova tentativa ignorada.");
    return;
  }
  socketStartInFlight = true;
  try {
    console.log("🔄 Obtendo versão do WhatsApp...");
    const cleanVar0034 = (await fetchLatestWaWebVersion({ timeout: 10000 }))?.version;
    if (!Array.isArray(cleanVar0034)) throw new Error("Versão do WhatsApp Web indisponível");
    console.log("✅ Versão do WhatsApp obtida.");
    await diagnoseWhatsAppNetwork();
    await fs.ensureDir(sessionDir);
    const cleanVar0082 = path.join(sessionDir, "session.db");
    const usePostgresAuth = String(config.WHATSAPP_AUTH_STORAGE).toLowerCase() === "postgres";
    if (usePostgresAuth && !config.WHATSAPP_AUTH_DATABASE_URL) {
      throw new Error("WHATSAPP_AUTH_DATABASE_URL/DATABASE_URL não configurada para persistir a sessão no Render.");
    }
    if (!usePostgresAuth && !config.SQLITE_PATH) {
      console.warn("[WA-DIAG] Autenticação SQLite em caminho local; o Render pode perder a sessão após reinício. Configure WHATSAPP_AUTH_STORAGE=postgres e WHATSAPP_AUTH_DATABASE_URL.");
    }
    if (activeAuthClose) {
      try {
        await activeAuthClose();
      } catch (cleanVar0024) {
        console.error("[WA-DIAG] Falha ao fechar armazenamento de sessão anterior: " + safeErrorText(cleanVar0024));
      }
      activeAuthClose = null;
    }
    console.log(usePostgresAuth ? "🔄 Abrindo autenticação no Supabase/PostgreSQL..." : "🔄 Abrindo autenticação local...");
    const authState = usePostgresAuth
      ? await usePostgresAuthState(config.WHATSAPP_AUTH_DATABASE_URL, activeAuthSessionId)
      : await useSQLiteAuthState(cleanVar0082);
    const {
      state: cleanVar0042,
      saveCreds: cleanVar0053
    } = authState;
    if (usePostgresAuth && activeAuthSessionId === recoveryAuthSessionId && !cleanVar0042.creds?.accountSyncCounter) {
      cleanVar0042.creds.accountSyncCounter = 1;
      console.warn("[WA-DIAG] Bootstrap inicial do App State desativado na sessão de recuperação; mensagens novas continuam habilitadas.");
    }
    activeAuthClose = typeof authState.close === "function" ? authState.close : null;
    console.log(usePostgresAuth ? `✅ Autenticação PostgreSQL aberta (sessão lógica ${activeAuthSessionId === (config.WHATSAPP_AUTH_SESSION_ID || "sousinha-bot") ? "principal" : "recuperação"}).` : "✅ Autenticação local aberta.");
    const pairingMarkerIncomplete = cleanVar0042.creds?.me?.name === "~" && cleanVar0042.creds?.registered !== true;
    const pairingSessionIncomplete = !cleanVar0042.creds?.me?.id || pairingMarkerIncomplete || cleanVar0042.creds?.registered === false;
    if (config.USE_PAIRING_CODE && pairingMarkerIncomplete) {
      console.warn("[PAIRING] Marcador de pareamento incompleto encontrado; limpando apenas creds.me/pairingCode para iniciar registro, sem apagar a sessão.");
      delete cleanVar0042.creds.me;
      delete cleanVar0042.creds.pairingCode;
      await cleanVar0053();
    }
    if (activeSocket?.ev?.removeAllListeners) {
      activeSocket.ev.removeAllListeners();
    }
    activeSocket = null;
    if (store) {
      store.destroy();
    }
    store = new SQLiteStore();
    const cleanVar0167 = createSocketConfig(cleanVar0034, cleanVar0042, logger);
    cleanVar0167.getMessage = async cleanVar0159 => {
      if (store) {
        const cleanVar0212 = await store.loadMessage(cleanVar0159.remoteJid, cleanVar0159.id);
        return cleanVar0212?.message || undefined;
      }
      return {
        conversation: "Error occurred"
      };
    };
    console.log("🔄 Criando conexão com o WhatsApp...");
    Malvin = malvinConnect(cleanVar0167);
    activeSocket = Malvin;
    waConnectionState = "connecting";
    console.log("✅ Socket do WhatsApp criado; aguardando QR ou conexão...");
    let connectionState = "created";
    const socketWatchdog = setTimeout(() => {
      if (connectionState !== "open") {
        console.error("[WA-DIAG] Sem avanço do socket após 20s: estado=" + connectionState + ". Possível falha de DNS, TLS, WebSocket ou versão incompatível.");
      }
    }, 20000);
    Malvin.ev.on("connection.update", update => {
      if (update?.connection) connectionState = update.connection;
      if (update?.connection) waConnectionState = update.connection;
      if (DEBUG_WHATSAPP) {
        const details = {
          connection: update?.connection || null,
          hasQr: Boolean(update?.qr),
          isNewLogin: Boolean(update?.isNewLogin),
          registered: cleanVar0042.creds?.registered === true,
          receivedPendingNotifications: Boolean(update?.receivedPendingNotifications),
          hasDisconnectError: Boolean(update?.lastDisconnect?.error)
        };
        console.log("[WA-DIAG] connection.update=" + JSON.stringify(details));
        if (update?.lastDisconnect?.error) console.error("[WA-DIAG] desconexão=" + safeDisconnectDetails(update.lastDisconnect.error));
      }
      if (update?.connection === "open") clearTimeout(socketWatchdog);
      if (update?.qr) {
        const generatedAt = Date.now();
        qrState = { value: update.qr, generatedAt, expiresAt: generatedAt + 60000 };
        if (DEBUG_WHATSAPP) console.log("[WA-DIAG] QR atualizado; expira em 60s e está disponível em POST /qr com token.");
      } else if (update?.connection === "open" || update?.connection === "close") {
        qrState = { value: null, generatedAt: 0, expiresAt: 0 };
      }
    });
    Malvin.ev.on("creds.update", update => {
      if (DEBUG_WHATSAPP) console.log("[WA-DIAG] creds.update recebido: campos=" + Object.keys(update || {}).join(",") + ", registered=" + String(update?.registered ?? cleanVar0042.creds?.registered ?? "desconhecido") + ", hasMe=" + String(Boolean(update?.me || cleanVar0042.creds?.me)));
    });
    const pairingNumber = String(config.PAIRING_NUMBER || "").replace(/\D/g, "");
    const shouldRequestPairingCode = config.USE_PAIRING_CODE && pairingNumber && pairingSessionIncomplete && (config.FORCE_PAIRING_CODE || cleanVar0042.creds?.registered !== true);
    let pairingRequested = false;
    const requestPairingCode = async () => {
      if (pairingRequested) return;
      pairingRequested = true;
      pairingCodeState = { code: null, expiresAt: 0, used: false, status: "solicitando", error: null };
      console.log("🔐 Iniciando pareamento: número configurado=" + (pairingNumber ? "sim" : "não") + ", método disponível=" + (typeof Malvin.requestPairingCode === "function" ? "sim" : "não"));
      if (!shouldRequestPairingCode || typeof Malvin.requestPairingCode !== "function") {
        pairingCodeState.status = "erro";
        pairingCodeState.error = "O método de pareamento não está disponível nesta versão do adaptador.";
        console.error("❌ Pareamento não iniciado. Verifique USE_PAIRING_CODE, FORCE_PAIRING_CODE, PAIRING_NUMBER e a versão do Baileys.");
        return;
      }
      try {
        if (typeof Malvin.waitForSocketOpen === "function") {
          await Promise.race([
            Malvin.waitForSocketOpen(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("tempo limite de 10 segundos aguardando WebSocket aberto")), 10000))
          ]);
          await new Promise(resolve => setTimeout(resolve, 1500));
          console.log("🔗 Transporte WebSocket aberto; solicitando código após o handshake.");
        } else {
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.warn("⚠️ waitForSocketOpen não está disponível; usando atraso de segurança.");
        }
        const pairingCode = await Promise.race([
          Malvin.requestPairingCode(pairingNumber),
          new Promise((_, reject) => setTimeout(() => reject(new Error("tempo limite de 15 segundos aguardando resposta do WhatsApp")), 15000))
        ]);
        pairingCodeState = { code: String(pairingCode), expiresAt: Date.now() + 10 * 60 * 1000, used: false, status: "pronto", error: null };
        console.log("\n🔐 Código de pareamento gerado e protegido no endpoint /pairing (não será impresso integralmente nos logs). Código mascarado: " + String(pairingCode).slice(0, 2) + "••••");
        console.log("No WhatsApp: Configurações > Aparelhos conectados > Conectar aparelho > Conectar com número de telefone.\n");
      } catch (pairingError) {
        pairingCodeState.status = "erro";
        pairingCodeState.error = pairingError.message || "Falha desconhecida ao solicitar o código.";
        console.error("❌ Não foi possível gerar o código de pareamento:", pairingError.stack || pairingError.message);
      }
    };
    Malvin.ev.on("connection.update", update => {
      if (update?.connection === "connecting" && shouldRequestPairingCode) {
        console.log("🔗 Evento inicial de conexão recebido; aguardando o transporte WebSocket real...");
        setTimeout(requestPairingCode, 500);
      }
      if (update?.connection === "close" && update.lastDisconnect?.error) {
        const closeError = update.lastDisconnect.error;
        console.error("❌ Conexão WhatsApp encerrada durante o pareamento: " + safeDisconnectDetails(closeError));
      }
    });
    if (shouldRequestPairingCode || config.USE_PAIRING_CODE) {
      console.log("🔧 Pareamento configurado: ativado=" + (config.USE_PAIRING_CODE ? "sim" : "não") + ", forçado=" + (config.FORCE_PAIRING_CODE ? "sim" : "não") + ", número=" + (pairingNumber ? "válido" : "ausente"));
    }
    store.bind(Malvin.ev);
    Malvin.ev.process(async cleanVar0190 => {
      if (cleanVar0190["creds.update"]) {
        await cleanVar0053();
        const updatedCreds = cleanVar0190["creds.update"];
        if (updatedCreds?.registered === true) {
          pairingCodeState.status = "registrado";
          pairingCodeState.error = null;
          console.log("✅ [PAIRING] Credenciais registradas e persistidas; restartRequired será tratado sem apagar a sessão.");
        }
      }
    });
    setupAutoReact(Malvin);
    setupAntiDelete(Malvin);
    setupAutoBio(Malvin);
    setupAntiCall(Malvin);
    setupNewsletterReact(Malvin);
    setupPresence(Malvin);
    setupChatBotAndAntiLink(Malvin);
    setupGeminiAutoReply(Malvin);
    setupMalvinChatBot(Malvin, createContext, createContext2, googleTTS);
    setupAntiEdit(Malvin);
    setupStatusHandlers(Malvin);
    setupGroupEventsListeners(Malvin);
    if (!pluginsLoaded) {
      loadPlugins(pluginsPath);
      pluginsLoaded = true;
    }
    setupCommandHandler(Malvin);
    setupConnectionHandler(Malvin, sessionDir, startMalvin, {
      onClose: async cleanVar0160 => {
        waConnectionState = "closed";
        if (cleanVar0160 === activeSocket) activeSocket = null;
        if (activeAuthClose) {
          await activeAuthClose();
          activeAuthClose = null;
        }
        store?.destroy();
      },
      onDeviceRemoved: async () => {
        if (authRecoveryStarted) return;
        authRecoveryStarted = true;
        activeAuthSessionId = recoveryAuthSessionId;
        qrState = { value: null, generatedAt: 0, expiresAt: 0 };
        pairingCodeState = { code: null, expiresAt: 0, used: false, status: "aguardando", error: null };
        console.warn("[PAIRING] Sessão principal preservada; iniciando sessão PostgreSQL isolada para novo pareamento.");
        setTimeout(() => {
          startMalvin().catch((error) => console.error("[PAIRING] Falha ao iniciar sessão de recuperação:", safeErrorText(error)));
        }, 1000);
      },
      onOpen: async cleanVar0160 => {
        const cleanVar0235 = await getAllSettings();
        console.log("💙 Connected to Whatsapp, Active! Comandos liberados; sincronizações opcionais continuam em segundo plano.");
        const backgroundSync = [
          safeNewsletterFollow(cleanVar0160, cleanVar0235.NEWSLETTER_JID),
          safeGroupAcceptInvite(cleanVar0160, cleanVar0235.GC_JID),
          Promise.resolve().then(() => console.log("[WA-DIAG] Pré-carga global de grupos/LIDs desativada; metadados serão obtidos sob demanda."))
        ];
        Promise.allSettled(backgroundSync).then(results => {
          const failures = results.filter(result => result.status === "rejected");
          if (failures.length && DEBUG_WHATSAPP) {
            console.warn("[WA-DIAG] Sincronizações em segundo plano com falha: " + failures.length);
          }
        });
        const { startRentalExpiryMonitor } = require("./malvin/rental");
        startRentalExpiryMonitor(cleanVar0160);
        setTimeout(async () => {
          try {
            const cleanVar0120 = commands.filter(cleanVar0011 => cleanVar0011.pattern && !cleanVar0011.dontAddCommandList).length;
            if (cleanVar0235.STARTING_MESSAGE === "true") {
              const cleanVar0009 = DEFAULT_SETTINGS;
              const cleanVar0234 = cleanVar0235.MODE === "public" ? "public" : "private";
              const cleanVar0205 = cleanVar0235.PREFIX || cleanVar0009.PREFIX;
              const cleanVar0063 = "\n╭════════════════╮\n┆  `🤖 " + fancy("malvin - xd", "smallcaps") + "`  \n╰════════════════╯\n👋 Hi " + (cleanVar0235.OWNER_NAME || cleanVar0009.OWNER_NAME || "there") + "\n🎉 D" + fancy("EPLOYMENT", "mono") + " C" + fancy("OMPLETED", "mono") + " \n– You're good to go!  \n\n📌 " + fancy("prefi", "smallcaps") + "x:    : *[ " + cleanVar0205 + " ]*\n📦 " + fancy("cmd", "smallcaps") + "s:     : *" + cleanVar0120 + "*\n🌍 " + fancy("mode", "smallcaps") + "     : *" + cleanVar0234 + "*\n🙂‍↕️ " + fancy("owner", "smallcaps") + "    : *" + (cleanVar0235.OWNER_NUMBER || cleanVar0009.OWNER_NUMBER) + "*\n\n" + fancy("Note", "bold") + ":  Bot may take some few seconds/minutes to sync before being ready to use.";
              await sendButtons(cleanVar0160, cleanVar0160.user.id, {
                title: "🤖 " + fancy("malvin - xd", "smallcaps"),
                text: cleanVar0063,
                image: {
                  url: cleanVar0235.BOT_PIC || "https://i.ibb.co/zHhMyRT3/malvin-xd.jpg"
                },
                footer: "> *" + (cleanVar0235.CAPTION || cleanVar0009.CAPTION) + "*",
                buttons: [{
                  id: cleanVar0205 + "menu",
                  text: "📜 Menu"
                }, {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🖥️ Tutorials",
                    url: cleanVar0235.YT || cleanVar0009.YT
                  })
                }, {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📢 Channel",
                    url: cleanVar0235.NEWSLETTER_URL || cleanVar0009.NEWSLETTER_URL
                  })
                }]
              }, {
                disappearingMessagesInChat: true,
                ephemeralExpiration: 300
              });
            }
          } catch (cleanVar0164) {
            console.error("Post-connection setup error:", cleanVar0164);
          }
        }, 5000);
      }
    });
    socketStartInFlight = false;
    if (!processHandlersInstalled) {
      const shutdown = async () => {
        try {
          activeSocket?.ev?.removeAllListeners?.();
          store?.destroy();
          if (activeAuthClose) await activeAuthClose();
        } finally {
          process.exit(0);
        }
      };
      process.once("SIGINT", shutdown);
      process.once("SIGTERM", shutdown);
      processHandlersInstalled = true;
    }
  } catch (cleanVar0084) {
    socketStartInFlight = false;
    console.error("Socket initialization error:", cleanVar0084);
    const authConfigError = /DATABASE_URL|autenticação PostgreSQL|WHATSAPP_AUTH_DATABASE_URL/i.test(String(cleanVar0084?.message || cleanVar0084));
    if (!authConfigError) {
      setTimeout(() => startMalvin(), 15000);
    } else {
      console.error("[WA-DIAG] Reconexão automática pausada: configure o armazenamento persistente da sessão.");
    }
  }
}
function setupAutoReact(cleanVar0189) {
  cleanVar0189.ev.on("messages.upsert", async cleanVar0216 => {
    try {
      const cleanVar0066 = cleanVar0216.messages[0];
      const cleanVar0064 = await getAllSettings();
      const cleanVar0180 = cleanVar0064.AUTO_REACT || "off";
      if (cleanVar0180 === "off" || cleanVar0180 === "false" || cleanVar0066.key.fromMe || !cleanVar0066.message) {
        return;
      }
      const cleanVar0202 = cleanVar0066.key.remoteJid;
      const cleanVar0199 = cleanVar0202?.endsWith("@g.us");
      const cleanVar0051 = cleanVar0202?.endsWith("@s.whatsapp.net");
      let cleanVar0172 = false;
      if (cleanVar0180 === "all" || cleanVar0180 === "true") {
        cleanVar0172 = true;
      } else if (cleanVar0180 === "dm" && cleanVar0051) {
        cleanVar0172 = true;
      } else if (cleanVar0180 === "groups" && cleanVar0199) {
        cleanVar0172 = true;
      }
      if (!cleanVar0172) {
        return;
      }
      const cleanVar0151 = emojis[Math.floor(Math.random() * emojis.length)];
      await MalvinAutoReact(cleanVar0151, cleanVar0066, cleanVar0189);
    } catch (cleanVar0146) {
      console.error("Error during auto reaction:", cleanVar0146);
    }
  });
}
function setupAntiDelete(cleanVar0039) {
  const cleanVar0208 = cleanVar0039.user?.id.split(":")[0] + "@s.whatsapp.net";
  const cleanVar0218 = cleanVar0208;
  const cleanVar0037 = cleanVar0030 => {
    const cleanVar0048 = cleanVar0030.key;
    const cleanVar0106 = cleanVar0072 => cleanVar0072 && !cleanVar0072.endsWith("@lid") ? cleanVar0072 : null;
    return cleanVar0106(cleanVar0048.participantPn) || cleanVar0106(cleanVar0048.senderPn) || cleanVar0106(cleanVar0030.senderPn) || cleanVar0106(cleanVar0048.participant) || cleanVar0106(cleanVar0030.participant) || cleanVar0048.participantPn || cleanVar0048.participant || cleanVar0030.participant || (cleanVar0048.remoteJid?.endsWith("@g.us") ? null : cleanVar0106(cleanVar0048.remoteJid) || cleanVar0048.remoteJid);
  };
  const cleanVar0213 = cleanVar0191 => {
    return cleanVar0191.pushName || cleanVar0191.key?.pushName || cleanVar0191.verifiedBizName || "Unknown";
  };
  const cleanVar0158 = cleanVar0014 => {
    return cleanVar0014.message?.protocolMessage || cleanVar0014.message?.ephemeralMessage?.message?.protocolMessage || cleanVar0014.message?.viewOnceMessage?.message?.protocolMessage || cleanVar0014.message?.viewOnceMessageV2?.message?.protocolMessage;
  };
  const cleanVar0223 = cleanVar0125 => {
    return cleanVar0125.message?.protocolMessage || cleanVar0125.message?.ephemeralMessage?.message?.protocolMessage || cleanVar0125.message?.viewOnceMessage?.message?.protocolMessage || cleanVar0125.message?.viewOnceMessageV2?.message?.protocolMessage;
  };
  const cleanVar0013 = cleanVar0194 => {
    const cleanVar0096 = cleanVar0194.message;
    if (!cleanVar0096) {
      return null;
    }
    return cleanVar0096.ephemeralMessage?.message || cleanVar0096.viewOnceMessage?.message || cleanVar0096.viewOnceMessageV2?.message || cleanVar0096.documentWithCaptionMessage?.message || cleanVar0096;
  };
  cleanVar0039.ev.on("messages.upsert", async ({
    messages: cleanVar0183
  }) => {
    for (const cleanVar0168 of cleanVar0183) {
      try {
        if (!cleanVar0168?.message) {
          continue;
        }
        const {
          key: cleanVar0107
        } = cleanVar0168;
        if (!cleanVar0107?.remoteJid || cleanVar0107.fromMe || cleanVar0107.remoteJid === "status@broadcast") {
          continue;
        }
        const cleanVar0246 = cleanVar0223(cleanVar0168);
        if (cleanVar0246?.type === 0) {
          const cleanVar0032 = cleanVar0246.key;
          const cleanVar0239 = cleanVar0032?.id;
          const cleanVar0150 = cleanVar0107.remoteJid;
          if (!cleanVar0239) {
            continue;
          }
          const cleanVar0019 = findAntiDelete(cleanVar0150, cleanVar0239);
          if (!cleanVar0019?.message) {
            continue;
          }
          const cleanVar0192 = cleanVar0037(cleanVar0168) || cleanVar0107.remoteJid;
          const cleanVar0052 = cleanVar0213(cleanVar0168);
          if (cleanVar0192 === cleanVar0208 || cleanVar0192 === cleanVar0218) {
            continue;
          }
          await MalvinAntiDelete(cleanVar0039, cleanVar0019, cleanVar0107, cleanVar0192, cleanVar0019.originalSender, cleanVar0218, cleanVar0052, cleanVar0019.originalPushName);
          removeAntiDelete(cleanVar0150, cleanVar0239);
          continue;
        }
        if (cleanVar0158(cleanVar0168)) {
          continue;
        }
        const cleanVar0201 = cleanVar0013(cleanVar0168);
        if (!cleanVar0201) {
          continue;
        }
        const cleanVar0188 = cleanVar0037(cleanVar0168);
        const cleanVar0206 = cleanVar0213(cleanVar0168);
        if (!cleanVar0188 || cleanVar0188 === cleanVar0208 || cleanVar0188 === cleanVar0218) {
          continue;
        }
        const cleanVar0033 = cleanVar0107.remoteJid;
        const cleanVar0132 = {
          ...cleanVar0168,
          message: cleanVar0201,
          originalSender: cleanVar0188,
          originalPushName: cleanVar0206,
          timestamp: Date.now()
        };
        setImmediate(() => saveAntiDelete(cleanVar0033, cleanVar0132));
      } catch (cleanVar0118) {
        logger.error("Anti-delete system error:", cleanVar0118);
      }
    }
  });
}
function setupAutoBio(cleanVar0198) {
  if (autoBioStartupTimer) clearTimeout(autoBioStartupTimer);
  if (autoBioTimer) clearInterval(autoBioTimer);
  autoBioStartupTimer = null;
  autoBioTimer = null;
  (async () => {
    const cleanVar0114 = await getAllSettings();
    if (cleanVar0114.AUTO_BIO === "true") {
      autoBioStartupTimer = setTimeout(() => {
        if (global.MalvinBot === cleanVar0198) MalvinAutoBio(cleanVar0198);
      }, 1000);
      autoBioTimer = setInterval(() => {
        if (global.MalvinBot) MalvinAutoBio(global.MalvinBot);
      }, 60000);
    }
    global.MalvinBot = cleanVar0198;
    global.botId = botSettings.BOT_ID || cleanVar0198.user?.id?.split(":")[0] + "@s.whatsapp.net";
  })();
}
function setupAntiCall(cleanVar0138) {
  cleanVar0138.ev.on("call", async cleanVar0176 => {
    await MalvinAnticall(cleanVar0176, cleanVar0138);
  });
}
let _newsletterCache = null;
let _newsletterCacheAt = 0;
const NEWSLETTER_TTL = 120000;
async function _getNewsletters() {
  if (_newsletterCache && Date.now() - _newsletterCacheAt < NEWSLETTER_TTL) {
    return _newsletterCache;
  }
  const cleanVar0220 = Buffer.from("aHR0cHM6Ly9jZG4ubWFsdmludGVjaC5zYnMvZmlsZS9jaEppZHMuanNvbg=", "base64").toString();
  const cleanVar0243 = await axios.get(cleanVar0220, {
    timeout: 8000
  });
  _newsletterCache = cleanVar0243.data;
  _newsletterCacheAt = Date.now();
  return _newsletterCache;
}
function setupNewsletterReact(cleanVar0219) {
  const cleanVar0147 = ["❤️", "💛", "👍", "😮", "🥰", "💙"];
  cleanVar0219.ev.on("messages.upsert", async cleanVar0081 => {
    try {
      const cleanVar0231 = cleanVar0081.messages[0];
      if (!cleanVar0231?.message || !cleanVar0231?.key?.server_id) {
        return;
      }
      const cleanVar0088 = await _getNewsletters();
      if (!cleanVar0088.includes(cleanVar0231.key.remoteJid)) {
        return;
      }
      const cleanVar0122 = cleanVar0147[Math.floor(Math.random() * cleanVar0147.length)];
      await cleanVar0219.newsletterReactMessage(cleanVar0231.key.remoteJid, cleanVar0231.key.server_id.toString(), cleanVar0122);
    } catch (cleanVar0196) {
      if (cleanVar0196?.code === "ECONNRESET" || cleanVar0196?.code === "ECONNREFUSED" || cleanVar0196?.code === "ETIMEDOUT") {
        _newsletterCache = null;
      }
    }
  });
}
function setupPresence(cleanVar0086) {
  cleanVar0086.ev.on("messages.upsert", async ({
    messages: cleanVar0089
  }) => {
    if (cleanVar0089?.length > 0) {
      await MalvinPresence(cleanVar0086, cleanVar0089[0].key.remoteJid);
    }
  });
  cleanVar0086.ev.on("connection.update", ({
    connection: cleanVar0224
  }) => {
    if (cleanVar0224 === "open") {
      MalvinPresence(cleanVar0086, "status@broadcast");
    }
  });
}
function setupChatBotAndAntiLink(cleanVar0095) {
  cleanVar0095.ev.on("messages.upsert", async ({
    messages: cleanVar0080,
    type: cleanVar0217
  }) => {
    if (cleanVar0217 === "append") {
      return;
    }
    for (const cleanVar0004 of cleanVar0080) {
      if (!cleanVar0004?.message) {
        continue;
      }
      const cleanVar0245 = cleanVar0004.key?.remoteJid || "";
      if (cleanVar0004.key.fromMe && !cleanVar0245.endsWith("@g.us")) {
        continue;
      }
      if (cleanVar0245.endsWith("@g.us")) {
        await MalvinAntiLink(cleanVar0095, cleanVar0004, getGroupMetadata);
        await MalvinAntibad(cleanVar0095, cleanVar0004, getGroupMetadata);
      }
      await MalvinAntiGroupMention(cleanVar0095, cleanVar0004, getGroupMetadata);
      await handleGameMessage(cleanVar0095, cleanVar0004);
    }
  });
}
function setupAntiEdit(cleanVar0142) {
  cleanVar0142.ev.on("messages.update", async cleanVar0214 => {
    for (const cleanVar0177 of cleanVar0214) {
      try {
        if (!cleanVar0177?.update?.message) {
          continue;
        }
        if (cleanVar0177.key?.fromMe) {
          continue;
        }
        if (cleanVar0177.key?.remoteJid === "status@broadcast") {
          continue;
        }
        await MalvinAntiEdit(cleanVar0142, cleanVar0177, findAntiDelete);
      } catch (cleanVar0230) {
        console.error("Anti-edit handler error:", cleanVar0230.message);
      }
    }
  });
}
function setupStatusHandlers(cleanVar0116) {
  cleanVar0116.ev.on("messages.upsert", async cleanVar0105 => {
    try {
      cleanVar0105 = cleanVar0105.messages[0];
      if (!cleanVar0105 || !cleanVar0105.message) {
        return;
      }
      cleanVar0105.message = getContentType(cleanVar0105.message) === "ephemeralMessage" ? cleanVar0105.message.ephemeralMessage.message : cleanVar0105.message;
      if (cleanVar0105.key?.remoteJid !== "status@broadcast") {
        return;
      }
      const cleanVar0067 = await getAllSettings();
      const cleanVar0166 = cleanVar0105.participant || cleanVar0105.key.participantPn || cleanVar0105.key.participant;
      const cleanVar0029 = await resolveRealJid(cleanVar0116, cleanVar0166);
      const cleanVar0232 = cleanVar0067.AUTO_READ_STATUS === "true";
      const cleanVar0242 = cleanVar0029 && cleanVar0029 !== cleanVar0105.key.participant ? {
        ...cleanVar0105.key,
        participant: cleanVar0029
      } : cleanVar0105.key;
      if (cleanVar0232) {
        await cleanVar0116.readMessages([cleanVar0242]);
      }
      if (cleanVar0232 && cleanVar0067.AUTO_LIKE_STATUS === "true" && cleanVar0029) {
        const cleanVar0163 = (cleanVar0067.STATUS_LIKE_EMOJIS || "💛,❤️,💞,🤍,💙").split(",").map(cleanVar0025 => cleanVar0025.trim()).filter(Boolean);
        const cleanVar0002 = cleanVar0163[Math.floor(Math.random() * cleanVar0163.length)];
        const cleanVar0210 = {
          ...cleanVar0105.key
        };
        cleanVar0210.participant = cleanVar0029;
        const cleanVar0184 = cleanVar0210;
        const cleanVar0060 = {
          text: cleanVar0002,
          key: cleanVar0184
        };
        const cleanVar0041 = {
          react: cleanVar0060
        };
        const cleanVar0140 = {
          statusJidList: [cleanVar0029]
        };
        await cleanVar0116.sendMessage("status@broadcast", cleanVar0041, cleanVar0140);
      }
      if (cleanVar0232 && cleanVar0067.AUTO_REPLY_STATUS === "true" && !cleanVar0105.key.fromMe && cleanVar0029) {
        const cleanVar0022 = {
          text: cleanVar0067.STATUS_REPLY_TEXT || DEFAULT_SETTINGS.STATUS_REPLY_TEXT
        };
        const cleanVar0174 = {
          quoted: cleanVar0105
        };
        await cleanVar0116.sendMessage(cleanVar0029, cleanVar0022, cleanVar0174);
      }
    } catch (cleanVar0236) {
      const cleanVar0023 = cleanVar0236?.output?.statusCode || cleanVar0236?.code || "";
      const cleanVar0143 = cleanVar0236?.message || "";
      const cleanVar0131 = cleanVar0023 === 428 || cleanVar0143 === "Connection Closed" || cleanVar0143.includes("ECONNRESET") || cleanVar0143.includes("ETIMEDOUT") || cleanVar0143.includes("ECONNREFUSED") || cleanVar0143.includes("EPIPE") || cleanVar0143.includes("Connection Terminated") || cleanVar0143.includes("Stream Errored") || String(cleanVar0023) === "ECONNRESET" || String(cleanVar0023) === "EPIPE";
      if (cleanVar0131) {
        return;
      }
      console.error("Error Processing Status Actions:", cleanVar0236);
    }
  });
}
const processedMessages = new Set();
const BOT_START_TIME = Date.now();
function setupCommandHandler(cleanVar0141) {
  cleanVar0141.ev.on("messages.upsert", async ({
    messages: cleanVar0228,
    type: cleanVar0162
  }) => {
    if (cleanVar0162 === "append") {
      return;
    }
    const cleanVar0165 = cleanVar0228[0];
    if (!cleanVar0165?.message || !cleanVar0165?.key) {
      return;
    }
    const cleanVar0237 = cleanVar0165.key.id;
    if (processedMessages.has(cleanVar0237)) {
      return;
    }
    processedMessages.add(cleanVar0237);
    setTimeout(() => processedMessages.delete(cleanVar0237), 60000);
    const cleanVar0083 = (cleanVar0165.messageTimestamp?.low || cleanVar0165.messageTimestamp) * 1000;
    if (cleanVar0083 && cleanVar0083 < BOT_START_TIME - 5000) {
      return;
    }
    const cleanVar0087 = await getAllSettings();
    const cleanVar0103 = standardizeJid(cleanVar0141.user?.id);
    const cleanVar0222 = await serializeMessage(cleanVar0165, cleanVar0141, cleanVar0087);
    if (!cleanVar0222) {
      return;
    }
    const {
      from: cleanVar0109,
      isGroup: cleanVar0130,
      body: cleanVar0006,
      isCommand: cleanVar0227,
      command: cleanVar0156,
      args: cleanVar0135,
      sender: cleanVar0241,
      messageAuthor: cleanVar0045,
      user: cleanVar0111,
      pushName: cleanVar0128,
      quoted: cleanVar0144,
      repliedMessage: cleanVar0169,
      mentionedJid: cleanVar0055,
      tagged: cleanVar0008,
      quotedMsg: cleanVar0003,
      quotedKey: cleanVar0100,
      quotedUser: cleanVar0136
    } = cleanVar0222;
    if (cleanVar0227 && !cleanVar0156 && typeof cleanVar0006 === "string" && cleanVar0006.trim() === cleanVar0222.prefix) {
      const prefixLabel = cleanVar0222.prefix || cleanVar0087.PREFIX || "/";
      const displayName = String(cleanVar0128 || "amigo").replace(/[\r\n]/g, " ").slice(0, 32);
      const prefixHelp = [
        "╭─❖ 🧊🔥 ❖─╮",
        "│ 🤖 *SOUSINHA BOT PREMIUM*",
        "│",
        `│ 👋 Olá, ${displayName}!`,
        "│",
        `│ ✅ Meu prefixo atual é: *${prefixLabel}*`,
        "│ 📚 Digite o prefixo + *menu* para ver os comandos.",
        `│ ⚡ Exemplo: *${prefixLabel}ping*`,
        "╰────────────╯",
      ].join("\n");
      await cleanVar0141.sendMessage(cleanVar0109, { text: prefixHelp }, { quoted: cleanVar0165 });
      return;
    }
    const cleanVar0059 = await getGroupInfo(cleanVar0141, cleanVar0109, cleanVar0103, cleanVar0241);
    const {
      groupInfo: cleanVar0121,
      groupName: cleanVar0038,
      participants: cleanVar0119,
      groupAdmins: cleanVar0124,
      groupSuperAdmins: cleanVar0017,
      isBotAdmin: cleanVar0092,
      isAdmin: cleanVar0171,
      isSuperAdmin: cleanVar0044,
      sender: cleanVar0028
    } = cleanVar0059;
    const cleanVar0187 = await buildSuperUsers(cleanVar0087, getSudoNumbers, cleanVar0103, cleanVar0087.OWNER_NUMBER || "");
    const ownerDigits = String(cleanVar0087.OWNER_NUMBER || "5563999215379").replace(/\D/g, "");
    const senderDigits = String(cleanVar0028 || cleanVar0241 || cleanVar0045 || "").split("@")[0].split(":")[0].replace(/\D/g, "");
    const ownerDigitsMatch = senderDigits && ownerDigits && (senderDigits === ownerDigits || senderDigits.endsWith(ownerDigits) || ownerDigits.endsWith(senderDigits));
    const cleanVar0127 = cleanVar0187.includes(cleanVar0028) || ownerDigitsMatch;
    if (cleanVar0087.AUTO_BLOCK && cleanVar0028 && !cleanVar0127 && !cleanVar0130) {
      const cleanVar0244 = cleanVar0087.AUTO_BLOCK.split(",").map(cleanVar0001 => cleanVar0001.trim());
      if (cleanVar0244.some(cleanVar0070 => cleanVar0028.startsWith(cleanVar0070))) {
        try {
          await cleanVar0141.updateBlockStatus(cleanVar0028, "block");
        } catch (cleanVar0026) {
          console.error("Block error:", cleanVar0026);
        }
      }
    }
    const cleanVar0204 = cleanVar0087.AUTO_READ_MESSAGES || "off";
    let cleanVar0040 = false;
    if (cleanVar0204 === "all" || cleanVar0204 === "true") {
      cleanVar0040 = true;
    } else if (cleanVar0204 === "dm" && !cleanVar0130) {
      cleanVar0040 = true;
    } else if (cleanVar0204 === "groups" && cleanVar0130) {
      cleanVar0040 = true;
    } else if (cleanVar0204 === "commands" && cleanVar0227) {
      cleanVar0040 = true;
    }
    if (cleanVar0040) {
      await cleanVar0141.readMessages([cleanVar0165.key]);
    }
    const cleanVar0175 = findBodyCommand(cleanVar0006);
    if (cleanVar0175 && cleanVar0175.function) {
      if (!cleanVar0130) {
        await cleanVar0141.sendMessage(cleanVar0109, { text: cleanVar0087.OWNER_NUMBER || "5563999215379" }, { quoted: cleanVar0165 });
        return;
      }
      if (cleanVar0087.MODE?.toLowerCase() === "private" && !cleanVar0127) {
        return;
      }
      try {
        const cleanVar0010 = createHelpers(cleanVar0141, cleanVar0165, cleanVar0109);
        const cleanVar0209 = {
          userJid: cleanVar0028,
          groupJid: cleanVar0130 ? cleanVar0109 : null,
          getUserSetting: getUserSetting,
          getGroupSetting: getGroupSetting
        };
        const cleanVar0226 = await resolveLanguage(cleanVar0209);
        const cleanVar0161 = makeTranslator(cleanVar0226);
        const cleanVar0155 = {
          t: cleanVar0161,
          lang: cleanVar0226,
          from: cleanVar0109,
          isGroup: cleanVar0130,
          groupInfo: cleanVar0121,
          groupName: cleanVar0038,
          participants: cleanVar0119,
          groupAdmins: cleanVar0124,
          groupSuperAdmins: cleanVar0017,
          isBotAdmin: cleanVar0092,
          isAdmin: cleanVar0171,
          isSuperAdmin: cleanVar0044,
          sender: cleanVar0028,
          superUser: cleanVar0187,
          isSuperUser: cleanVar0127,
          messageAuthor: cleanVar0045,
          user: cleanVar0111,
          pushName: cleanVar0128,
          args: cleanVar0135,
          quoted: cleanVar0144,
          repliedMessage: cleanVar0169,
          mentionedJid: cleanVar0055,
          tagged: cleanVar0008,
          quotedMsg: cleanVar0003,
          quotedKey: cleanVar0100,
          quotedUser: cleanVar0136,
          Malvin: cleanVar0141,
          botId: cleanVar0103,
          body: cleanVar0006,
          command: cleanVar0156
        };
        const cleanVar0193 = buildContext(cleanVar0165, cleanVar0087, cleanVar0010, cleanVar0155);
        await cleanVar0175.function(cleanVar0109, cleanVar0141, cleanVar0193);
      } catch (cleanVar0068) {
        console.error("Body command error:", cleanVar0068);
      }
    }
    if (cleanVar0227 && cleanVar0156) {
      const cleanVar0097 = findCommand(cleanVar0156);
      if (!cleanVar0097) {
        return;
      }
      if (!cleanVar0130) {
        await cleanVar0141.sendMessage(cleanVar0109, { text: cleanVar0087.OWNER_NUMBER || "5563999215379" }, { quoted: cleanVar0165 });
        return;
      }
      const ownerAuthorized = isOwnerAuthorized({
        sender: cleanVar0028,
        authorMessage: cleanVar0045,
        messageAuthor: cleanVar0045,
        user: cleanVar0111,
        mek: cleanVar0165,
        groupInfo: cleanVar0121,
        participants: cleanVar0119,
        isSuperUser: cleanVar0127,
      }, { allowSuperUser: true });
      if (["owner", "origin"].includes(cleanVar0097.category) && !ownerAuthorized) {
        await cleanVar0141.sendMessage(cleanVar0109, { text: "❌ Comando exclusivo do dono.\nContato oficial: " + (cleanVar0087.OWNER_NUMBER || "5563999215379") }, { quoted: cleanVar0165 });
        return;
      }
      const rentalControlCommands = ["ativarbot", "desativarbot", "alugar", "statusaluguel", "listaalugueis", "aluguéis", "alugueis", "gruposativos", "gruposalugados", "gruposcomaluguel", "alugueisativos", "aluguelativo", "renovaraluguel", "estenderaluguel", "renovargrupo", "estendergrupo", "ativargrupo", "desativargrupo", "botativar", "botdesativar", "cadastraraluguel", "aluguels", "statusgrupo"];
      if (!rentalControlCommands.includes(cleanVar0156)) {
        const rentalEnabled = await getGroupSetting(cleanVar0109, "BOT_ENABLED");
        const rentalStart = await getGroupSetting(cleanVar0109, "RENT_START");
        const rentalEnd = await getGroupSetting(cleanVar0109, "RENT_END");
        const now = Date.now();
        const rentalIsValid = rentalStart && rentalEnd && now >= new Date(rentalStart).getTime() && now <= new Date(rentalEnd).getTime();
        if (rentalEnabled !== "true" || !rentalIsValid) {
          await cleanVar0141.sendMessage(cleanVar0109, { text: "⏸️ Sousinha Bot está desativado neste grupo ou o aluguel venceu.\n\nO dono deve cadastrar o período e usar .ativarbot.\nDono: " + (cleanVar0087.OWNER_NUMBER || "5563999215379") }, { quoted: cleanVar0165 });
          return;
        }
      }
      if (cleanVar0087.MODE?.toLowerCase() === "private" && !cleanVar0127) {
        return;
      }
      try {
        const cleanVar0149 = createHelpers(cleanVar0141, cleanVar0165, cleanVar0109);
        if (cleanVar0087.AUTO_REACT === "commands") {
          const cleanVar0056 = emojis[Math.floor(Math.random() * emojis.length)];
          const cleanVar0062 = {
            key: cleanVar0165.key,
            text: cleanVar0056
          };
          const cleanVar0007 = {
            react: cleanVar0062
          };
          await cleanVar0141.sendMessage(cleanVar0109, cleanVar0007);
        } else if (cleanVar0097.react) {
          const cleanVar0179 = {
            key: cleanVar0165.key,
            text: cleanVar0097.react
          };
          const cleanVar0134 = {
            react: cleanVar0179
          };
          await cleanVar0141.sendMessage(cleanVar0109, cleanVar0134);
        }
        setupMalvinHelpers(cleanVar0141, cleanVar0109);
        const cleanVar0154 = {
          userJid: cleanVar0028,
          groupJid: cleanVar0130 ? cleanVar0109 : null,
          getUserSetting: getUserSetting,
          getGroupSetting: getGroupSetting
        };
        const cleanVar0211 = await resolveLanguage(cleanVar0154);
        const cleanVar0126 = makeTranslator(cleanVar0211);
        const cleanVar0061 = {
          t: cleanVar0126,
          lang: cleanVar0211,
          from: cleanVar0109,
          isGroup: cleanVar0130,
          groupInfo: cleanVar0121,
          groupName: cleanVar0038,
          participants: cleanVar0119,
          groupAdmins: cleanVar0124,
          groupSuperAdmins: cleanVar0017,
          isBotAdmin: cleanVar0092,
          isAdmin: cleanVar0171,
          isSuperAdmin: cleanVar0044,
          sender: cleanVar0028,
          superUser: cleanVar0187,
          isSuperUser: cleanVar0127,
          messageAuthor: cleanVar0045,
          user: cleanVar0111,
          pushName: cleanVar0128,
          args: cleanVar0135,
          quoted: cleanVar0144,
          repliedMessage: cleanVar0169,
          mentionedJid: cleanVar0055,
          tagged: cleanVar0008,
          quotedMsg: cleanVar0003,
          quotedKey: cleanVar0100,
          quotedUser: cleanVar0136,
          Malvin: cleanVar0141,
          botId: cleanVar0103,
          body: cleanVar0006,
          command: cleanVar0156
        };
        const cleanVar0182 = buildContext(cleanVar0165, cleanVar0087, cleanVar0149, cleanVar0061);
        try {
          await trackLastActiveChat(cleanVar0028, cleanVar0109);
        } catch (cleanVar0104) {}
        const cleanVar0076 = ["rpg", "combat", "exploration", "survival", "gathering", "economy", "progression", "gambling", "social", "origin", "world", "roles", "pet", "quests"];
        const cleanVar0110 = ["start", "register", "worldtime", "wtime", "aevoria", "roles", "rolelist", "petspecies", "allpets", "petguide", "econcheck", "econstatus"];
        const cleanVar0073 = cleanVar0076.includes(cleanVar0097.category);
        const cleanVar0085 = cleanVar0110.includes(cleanVar0156);
        if (cleanVar0073 && !cleanVar0085) {
          try {
            const {
              GlobalPlayer: cleanVar0115
            } = require("./king/rpg/model");
            const cleanVar0020 = {
              jid: cleanVar0028
            };
            const cleanVar0129 = await cleanVar0115.findOne(cleanVar0020).select("registered rpgBanned username");
            if (cleanVar0129?.rpgBanned) {
              const cleanVar0035 = {
                quoted: cleanVar0165
              };
              await cleanVar0141.sendMessage(cleanVar0109, {
                text: "🚫 You are banned from the RPG system."
              }, cleanVar0035);
              return;
            }
            if (!cleanVar0129?.registered) {
              const {
                getWorldTime: cleanVar0049
              } = require("./king/rpg/worldTime");
              const {
                buildBox: cleanVar0079
              } = require("./king/rpg/db");
              const cleanVar0071 = await cleanVar0049().catch(() => null);
              const cleanVar0065 = cleanVar0071 ? "  " + cleanVar0071.timeEmoji + " " + cleanVar0071.timeOfDay + "  " + cleanVar0071.seasonEmoji + " " + cleanVar0071.season : "  🌍 Aevoria awaits";
              const cleanVar0108 = cleanVar0071 ? "  📅 " + cleanVar0071.dayOfMonth + "th " + cleanVar0071.month + ", Year " + cleanVar0071.year + " AE" : "";
              const cleanVar0091 = {
                quoted: cleanVar0165
              };
              await cleanVar0141.sendMessage(cleanVar0109, {
                text: cleanVar0079("⚔️ WELCOME TO AEVORIA", ["  Hey *" + cleanVar0128 + "*! You're not registered yet.", "  ───────", "  To begin your journey:", "  *.start <username> <gender> <age>*", "  ───────", "  Example: *.start shadow_king male 19*", "  ───────", cleanVar0065, ...(cleanVar0108 ? [cleanVar0108] : [])])
              }, cleanVar0091);
              return;
            }
          } catch (cleanVar0024) {
            console.error("[RegCheck]", cleanVar0024.message);
          }
        }
        if (cleanVar0130) {
          const {
            checkEconomyGate: cleanVar0015,
            deductCommandCost: cleanVar0093
          } = require("./king/rpg/economyGate");
          const {
            buildBox: cleanVar0102
          } = require("./king/rpg/db");
          const cleanVar0152 = await cleanVar0015(cleanVar0109, cleanVar0028, cleanVar0156, cleanVar0097.category, cleanVar0103);
          if (!cleanVar0152.allowed) {
            const cleanVar0054 = {
              quoted: cleanVar0165
            };
            await cleanVar0141.sendMessage(cleanVar0109, {
              text: cleanVar0102("💸 INSUFFICIENT GOLD", ["  Command: *." + cleanVar0156 + "*", "  ───────", "  💰 Cost:    " + cleanVar0152.cost.toLocaleString() + " Gold", "  💔 Balance: " + cleanVar0152.balance.toLocaleString() + " Gold", "  ───────", "  Earn more: *.work* *.hunt* *.daily*"])
            }, cleanVar0054);
            return;
          }
          await cleanVar0097.function(cleanVar0109, cleanVar0141, cleanVar0182);
          await cleanVar0093(cleanVar0028, cleanVar0152.cost);
        } else {
          await cleanVar0097.function(cleanVar0109, cleanVar0141, cleanVar0182);
        }
      } catch (cleanVar0137) {
        console.error("Command error [" + cleanVar0156 + "]:", cleanVar0137);
        try {
          const cleanVar0050 = {
            quoted: cleanVar0165
          };
          const commandErrorMessage = String(cleanVar0137?.message || cleanVar0137 || "");
          const friendlyCommandError = /missing baileys internals/i.test(commandErrorMessage)
            ? "⚠️ Este recurso usa um formato de mensagem incompatível com a biblioteca atual. Tente novamente; o erro foi registrado para correção."
            : "🚨 Não foi possível executar o comando: " + commandErrorMessage;
          await cleanVar0141.sendMessage(cleanVar0109, {
            text: friendlyCommandError,
            ...(await createContext(cleanVar0045, {
              title: "Error",
              body: "Command execution failed"
            }))
          }, cleanVar0050);
        } catch (cleanVar0077) {
          console.error("Error sending error message:", cleanVar0077);
        }
      }
    }
  });
  cleanVar0141.ev.on("messages.upsert", async ({
    messages: cleanVar0012,
    type: cleanVar0021
  }) => {
    if (cleanVar0021 === "append") {
      return;
    }
    const cleanVar0123 = cleanVar0012[0];
    if (!cleanVar0123?.message || !cleanVar0123?.key) {
      return;
    }
    const cleanVar0148 = standardizeJid(cleanVar0141.user?.id);
    await handleMessageEXP(cleanVar0123, cleanVar0141, cleanVar0148);
  });
}
function setupMalvinHelpers(cleanVar0046, cleanVar0098) {
  cleanVar0046.getJidFromLid = async cleanVar0113 => {
    const cleanVar0229 = await getGroupMetadata(cleanVar0046, cleanVar0098);
    if (!cleanVar0229) {
      return null;
    }
    const cleanVar0099 = cleanVar0229.participants.find(cleanVar0215 => cleanVar0215.lid === cleanVar0113 || cleanVar0215.id === cleanVar0113);
    return cleanVar0099?.pn || cleanVar0099?.phoneNumber || null;
  };
  cleanVar0046.getLidFromJid = async cleanVar0157 => {
    const cleanVar0221 = await getGroupMetadata(cleanVar0046, cleanVar0098);
    if (!cleanVar0221) {
      return null;
    }
    const cleanVar0233 = cleanVar0221.participants.find(cleanVar0133 => cleanVar0133.jid === cleanVar0157 || cleanVar0133.pn === cleanVar0157 || cleanVar0133.phoneNumber === cleanVar0157 || cleanVar0133.id === cleanVar0157);
    return cleanVar0233?.lid || null;
  };
  let cleanVar0069;
  (async () => {
    cleanVar0069 = await import("file-type");
  })();
  cleanVar0046.downloadAndSaveMediaMessage = async (cleanVar0240, cleanVar0058, cleanVar0057 = true) => {
    try {
      let cleanVar0238 = cleanVar0240.msg ? cleanVar0240.msg : cleanVar0240;
      let cleanVar0139 = (cleanVar0240.msg || cleanVar0240).mimetype || "";
      let cleanVar0047 = cleanVar0240.mtype ? cleanVar0240.mtype.replace(/Message/gi, "") : cleanVar0139.split("/")[0];
      const cleanVar0145 = await downloadContentFromMessage(cleanVar0238, cleanVar0047);
      let cleanVar0200 = Buffer.from([]);
      for await (const cleanVar0016 of cleanVar0145) {
        cleanVar0200 = Buffer.concat([cleanVar0200, cleanVar0016]);
      }
      let cleanVar0170;
      try {
        cleanVar0170 = await cleanVar0069.fileTypeFromBuffer(cleanVar0200);
      } catch (cleanVar0112) {}
      const cleanVar0027 = cleanVar0170?.ext || cleanVar0139.split("/")[1] || (cleanVar0047 === "image" ? "jpg" : cleanVar0047 === "video" ? "mp4" : cleanVar0047 === "audio" ? "mp3" : "bin");
      const cleanVar0195 = cleanVar0057 ? cleanVar0058 + "." + cleanVar0027 : cleanVar0058;
      await fs.writeFile(cleanVar0195, cleanVar0200);
      return cleanVar0195;
    } catch (cleanVar0036) {
      console.error("Error in downloadAndSaveMediaMessage:", cleanVar0036);
      throw cleanVar0036;
    }
  };
}
function buildContext(cleanVar0043, cleanVar0090, cleanVar0078, cleanVar0101) {
  return {
    m: cleanVar0043,
    mek: cleanVar0043,
    t: cleanVar0101.t,
    lang: cleanVar0101.lang,
    body: cleanVar0101.body || "",
    edit: cleanVar0078.edit,
    react: cleanVar0078.react,
    del: cleanVar0078.del,
    args: cleanVar0101.args,
    arg: cleanVar0101.args,
    quoted: cleanVar0101.quoted,
    isCmd: cleanVar0101.isCommand !== undefined ? cleanVar0101.isCommand : true,
    command: cleanVar0101.command || "",
    isAdmin: cleanVar0101.isAdmin,
    isBotAdmin: cleanVar0101.isBotAdmin,
    sender: cleanVar0101.sender,
    pushName: cleanVar0101.pushName,
    setSudo: setSudo,
    delSudo: delSudo,
    q: cleanVar0101.args.join(" "),
    reply: cleanVar0078.reply,
    config: config,
    superUser: cleanVar0101.superUser,
    tagged: cleanVar0101.tagged,
    mentionedJid: cleanVar0101.mentionedJid,
    isGroup: cleanVar0101.isGroup,
    groupInfo: cleanVar0101.groupInfo,
    groupName: cleanVar0101.groupName,
    getSudoNumbers: getSudoNumbers,
    authorMessage: cleanVar0101.messageAuthor,
    user: cleanVar0101.user || "",
    mxdBuffer: mxdBuffer,
    mxdJson: mxdJson,
    formatAudio: formatAudio,
    formatVideo: formatVideo,
    toAudio: toAudio,
    groupMember: cleanVar0101.isGroup ? cleanVar0101.messageAuthor : "",
    from: cleanVar0101.from,
    groupAdmins: cleanVar0101.groupAdmins,
    participants: cleanVar0101.participants,
    repliedMessage: cleanVar0101.repliedMessage,
    quotedMsg: cleanVar0101.quotedMsg,
    quotedKey: cleanVar0101.quotedKey,
    quotedUser: cleanVar0101.quotedUser,
    isSuperUser: cleanVar0101.isSuperUser,
    botMode: cleanVar0090.MODE,
    botPic: cleanVar0090.BOT_PIC,
    botFooter: cleanVar0090.FOOTER,
    botCaption: cleanVar0090.CAPTION,
    botVersion: cleanVar0090.VERSION,
    ownerNumber: cleanVar0090.OWNER_NUMBER,
    ownerName: cleanVar0090.OWNER_NAME,
    botName: cleanVar0090.BOT_NAME,
    malvinRepo: cleanVar0090.BOT_REPO,
    packName: cleanVar0090.PACK_NAME,
    packAuthor: cleanVar0090.PACK_AUTHOR,
    isSuperAdmin: cleanVar0101.isSuperAdmin,
    getMediaBuffer: getMediaBuffer,
    getFileContentType: getFileContentType,
    bufferToStream: bufferToStream,
    uploadToPixhost: uploadToPixhost,
    uploadToImgBB: uploadToImgBB,
    setCommitHash: setCommitHash,
    getCommitHash: getCommitHash,
    uploadToCatbox: uploadToCatbox,
    newsletterUrl: cleanVar0090.NEWSLETTER_URL,
    newsletterJid: cleanVar0090.NEWSLETTER_JID,
    MalvinTechApi: MalvinTechApi,
    MalvinApiKey: MalvinApiKey,
    botPrefix: cleanVar0090.PREFIX,
    timeZone: cleanVar0090.TIME_ZONE
  };
}
(async () => {
  if (process.env.USE_REMOTE_SESSION === "true") {
    try {
      await loadSession();
    } catch (error) {
      if (/SESSION_ID/i.test(error?.message || "")) {
        console.warn("⚠️ SESSION_ID ausente ou inválido; continuando em modo local para gerar o QR Code.");
      } else {
        throw error;
      }
    }
  } else {
    console.log("📱 Modo local ativado: a autenticação será feita por QR Code.");
  }
  try {
    await loadBotSettings();
  } catch (error) {
    console.error("[BOOT] Configuração do banco falhou; iniciando WhatsApp sem sincronização do banco:", safeErrorText(error));
  }
  await startMalvin();
})();
