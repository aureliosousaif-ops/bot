const mongoose = require("mongoose");
let _connected = false;
async function connectRPG() {
  if (_connected) {
    return;
  }
  const _0xd725c7 = process.env.MONGO_URI || process.env.MONGODB_URI || "";
  if (!_0xd725c7) {
    console.warn("[RPG] ⚠️  MONGO_URI not set — RPG system disabled.");
    return;
  }
  try {
    await mongoose.connect(_0xd725c7, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    _connected = true;
    console.log("[RPG] ✅ MongoDB connected — Sovereign RPG active.");
  } catch (_0x5bff32) {
    console.error("[RPG] ❌ MongoDB connection failed:", _0x5bff32.message);
  }
}
function isRPGConnected() {
  return _connected;
}
module.exports = {
  connectRPG: connectRPG,
  isRPGConnected: isRPGConnected,
  ...require("./model"),
  ...require("./leveling"),
  ...require("./ranks"),
  ...require("./rpgEngine"),
  ...require("./db")
};
