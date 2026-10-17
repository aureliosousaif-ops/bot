const pino = require('pino');
const NodeCache = require('node-cache');
const { makeCacheableSignalKeyStore } = require('mrxd-baileys');
const { cachedGroupMetadata } = require('./groupStore');

const _userDevicesCache = new NodeCache({ stdTTL: 1800, useClones: false });

const createSocketConfig = (version, state, logger) => {
    const pairingNeedsInitQueries = !state?.creds?.me?.id || state?.creds?.registered !== true;
    return {
        version,
        // O logger info do Baileys serializa histórico e payloads criptográficos; em Render
        // isso aumenta o heap e pode expor dados sensíveis. Os diagnósticos sanitizados
        // da aplicação continuam ativos em index.js.
        logger: pino({ level: process.env.DEBUG_WHATSAPP === 'true' ? 'warn' : 'silent' }),
        // Perfil oficial recomendado pelo Baileys para Ubuntu/Chrome.
        browser: ['Ubuntu', 'Chrome', '22.04.4'],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        cachedGroupMetadata,
        userDevicesCache: _userDevicesCache,
        connectTimeoutMs: 15000,
        defaultQueryTimeoutMs: 20000,
        keepAliveIntervalMs: 20000,
        // Mantém a validade dos QR subsequentes alinhada ao endpoint /qr.
        // Sem esta opção, o Baileys reduz os QR seguintes para 20s enquanto a
        // página ainda os apresenta como válidos por até 60s.
        qrTimeout: 60000,
        // A versão funcional usava init queries durante o pareamento. Depois
        // que a sessão está autenticada, mantemos false para evitar OOM no Render.
        fireInitQueries: pairingNeedsInitQueries,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        retryRequestDelayMs: 50,
        maxMsgRetryCount: 2,
        generateHighQualityLinkPreview: false,
        getMessage: async () => undefined,
        emitOwnEvents: true,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        }
    };
};

module.exports = { createSocketConfig };
