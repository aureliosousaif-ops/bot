const fs = require("fs-extra");
if (fs.existsSync(".env"))
    require("dotenv").config({ path: __dirname + "/.env", quiet: true });

module.exports = {
    MODE: process.env.MODE,
    OWNER_NAME: process.env.OWNER_NAME,
    OWNER_NUMBER: process.env.OWNER_NUMBER || "5563999215379",
    SUDO_NUMBERS: process.env.SUDO_NUMBERS,
    SESSION_ID: process.env.SESSION_ID,
    USE_PAIRING_CODE: process.env.USE_PAIRING_CODE === "true",
    PAIRING_NUMBER: process.env.PAIRING_NUMBER || "5563999215379",
    FORCE_PAIRING_CODE: process.env.FORCE_PAIRING_CODE === "true",
    PAIRING_HTTP_TOKEN: process.env.PAIRING_HTTP_TOKEN,
    PUBLIC_QR: process.env.PUBLIC_QR === "true",
    TIME_ZONE: process.env.TIME_ZONE,
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS,
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS,
    DATABASE_URL: process.env.DATABASE_URL, // Postress(Get one for free from neon.tech/supabase/render/heroku builtin postgress)...will fallback to path: ./king/database/database.db if not provided
    SQLITE_PATH: process.env.SQLITE_PATH,
    // Render Free não preserva o filesystem entre reinícios. Quando houver
    // DATABASE_URL, a sessão deve ficar no PostgreSQL, não em session.db.
    WHATSAPP_AUTH_STORAGE: process.env.WHATSAPP_AUTH_STORAGE || (process.env.WHATSAPP_AUTH_DATABASE_URL || process.env.DATABASE_URL ? "postgres" : "sqlite"),
    WHATSAPP_AUTH_DATABASE_URL: process.env.WHATSAPP_AUTH_DATABASE_URL || process.env.DATABASE_URL,
    WHATSAPP_AUTH_SESSION_ID: process.env.WHATSAPP_AUTH_SESSION_ID || "sousinha-bot",
    // A sessão principal é o padrão; a recuperação só é usada após device_removed
    // ou quando WHATSAPP_AUTH_RECOVERY=true for configurado explicitamente.
    WHATSAPP_AUTH_RECOVERY: process.env.WHATSAPP_AUTH_RECOVERY === "true",
    WHATSAPP_AUTH_RECOVERY_SESSION_ID: process.env.WHATSAPP_AUTH_RECOVERY_SESSION_ID || "",
    MALVIN_API_KEY: process.env.MALVIN_API_KEY, // Get your free key at https://api.malvintech.co.zw (sign up, key is on your dashboard)
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    GEMINI_AUTO_REPLY: process.env.GEMINI_AUTO_REPLY !== "false",
    GEMINI_GROUPS_ONLY: process.env.GEMINI_GROUPS_ONLY !== "false",
    ENABLE_RPG: process.env.ENABLE_RPG === "true",
};

if (process.env.WATCH_CONFIG === "true") {
    const fileName = require.resolve(__filename);
    fs.watchFile(fileName, { interval: 5000 }, () => {
        fs.unwatchFile(fileName);
        console.log(`Writing File: ${__filename}`);
        delete require.cache[fileName];
        require(fileName);
    });
}
