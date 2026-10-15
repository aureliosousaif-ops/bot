const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "..", "node_modules", "mrxd-baileys", "lib", "Socket", "socket.js");
if (!fs.existsSync(target)) {
  console.log("[PAIRING-PATCH] mrxd-baileys ainda não está instalado; nada a aplicar.");
  process.exit(0);
}

let source = fs.readFileSync(target, "utf8");
if (source.includes("[SOUSINHA_PAIRING_PATCH_V1]")) {
  console.log("[PAIRING-PATCH] Correção já aplicada.");
  process.exit(0);
}

const marker = "    let qrTimer;\n    let closed = false;";
const replacement = "    let qrTimer;\n    // [SOUSINHA_PAIRING_PATCH_V1] Mantém o relógio alinhado para a sessão unificada pós-pareamento.\n    let serverTimeOffsetMs = 0;\n    let closed = false;";
if (!source.includes(marker)) {
  throw new Error("[PAIRING-PATCH] Ponto de inserção do estado de tempo não encontrado.");
}
source = source.replace(marker, replacement);

const helperMarker = "    // device paired for the first time\n";
const helper = "    // [SOUSINHA_PAIRING_PATCH_V1] Equivalente às correções atuais do Baileys após pair-success.\n    const updateServerTimeOffset = ({ attrs }) => {\n        const parsed = Number(attrs === null || attrs === void 0 ? void 0 : attrs.t);\n        if (Number.isFinite(parsed) && parsed > 0) {\n            serverTimeOffsetMs = parsed * 1000 - Date.now();\n        }\n    };\n    const sendUnifiedSession = async () => {\n        if (!ws.isOpen) return;\n        const unifiedId = ((Date.now() + serverTimeOffsetMs + 3 * 24 * 60 * 60 * 1000) % (7 * 24 * 60 * 60 * 1000)).toString();\n        try {\n            await sendNode({ tag: 'ib', attrs: {}, content: [{ tag: 'unified_session', attrs: { id: unifiedId } }] });\n        } catch (error) {\n            logger.debug({ error }, 'failed to send unified_session telemetry');\n        }\n    };\n\n" + helperMarker;
if (!source.includes(helperMarker)) {
  throw new Error("[PAIRING-PATCH] Ponto de inserção do pair-success não encontrado.");
}
source = source.replace(helperMarker, helper);

const pairStart = "        try {\n            const { reply, creds: updatedCreds } =";
if (!source.includes(pairStart)) {
  throw new Error("[PAIRING-PATCH] Corpo do pair-success não encontrado.");
}
source = source.replace(pairStart, "        try {\n            updateServerTimeOffset(stanza);\n            const { reply, creds: updatedCreds } =");

const pairEnd = "            await sendNode(reply);\n        }\n        catch (error) {";
if (!source.includes(pairEnd)) {
  throw new Error("[PAIRING-PATCH] Final do pair-success não encontrado.");
}
source = source.replace(pairEnd, "            await sendNode(reply);\n            await sendUnifiedSession();\n        }\n        catch (error) {");

const successStart = "    ws.on('CB:success', async (node) => {\n        await uploadPreKeysToServerIfRequired();";
if (!source.includes(successStart)) {
  throw new Error("[PAIRING-PATCH] Evento CB:success não encontrado.");
}
source = source.replace(successStart, "    ws.on('CB:success', async (node) => {\n        updateServerTimeOffset(node);\n        await uploadPreKeysToServerIfRequired();");

fs.writeFileSync(target, source, "utf8");
console.log("[PAIRING-PATCH] Correção de finalização do pareamento aplicada ao mrxd-baileys@1.0.2.");
