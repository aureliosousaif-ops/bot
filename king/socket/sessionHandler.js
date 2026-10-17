const { Boom } = require("@hapi/boom");
const { DisconnectReason } = require("mrxd-baileys");
const fs = require("fs-extra");
const path = require("path");
const { setupGroupCacheListeners } = require("./groupStore");
const qrcode = require("qrcode-terminal");

const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 8;

let reconnectAttempts = 0;
let reconnectTimer = null;

const safeNewsletterFollow = async (Malvin, newsletterJid) => {
    if (!newsletterJid) return false;
    try {
        await Malvin.newsletterFollow(newsletterJid);
        // console.log(`✅ Followed Channel: ${newsletterJid}`);
        return true;
    } catch (error) {
        console.error(
            `❌ Channel follow failed for ${newsletterJid}:`,
            error.message,
        );
        return false;
    }
};

const safeGroupAcceptInvite = async (Malvin, groupJid) => {
    if (!groupJid) return false;
    try {
        await Malvin.groupAcceptInvite(groupJid);
        // console.log(`✅ Joined group: ${groupJid}`);
        return true;
    } catch (error) {
        switch (error.data) {
            case 409:
                console.log(`ℹ️ Already in group: ${groupJid}`);
                break;
            case 400:
                console.log(`⚠️ Invalid invite code for group: ${groupJid}`);
                break;
            case 403:
                console.log(`⚠️ No permission to join group: ${groupJid}`);
                break;
            default:
                console.error(
                    `❌ Group join failed for ${groupJid}:`,
                    error.message,
                );
        }
        return false;
    }
};

const setupConnectionHandler = (
    Malvin,
    sessionDir,
    startMalvin,
    callbacks = {},
) => {
    setupGroupCacheListeners(Malvin);

    Malvin.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr, isNewLogin } = update;

        if (qr) {
            console.log("\n📱 Escaneie este QR Code no WhatsApp > Aparelhos conectados:\n");
            qrcode.generate(qr, { small: true });
            console.log("\nO QR Code expira rapidamente; se necessário, aguarde o próximo.\n");
        }

        if (isNewLogin) {
            console.log("✅ [PAIRING] WhatsApp aceitou o vínculo; aguardando reinicialização controlada.");
        }

        if (connection === "connecting") {
            console.log("🕗 Connecting Bot...");
        }

        if (connection === "open") {
            const startupOpenedAt = Date.now();
            console.log("[STARTUP] Evento connection.update recebido: open");
            console.log("✅ Connection Instance is Online");
            reconnectAttempts = 0;
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }

            if (callbacks.onOpen) {
                console.log("[STARTUP] Inicialização da aplicação iniciada");
                await callbacks.onOpen(Malvin);
                console.log(`[STARTUP] Inicialização da aplicação concluída em ${Date.now() - startupOpenedAt}ms`);
            }
        }

        if (connection === "close") {
            const disconnectError = lastDisconnect?.error;
            const reason = new Boom(disconnectError)?.output?.statusCode;
            const reasonText = disconnectError?.message || "sem mensagem";
            const serverReason = disconnectError?.data?.reason || disconnectError?.data?.status || "não informado";
            console.log(`Connection closed due to: ${reason}; mensagem=${reasonText}; motivoServidor=${serverReason}`);

            if (callbacks.onClose) {
                try {
                    await callbacks.onClose(Malvin, reason);
                } catch (error) {
                    console.error("[WA-DIAG] Falha ao limpar socket encerrado:", error.message);
                }
            }
            if (callbacks.suppressReconnect?.()) {
                console.log("[WA-DIAG] Reconexão padrão suprimida; fallback bruto 515 já iniciou o reinício.");
                return;
            }
            Malvin.ev?.removeAllListeners?.();

            let disconnectPayload = "";
            try {
                disconnectPayload = JSON.stringify(disconnectError);
            } catch (_) {}
            const disconnectMarker = [
                disconnectError?.data?.reason,
                disconnectError?.data?.status,
                disconnectError?.data?.type,
                reasonText,
                disconnectPayload,
            ].filter(Boolean).join(" ").toLowerCase();
            if (disconnectMarker.includes("device_removed") || disconnectMarker.includes("device removed")) {
                console.error("Sessão rejeitada pelo WhatsApp como dispositivo removido; reconexão com as mesmas credenciais interrompida.");
                if (callbacks.onDeviceRemoved) {
                    await callbacks.onDeviceRemoved();
                }
                return;
            }

            const handleReconnect = () => {
                if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                    const cooldown = 600000;
                    console.error(`Limite de reconexões atingido; o servidor continuará vivo e tentará novamente em ${cooldown}ms.`);
                    if (!reconnectTimer) {
                        reconnectTimer = setTimeout(() => {
                            reconnectAttempts = 0;
                            reconnectTimer = null;
                            startMalvin().catch((error) => console.error("❌ Falha ao reiniciar o socket após cooldown:", error.message));
                        }, cooldown);
                    }
                    return;
                }
                reconnectAttempts++;
                const delay = Math.min(
                    RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1),
                    300000,
                );
                console.log(
                    `🕗 Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms...`,
                );
                if (reconnectTimer) return;
                reconnectTimer = setTimeout(() => {
                    reconnectTimer = null;
                    startMalvin().catch((error) => console.error("❌ Falha ao reiniciar o socket:", error));
                }, delay);
            };

            switch (reason) {
                case DisconnectReason.badSession:
                    console.error("Sessão rejeitada pelo WhatsApp; ela não será apagada automaticamente. Corrija ou remova manualmente somente após análise.");
                    break;

                case DisconnectReason.connectionReplaced:
                    console.log("Outra sessão assumiu o WhatsApp; o servidor HTTP continuará vivo sem abrir sockets concorrentes.");
                    return;

                case DisconnectReason.loggedOut:
                    console.error("Dispositivo desconectado pelo WhatsApp; sessão preservada e reconexão automática interrompida.");
                    break;

                case DisconnectReason.connectionClosed:
                case DisconnectReason.connectionLost:
                case DisconnectReason.restartRequired:
                    if (reason === DisconnectReason.restartRequired) {
                        console.log("🔁 restartRequired (515): possível pareamento concluído; reconectando sem apagar a sessão.");
                    }
                    console.log("🕗 Reconnecting...");
                    handleReconnect();
                    break;

                case DisconnectReason.timedOut:
                    console.log("Connection timed out, reconnecting...");
                    handleReconnect();
                    break;

                default:
                    console.log(
                        `Unknown disconnect reason: ${reason}, attempting reconnection...`,
                    );
                    handleReconnect();
            }
        }
    });
};

module.exports = {
    safeNewsletterFollow,
    safeGroupAcceptInvite,
    setupConnectionHandler,
    RECONNECT_DELAY,
    MAX_RECONNECT_ATTEMPTS,
};
