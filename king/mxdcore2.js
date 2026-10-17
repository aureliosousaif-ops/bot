const fs = require("fs-extra");
const axios = require("axios");
const config = require("../config");
const path = require("path");
const {
  pipeline
} = require("stream/promises");
const {
  createContext
} = require("./mxdhelpers");
const {
  getSetting,
  getAllSettings
} = require("./database/settings");
const logger = require("mrxd-baileys/lib/Utils/logger").default.child({});
const {
  isJidGroup,
  downloadMediaMessage
} = require("mrxd-baileys");
const {
  fancy
} = require("./fancyFont");
const formatTime = (_0xa6a9ee, _0x32e191 = "Africa/Harare") => {
  const _0x2c2680 = new Date(_0xa6a9ee);
  const _0x56628b = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: _0x32e191
  };
  const _0x1a75d8 = _0x56628b;
  return new Intl.DateTimeFormat("en-US", _0x1a75d8).format(_0x2c2680);
};
const formatDate = (_0x25baa5, _0x2a42a5 = "Africa/Harare") => {
  const _0x2f1b74 = new Date(_0x25baa5);
  const _0x20c91b = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: _0x2a42a5
  };
  const _0x1d1472 = _0x20c91b;
  return new Intl.DateTimeFormat("en-GB", _0x1d1472).format(_0x2f1b74);
};
const isMediaMessage = _0x35a3b1 => {
  const _0x2d6b03 = getContentType(_0x35a3b1);
  const _0x2c941c = ["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"];
  return _0x2c941c.includes(_0x2d6b03);
};
const isAnyLink = _0x32a99c => {
  if (!_0x32a99c || typeof _0x32a99c !== "string") {
    return false;
  }
  if (/https?:\/\/[^\s]+/i.test(_0x32a99c)) {
    return true;
  }
  if (/(?:^|\s)www\.[a-z0-9-]+\.[a-z]{2,}[^\s]*/i.test(_0x32a99c)) {
    return true;
  }
  if (/(?:^|\s)(?:chat\.whatsapp\.com|wa\.me|t\.me|youtu\.be|bit\.ly|tinyurl\.com|goo\.gl)\/[^\s]*/i.test(_0x32a99c)) {
    return true;
  }
  return false;
};
const emojis = ["💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "❤️‍", "🔥", "❤️‍", "🩹", "💯", "♨️", "💢", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤", "🌐", "♠️", "♥️", "♦️", "♣️", "🃏", "🀄️", "🎴", "🎭️", "🔇", "🔈️", "🔉", "🔊", "🔔", "🔕", "🎼", "🎵", "🎶", "💹", "🏧", "🚮", "🚰", "♿️", "🚹️", "🚺️", "🚻", "🚼️", "🚾", "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔️", "🚫", "🚳", "🚭️", "🚯", "🚱", "🚷", "📵", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️", "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜", "🔝", "🛐", "⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "☮️", "🕎", "🔯", "♈️", "♉️", "♊️", "♋️", "♌️", "♍️", "♎️", "♏️", "♐️", "♑️", "♒️", "♓️", "⛎", "🔀", "🔁", "🔂", "▶️", "⏩️", "⏭️", "⏯️", "◀️", "⏪️", "⏮️", "🔼", "⏫", "🔽", "⏬", "⏸️", "⏹️", "⏺️", "⏏️", "🎦", "🔅", "🔆", "📶", "📳", "📴", "♀️", "♂️", "⚧", "✖️", "➕", "➖", "➗", "♾️", "‼️", "⁉️", "❓️", "❔", "❕", "❗️", "〰️", "💱", "💲", "⚕️", "♻️", "⚜️", "🔱", "📛", "🔰", "⭕️", "✅", "☑️", "✔️", "❌", "❎", "➰", "➿", "〽️", "✳️", "✴️", "❇️", "©️", "®️", "™️", "#️⃣", "*️⃣", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔠", "🔡", "🔢", "🔣", "🔤", "🅰️", "🆎", "🅱️", "🆑", "🆒", "🆓", "ℹ️", "🆔", "Ⓜ️", "🆕", "🆖", "🅾️", "🆗", "🅿️", "🆘", "🆙", "🆚", "🈁", "🈂️", "🈷️", "🈶", "🈯️", "🉐", "🈹", "🈚️", "🈲", "🉑", "🈸", "🈴", "🈳", "㊗️", "㊙️", "🈺", "🈵", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫️", "⚪️", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛️", "⬜️", "◼️", "◻️", "◾️", "◽️", "▪️", "▫️", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲", "🕛️", "🕧️", "🕐️", "🕜️", "🕑️", "🕝️", "🕒️", "🕞️", "🕓️", "🕟️", "🕔️", "🕠️", "🕕️", "🕡️", "🕖️", "🕢️", "🕗️", "🕣️", "🕘️", "🕤️", "🕙️", "🕥️", "🕚️", "🕦️", "*️", "#️", "0️", "1️", "2️", "3️", "4️", "5️", "6️", "7️", "8️", "9️", "🛎️", "🧳", "⌛️", "⏳️", "⌚️", "⏰", "⏱️", "⏲️", "🕰️", "🌡️", "🗺️", "🧭", "🎃", "🎄", "🧨", "🎈", "🎉", "🎊", "🎎", "🎏", "🎐", "🎀", "🎁", "🎗️", "🎟️", "🎫", "🔮", "🧿", "🎮️", "🕹️", "🎰", "🎲", "♟️", "🧩", "🧸", "🖼️", "🎨", "🧵", "🧶", "👓️", "🕶️", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🛍️", "🎒", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓️", "🧢", "⛑️", "📿", "💄", "💍", "💎", "📢", "📣", "📯", "🎙️", "🎚️", "🎛️", "🎤", "🎧️", "📻️", "🎷", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "📱", "📲", "☎️", "📞", "📟️", "📠", "🔋", "🔌", "💻️", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿️", "📀", "🧮", "🎥", "🎞️", "📽️", "🎬️", "📺️", "📷️", "📸", "📹️", "📼", "🔍️", "🔎", "🕯️", "💡", "🔦", "🏮", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚️", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", "💰️", "💴", "💵", "💶", "💷", "💸", "💳️", "🧾", "✉️", "💌", "📧", "🧧", "📨", "📩", "📤️", "📥️", "📦️", "📫️", "📪️", "📬️", "📭️", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋️", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒️", "🔓️", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "💣️", "🏹", "🛡️", "🔧", "🔩", "⚙️", "🗜️", "⚖️", "🦯", "🔗", "⛓️", "🧰", "🧲", "⚗️", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊", "🩹", "🩺", "🚪", "🛏️", "🛋️", "🪑", "🚽", "🚿", "🛁", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🧼", "🧽", "🧯", "🛒", "🚬", "⚰️", "⚱️", "🏺", "🕳️", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏟️", "🏛️", "🏗️", "🧱", "🏘️", "🏚️", "🏠️", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭️", "🏯", "🏰", "💒", "🗼", "🗽", "⛪️", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲️", "⛺️", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "🗾", "🏞️", "🎠", "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇️", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍️", "🚎", "🚐", "🚑️", "🚒", "🚓", "🚔️", "🚕", "🚖", "🚗", "🚘️", "🚙", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲️", "🛴", "🛹", "🚏", "🛣️", "🛤️", "🛢️", "⛽️", "🚨", "🚥", "🚦", "🛑", "🚧", "⚓️", "⛵️", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🎆", "🎇", "🎑", "🗿", "⚽️", "⚾️", "🥎", "🏀", "🏐", "🏈", "🏉", "🎾", "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳️", "⛸️", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎯", "🪀", "🪁", "🎱", "🎖️", "🏆️", "🏅", "🥇", "🥈", "🥉", "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕️", "🍵", "🍶", "🍾", "🍷", "🍸️", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧃", "🧉", "🧊", "🥢", "🍽️", "🍴", "🥄", "🔪", "🐵", "🐒", "🦍", "🦧", "🐶", "🐕️", "🦮", "🐕‍", "🦺", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈️", "🐈‍", "🦁", "🐯", "🐅", "🐆", "🐴", "🐎", "🦄", "🦓", "🦌", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦒", "🐘", "🦏", "🦛", "🐭", "🐁", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦔", "🦇", "🐻", "🐻‍", "❄️", "🐨", "🐼", "🦥", "🦦", "🦨", "🦘", "🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦️", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦩", "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", "🐋", "🐬", "🐟️", "🐠", "🐡", "🦈", "🐙", "🦑", "🦀", "🦞", "🦐", "🦪", "🐚", "🐌", "🦋", "🐛", "🐜", "🐝", "🐞", "🦗", "🕷️", "🕸️", "🦂", "🦟", "🦠", "💐", "🌸", "💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🌲", "🌳", "🌴", "🌵", "🎋", "🎍", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🌍️", "🌎️", "🌏️", "🌑", "🌒", "🌓", "🌔", "🌕️", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜️", "☀️", "🌝", "🌞", "🪐", "💫", "⭐️", "🌟", "✨", "🌠", "🌌", "☁️", "⛅️", "⛈️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌀", "🌈", "🌂", "☂️", "☔️", "⛱️", "⚡️", "❄️", "☃️", "⛄️", "☄️", "🔥", "💧", "🌊", "💥", "💦", "💨", "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐️", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "😮‍", "💨", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "😶‍", "🌫️", "🥴", "😵‍", "💫", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽️", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈️", "👉️", "👆️", "🖕", "👇️", "☝️", "👍️", "👎️", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂️", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "👶", "🧒", "👦", "👧", "🧑", "👨", "👩", "🧔", "🧔‍♀️", "🧔‍♂️", "🧑", "👨‍", "🦰", "👩‍", "🦰", "🧑", "👨‍", "🦱", "👩‍", "🦱", "🧑", "👨‍", "🦳", "👩‍", "🦳", "🧑", "👨‍", "🦲", "👩‍", "🦲", "👱", "👱‍♂️", "👱‍♀️", "🧓", "👴", "👵", "🙍", "🙍‍♂️", "🙍‍♀️", "🙎", "🙎‍♂️", "🙎‍♀️", "🙅", "🙅‍♂️", "🙅‍♀️", "🙆", "🙆‍♂️", "🙆‍♀️", "💁", "💁‍♂️", "💁‍♀️", "🙋", "🙋‍♂️", "🙋‍♀️", "🧏", "🧏‍♂️", "🧏‍♀️", "🙇", "🙇‍♂️", "🙇‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "🤷", "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", "👨‍🏫", "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", "👮", "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", "💂", "💂‍♂️", "💂‍♀️", "👷", "👷‍♂️", "👷‍♀️", "🤴", "👸", "👳", "👳‍♂️", "👳‍♀️", "👲", "🧕", "🤵", "🤵‍♂️", "🤵‍♀️", "👰", "👰‍♂️", "👰‍♀️", "🤰", "🤱", "👩‍", "🍼", "👨‍", "🍼", "🧑‍", "🍼", "👼", "🎅", "🤶", "🧑‍", "🎄", "🦸", "🦸‍♂️", "🦸‍♀️", "🦹", "🦹‍♂️", "🦹‍♀️", "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "🧝", "🧝‍♂️", "🧝‍♀️", "🧞", "🧞‍♂️", "🧞‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "💆", "💆‍♂️", "💆‍♀️", "💇", "💇‍♂️", "💇‍♀️", "🚶", "🚶‍♂️", "🚶‍♀️", "🧍", "🧍‍♂️", "🧍‍♀️", "🧎", "🧎‍♂️", "🧎‍♀️", "🧑‍", "🦯", "👨‍", "🦯", "👩‍", "🦯", "🧑‍", "🦼", "👨‍", "🦼", "👩‍", "🦼", "🧑‍", "🦽", "👨‍", "🦽", "👩‍", "🦽", "🏃", "🏃‍♂️", "🏃‍♀️", "💃", "🕺", "🕴️", "👯", "👯‍♂️", "👯‍♀️", "🧖", "🧖‍♂️", "??‍♀️", "🧗", "🧗‍♂️", "🧗‍♀️", "🤺", "🏇", "⛷️", "🏂️", "🏌️", "🏌️‍♂️", "🏌️‍♀️", "🏄️", "🏄‍♂️", "🏄‍♀️", "🚣", "🚣‍♂️", "🚣‍♀️", "🏊️", "🏊‍♂️", "🏊‍♀️", "⛹️", "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", "🚴", "🚴‍♂️", "🚴‍♀️", "🚵", "🚵‍♂️", "🚵‍♀️", "🤸", "🤸‍♂️", "🤸‍♀️", "🤼", "🤼‍♂️", "🤼‍♀️", "🤽", "🤽‍♂️", "🤽‍♀️", "🤾", "🤾‍♂️", "🤾‍♀️", "🤹", "🤹‍♂️", "🤹‍♀️", "🧘", "🧘‍♂️", "🧘‍♀️", "🛀", "🛌", "🧑‍", "🤝‍", "🧑", "👭", "👫", "👬", "💏", "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", "💑", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "👪️", "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", "👤", "👥", "👣"];
const MalvinApiKey = config.MALVIN_API_KEY || "";
const MalvinTechApi = "https://api.malvintech.co.zw/api";
if (!MalvinApiKey) {
  console.warn("\n⚠️  MALVIN_API_KEY is not set — commands that use the Malvin API (downloads, AI, converters, etc.) will fail.\n   Get a free key: https://api.malvintech.co.zw (sign up, key is on your dashboard)\n   Then add MALVIN_API_KEY=your_key to your .env file.\n");
}
function classifyApiError(_0x5dc6d4, _0x4a3576) {
  const _0x224990 = _0x4a3576?.error || _0x4a3576?.message || "Unknown error";
  const _0x419d7e = {
    i18nKey: "api.key_missing",
    rawMessage: _0x224990
  };
  if (!MalvinApiKey) {
    return _0x419d7e;
  }
  if (_0x5dc6d4 === 429) {
    return {
      i18nKey: "api.limit_exceeded",
      rawMessage: _0x224990
    };
  }
  if (_0x5dc6d4 === 503) {
    return {
      i18nKey: "api.request_failed",
      rawMessage: "Endpoint under maintenance"
    };
  }
  if (_0x5dc6d4 === 403) {
    const _0x469695 = _0x224990.toLowerCase();
    if (_0x469695.includes("revoked")) {
      return {
        i18nKey: "api.key_revoked",
        rawMessage: _0x224990
      };
    }
    if (_0x469695.includes("paused")) {
      return {
        i18nKey: "api.key_paused",
        rawMessage: _0x224990
      };
    }
    if (_0x469695.includes("banned")) {
      return {
        i18nKey: "api.account_banned",
        rawMessage: _0x224990
      };
    }
    if (_0x469695.includes("premium") || _0x469695.includes("vip") || _0x469695.includes("elite")) {
      const _0x5e1dda = {
        i18nKey: "api.tier_required",
        rawMessage: _0x224990
      };
      return _0x5e1dda;
    }
    const _0x406753 = {
      i18nKey: "api.key_invalid",
      rawMessage: _0x224990
    };
    return _0x406753;
  }
  const _0x36bcce = {
    i18nKey: "api.request_failed",
    rawMessage: _0x224990
  };
  return _0x36bcce;
}
async function MalvinAutoReact(_0x1dc72b, _0x3dc502, _0x424a29) {
  try {
    const _0x2862b8 = {
      text: _0x1dc72b,
      key: _0x3dc502.key
    };
    const _0x318979 = {
      react: _0x2862b8
    };
    const _0x3b66aa = _0x318979;
    await _0x424a29.sendMessage(_0x3dc502.key.remoteJid, _0x3b66aa);
  } catch (_0x598060) {
    console.error("Error sending auto reaction:", _0x598060);
  }
}
const DEV_NUMBERS = ["263776388689", "263714757857"];
const MalvinAntiLink = async (_0x530df8, _0x128a9c, _0x481351) => {
  try {
    if (!_0x128a9c?.message || _0x128a9c.key.fromMe) {
      return;
    }
    const _0x8ed0cf = _0x128a9c.key.remoteJid;
    const _0x16f594 = _0x8ed0cf.endsWith("@g.us");
    if (!_0x16f594) {
      return;
    }
    const {
      getGroupSetting: _0x1cdbf5,
      addAntilinkWarning: _0x78765c,
      resetAntilinkWarnings: _0x5903d8
    } = require("./database/groupConfig");
    const {
      getSudoNumbers: _0x50c849
    } = require("./database/sudo");
    const {
      getLidMapping: _0x143daa
    } = require("./socket/groupStore");
    const _0x117b9f = await _0x1cdbf5(_0x8ed0cf, "ANTILINK");
    if (!_0x117b9f || _0x117b9f === "false" || _0x117b9f === "off") {
      return;
    }
    const _0x240f5d = Object.keys(_0x128a9c.message)[0];
    const _0x1c0d75 = _0x240f5d === "conversation" ? _0x128a9c.message.conversation : _0x128a9c.message[_0x240f5d]?.text || _0x128a9c.message[_0x240f5d]?.caption || "";
    if (!_0x1c0d75 || !isAnyLink(_0x1c0d75)) {
      return;
    }
    let _0x2e0e52 = _0x128a9c.key.participantPn || _0x128a9c.key.participant || _0x128a9c.participant;
    if (!_0x2e0e52 || _0x2e0e52.endsWith("@g.us")) {
      return;
    }
    const _0x31ecbd = await getAllSettings();
    const _0x37d127 = _0x31ecbd.BOT_NAME || fancy("Malvin XD");
    if (_0x2e0e52.endsWith("@lid")) {
      const _0x237864 = _0x143daa(_0x2e0e52);
      if (_0x237864) {
        _0x2e0e52 = _0x237864;
      } else {
        try {
          const _0x5a6193 = await _0x530df8.getJidFromLid(_0x2e0e52);
          if (_0x5a6193) {
            _0x2e0e52 = _0x5a6193;
          }
        } catch (_0x57439e) {}
      }
    }
    const _0x17f091 = _0x2e0e52.split("@")[0];
    const _0x4a3482 = (await _0x50c849()) || [];
    const _0x2a7908 = DEV_NUMBERS.includes(_0x17f091) || _0x4a3482.includes(_0x17f091);
    if (_0x2a7908) {
      const _0x142612 = _0x117b9f.toLowerCase();
      const _0xcfbdd6 = _0x142612 === "warn" ? "warn" : _0x142612 === "kick" ? "kick" : "delete";
      const _0xd26df2 = {
        text: "⚠️ *" + _0x37d127 + " Antilink Active!*\nAction: *" + _0xcfbdd6 + "*\n\nLink detected from @" + _0x17f091 + ", but they are a *SuperUser* on this bot and cannot be actioned.",
        mentions: [_0x2e0e52]
      };
      await _0x530df8.sendMessage(_0x8ed0cf, _0xd26df2);
      return;
    }
    const _0x142f12 = await _0x481351(_0x530df8, _0x8ed0cf);
    if (!_0x142f12 || !_0x142f12.participants) {
      return;
    }
    const _0x51d04f = _0x530df8.user?.id?.split(":")[0] + "@s.whatsapp.net";
    const _0x1fdb07 = _0x142f12.participants.find(_0x5c5351 => {
      const _0x71009 = (_0x5c5351.pn || _0x5c5351.phoneNumber || _0x5c5351.id || "").split("@")[0];
      const _0xac2c35 = _0x51d04f.split("@")[0];
      return _0x71009 === _0xac2c35 && _0x5c5351.admin;
    });
    if (!_0x1fdb07) {
      return;
    }
    const _0x13b82c = _0x142f12.participants.filter(_0x5807f7 => _0x5807f7.admin).map(_0x222385 => _0x222385.pn || _0x222385.phoneNumber || _0x222385.id);
    const _0x368d41 = _0x2e0e52.split("@")[0];
    const _0x2fbffb = _0x13b82c.some(_0x288eaa => {
      const _0x32323f = (_0x288eaa || "").split("@")[0];
      return _0x32323f === _0x368d41 || _0x288eaa === _0x2e0e52;
    });
    if (_0x2fbffb) {
      const _0x2ff9e2 = _0x117b9f.toLowerCase();
      const _0x426cbf = _0x2ff9e2 === "warn" ? "warn" : _0x2ff9e2 === "kick" ? "kick" : "delete";
      const _0x41ed7f = {
        text: "⚠️ *" + _0x37d127 + " Antilink Active!*\nAction: *" + _0x426cbf + "*\n\nLink detected from @" + _0x17f091 + ", but they are a *Group Admin* and cannot be actioned.",
        mentions: [_0x2e0e52]
      };
      await _0x530df8.sendMessage(_0x8ed0cf, _0x41ed7f);
      return;
    }
    try {
      const _0x82a095 = {
        delete: _0x128a9c.key
      };
      await _0x530df8.sendMessage(_0x8ed0cf, _0x82a095);
    } catch (_0x4daaf7) {
      console.error("Failed to delete message:", _0x4daaf7.message);
    }
    const _0x27c595 = _0x117b9f.toLowerCase();
    if (_0x27c595 === "kick") {
      try {
        await _0x530df8.groupParticipantsUpdate(_0x8ed0cf, [_0x2e0e52], "remove");
        const _0x3d6fa0 = {
          text: "⚠️ " + _0x37d127 + " anti-link active!\n@" + _0x17f091 + " has been kicked for sharing a link.",
          mentions: [_0x2e0e52]
        };
        await _0x530df8.sendMessage(_0x8ed0cf, _0x3d6fa0);
      } catch (_0x43ee39) {
        console.error("Failed to kick user:", _0x43ee39.message);
        const _0x589f4f = {
          text: "⚠️ Link detected from @" + _0x17f091 + "! Could not remove user.",
          mentions: [_0x2e0e52]
        };
        await _0x530df8.sendMessage(_0x8ed0cf, _0x589f4f);
      }
    } else if (_0x27c595 === "delete") {
      const _0xbfcb01 = {
        text: "⚠️ " + _0x37d127 + " anti-link active!\nLinks are not allowed here @" + _0x17f091 + "!",
        mentions: [_0x2e0e52]
      };
      await _0x530df8.sendMessage(_0x8ed0cf, _0xbfcb01);
    } else if (_0x27c595 === "warn") {
      const _0x1c974d = parseInt(await _0x1cdbf5(_0x8ed0cf, "ANTILINK_WARN_COUNT")) || 5;
      const _0x550a83 = await _0x78765c(_0x8ed0cf, _0x2e0e52);
      if (_0x550a83 >= _0x1c974d) {
        try {
          await _0x530df8.groupParticipantsUpdate(_0x8ed0cf, [_0x2e0e52], "remove");
          await _0x5903d8(_0x8ed0cf, _0x2e0e52);
          const _0x17ea30 = {
            text: "🚫 " + _0x37d127 + " anti-link!\n@" + _0x17f091 + " reached " + _0x1c974d + " warnings and has been kicked!",
            mentions: [_0x2e0e52]
          };
          await _0x530df8.sendMessage(_0x8ed0cf, _0x17ea30);
        } catch (_0x593d3b) {
          console.error("Failed to kick user:", _0x593d3b.message);
          const _0x23d07c = {
            text: "⚠️ @" + _0x17f091 + " has " + _0x550a83 + "/" + _0x1c974d + " warnings! Could not kick.",
            mentions: [_0x2e0e52]
          };
          await _0x530df8.sendMessage(_0x8ed0cf, _0x23d07c);
        }
      } else {
        const _0x1722f8 = {
          text: "⚠️ Warning " + _0x550a83 + "/" + _0x1c974d + " for @" + _0x17f091 + "!\nLinks are not allowed. You will be kicked after " + _0x1c974d + " warnings.",
          mentions: [_0x2e0e52]
        };
        await _0x530df8.sendMessage(_0x8ed0cf, _0x1722f8);
      }
    }
  } catch (_0x29e3ad) {
    console.error("Anti-link error:", _0x29e3ad);
  }
};
const MalvinAntibad = async (_0x5045fe, _0xc8bfa5, _0x431f86) => {
  try {
    if (!_0xc8bfa5?.message || _0xc8bfa5.key.fromMe) {
      return;
    }
    const _0x1ea005 = _0xc8bfa5.key.remoteJid;
    const _0x501384 = _0x1ea005.endsWith("@g.us");
    if (!_0x501384) {
      return;
    }
    let _0x252db2 = _0xc8bfa5.key.participantPn || _0xc8bfa5.key.participant || _0xc8bfa5.participant;
    if (!_0x252db2 || _0x252db2.endsWith("@g.us")) {
      return;
    }
    const {
      getGroupSetting: _0x7d87b3,
      addAntibadWarning: _0x1f9b4e,
      resetAntibadWarnings: _0x4ea9fa,
      getBadWords: _0x586daf
    } = require("./database/groupConfig");
    const {
      getSudoNumbers: _0x3aab8b
    } = require("./database/sudo");
    const {
      getLidMapping: _0x35e158
    } = require("./socket/groupStore");
    const _0xfb9843 = await _0x7d87b3(_0x1ea005, "ANTIBAD");
    if (!_0xfb9843 || _0xfb9843 === "false" || _0xfb9843 === "off") {
      return;
    }
    const _0x344229 = await _0x586daf(_0x1ea005);
    if (!_0x344229 || _0x344229.length === 0) {
      return;
    }
    const _0x1ae53b = await getAllSettings();
    const _0xc9e506 = _0x1ae53b.BOT_NAME || "malvin-xd";
    if (_0x252db2.endsWith("@lid")) {
      const _0x52af38 = _0x35e158(_0x252db2);
      if (_0x52af38) {
        _0x252db2 = _0x52af38;
      }
    }
    const _0x4d77bf = _0x252db2.split("@")[0];
    const _0x169d06 = Object.keys(_0xc8bfa5.message)[0];
    const _0x386cd6 = _0x169d06 === "conversation" ? _0xc8bfa5.message.conversation : _0xc8bfa5.message[_0x169d06]?.text || _0xc8bfa5.message[_0x169d06]?.caption || "";
    if (!_0x386cd6) {
      return;
    }
    const _0x4a66d3 = _0x386cd6.toLowerCase();
    const _0x3f7387 = _0x344229.find(_0x275bd1 => {
      const _0x3dd0b0 = _0x275bd1.toLowerCase();
      const _0x2c7f42 = _0x3dd0b0.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const _0x459882 = new RegExp("\\b" + _0x2c7f42 + "\\b", "i");
      return _0x459882.test(_0x4a66d3);
    });
    if (!_0x3f7387) {
      return;
    }
    const _0x23609d = (await _0x3aab8b()) || [];
    const _0x2eb611 = DEV_NUMBERS.includes(_0x4d77bf) || _0x23609d.includes(_0x4d77bf);
    if (_0x2eb611) {
      const _0x42a190 = _0xfb9843.toLowerCase();
      const _0x57aab6 = _0x42a190 === "warn" ? "warn" : _0x42a190 === "kick" ? "kick" : "delete";
      const _0x2372e3 = {
        text: "⚠️ *" + _0xc9e506 + " Anti-BadWords Active!*\nAction: *" + _0x57aab6 + "*\n\nBad word detected from @" + _0x4d77bf + ", but they are a *SuperUser* on this bot and cannot be actioned.",
        mentions: [_0x252db2]
      };
      await _0x5045fe.sendMessage(_0x1ea005, _0x2372e3);
      return;
    }
    const _0x38565c = await _0x431f86(_0x5045fe, _0x1ea005);
    if (!_0x38565c || !_0x38565c.participants) {
      return;
    }
    const _0x31c134 = _0x5045fe.user?.id?.split(":")[0] + "@s.whatsapp.net";
    const _0x8112f6 = _0x38565c.participants.find(_0x334dda => {
      const _0x49e318 = (_0x334dda.pn || _0x334dda.phoneNumber || _0x334dda.id || "").split("@")[0];
      const _0x2ff239 = _0x31c134.split("@")[0];
      return _0x49e318 === _0x2ff239 && _0x334dda.admin;
    });
    if (!_0x8112f6) {
      return;
    }
    const _0x5e9c0f = _0x38565c.participants.filter(_0x1c49a9 => _0x1c49a9.admin).map(_0x2b7c62 => _0x2b7c62.pn || _0x2b7c62.phoneNumber || _0x2b7c62.id);
    const _0x70addd = _0x252db2.split("@")[0];
    const _0x312f38 = _0x5e9c0f.some(_0x47b7e5 => {
      const _0x425976 = (_0x47b7e5 || "").split("@")[0];
      return _0x425976 === _0x70addd || _0x47b7e5 === _0x252db2;
    });
    if (_0x312f38) {
      const _0x21597e = _0xfb9843.toLowerCase();
      const _0x1fe167 = _0x21597e === "warn" ? "warn" : _0x21597e === "kick" ? "kick" : "delete";
      const _0x30a437 = {
        text: "⚠️ *" + _0xc9e506 + " Anti-BadWords Active!*\nAction: *" + _0x1fe167 + "*\n\nBad word detected from @" + _0x4d77bf + ", but they are a *Group Admin* and cannot be actioned.",
        mentions: [_0x252db2]
      };
      await _0x5045fe.sendMessage(_0x1ea005, _0x30a437);
      return;
    }
    try {
      const _0x20a097 = {
        delete: _0xc8bfa5.key
      };
      await _0x5045fe.sendMessage(_0x1ea005, _0x20a097);
    } catch (_0xbca663) {
      console.error("Failed to delete bad word message:", _0xbca663.message);
    }
    const _0x3cdc8c = _0xfb9843.toLowerCase();
    if (_0x3cdc8c === "kick") {
      try {
        await _0x5045fe.groupParticipantsUpdate(_0x1ea005, [_0x252db2], "remove");
        const _0x1d2ea3 = {
          text: "🚫 " + _0xc9e506 + " Anti-BadWords!\n@" + _0x4d77bf + " has been kicked for using prohibited language.",
          mentions: [_0x252db2]
        };
        await _0x5045fe.sendMessage(_0x1ea005, _0x1d2ea3);
      } catch (_0x546c0a) {
        console.error("Failed to kick user:", _0x546c0a.message);
        const _0x2ea75d = {
          text: "⚠️ Bad word detected from @" + _0x4d77bf + "! Could not remove user.",
          mentions: [_0x252db2]
        };
        await _0x5045fe.sendMessage(_0x1ea005, _0x2ea75d);
      }
    } else if (_0x3cdc8c === "delete" || _0x3cdc8c === "true") {
      const _0x5eff75 = {
        text: "⚠️ " + _0xc9e506 + " Anti-BadWords!\nProhibited language detected @" + _0x4d77bf + "! Keep it clean.",
        mentions: [_0x252db2]
      };
      await _0x5045fe.sendMessage(_0x1ea005, _0x5eff75);
    } else if (_0x3cdc8c === "warn") {
      const _0x587587 = parseInt(await _0x7d87b3(_0x1ea005, "ANTIBAD_WARN_COUNT")) || 5;
      const _0x392570 = await _0x1f9b4e(_0x1ea005, _0x252db2);
      if (_0x392570 >= _0x587587) {
        try {
          await _0x5045fe.groupParticipantsUpdate(_0x1ea005, [_0x252db2], "remove");
          await _0x4ea9fa(_0x1ea005, _0x252db2);
          const _0x3149b8 = {
            text: "🚫 " + _0xc9e506 + " Anti-BadWords!\n@" + _0x4d77bf + " reached " + _0x587587 + " warnings and has been kicked!",
            mentions: [_0x252db2]
          };
          await _0x5045fe.sendMessage(_0x1ea005, _0x3149b8);
        } catch (_0x320dc7) {
          console.error("Failed to kick user:", _0x320dc7.message);
          const _0x163c65 = {
            text: "⚠️ @" + _0x4d77bf + " has " + _0x392570 + "/" + _0x587587 + " warnings! Could not kick.",
            mentions: [_0x252db2]
          };
          await _0x5045fe.sendMessage(_0x1ea005, _0x163c65);
        }
      } else {
        const _0x2241dd = {
          text: "⚠️ Warning " + _0x392570 + "/" + _0x587587 + " for @" + _0x4d77bf + "!\nProhibited language is not allowed. You will be kicked after " + _0x587587 + " warnings.",
          mentions: [_0x252db2]
        };
        await _0x5045fe.sendMessage(_0x1ea005, _0x2241dd);
      }
    }
  } catch (_0x5729af) {
    console.error("Anti-badwords error:", _0x5729af);
  }
};
const MalvinAntiGroupMention = async (_0x550554, _0x489f91, _0x44ec34) => {
  try {
    if (!_0x489f91?.message) {
      return;
    }
    const _0x175cb5 = Object.keys(_0x489f91.message);
    const _0x6f8529 = _0x175cb5.includes("groupStatusMentionMessage");
    if (!_0x6f8529) {
      return;
    }
    if (_0x489f91.key.fromMe) {
      return;
    }
    const _0x278939 = _0x489f91.key.remoteJid;
    if (!_0x278939 || !_0x278939.endsWith("@g.us")) {
      return;
    }
    const {
      getGroupSetting: _0xae9308,
      addAntiGroupMentionWarning: _0x4f3153,
      resetAntiGroupMentionWarnings: _0x555b09
    } = require("./database/groupConfig");
    const {
      getSudoNumbers: _0x5e2550
    } = require("./database/sudo");
    const {
      getLidMapping: _0x4c36a7
    } = require("./socket/groupStore");
    const _0x1449d1 = await _0xae9308(_0x278939, "ANTIGROUPMENTION");
    if (!_0x1449d1 || _0x1449d1 === "false" || _0x1449d1 === "off") {
      return;
    }
    let _0xa61093 = _0x489f91.key.participantPn || _0x489f91.key.participant || _0x489f91.participant;
    if (!_0xa61093 || _0xa61093.endsWith("@g.us")) {
      return;
    }
    const _0xf71897 = await getAllSettings();
    const _0x126fd7 = _0xf71897.BOT_NAME || fancy("Malvin-XD");
    if (_0xa61093.endsWith("@lid")) {
      const _0x38b658 = _0x4c36a7(_0xa61093);
      if (_0x38b658) {
        _0xa61093 = _0x38b658;
      } else {
        try {
          const _0x255f56 = await _0x550554.getJidFromLid(_0xa61093);
          if (_0x255f56) {
            _0xa61093 = _0x255f56;
          }
        } catch (_0x589e87) {}
      }
    }
    const _0x23d98e = _0xa61093.split("@")[0];
    const _0xa974a7 = (await _0x5e2550()) || [];
    const _0x1f8eed = DEV_NUMBERS.includes(_0x23d98e) || _0xa974a7.includes(_0x23d98e);
    const _0x3befa9 = _0x1449d1.toLowerCase();
    const _0x12502f = _0x3befa9 === "warn" || _0x3befa9 === "on" || _0x3befa9 === "true" ? "warn" : _0x3befa9 === "kick" ? "kick" : _0x3befa9 === "delete" ? "delete" : "warn";
    if (_0x1f8eed) {
      return;
    }
    const _0x333daf = await _0x44ec34(_0x550554, _0x278939);
    if (!_0x333daf || !_0x333daf.participants) {
      return;
    }
    const _0x374fa0 = _0x550554.user?.id?.split(":")[0] + "@s.whatsapp.net";
    const _0x879122 = _0x333daf.participants.find(_0x83daa1 => {
      const _0x2b50cc = (_0x83daa1.pn || _0x83daa1.phoneNumber || _0x83daa1.id || "").split("@")[0];
      const _0x19949a = _0x374fa0.split("@")[0];
      return _0x2b50cc === _0x19949a && _0x83daa1.admin;
    });
    if (!_0x879122) {
      return;
    }
    const _0xcb8aca = _0x333daf.participants.filter(_0x63c76a => _0x63c76a.admin).map(_0x1d1929 => _0x1d1929.pn || _0x1d1929.phoneNumber || _0x1d1929.id);
    const _0x16e72d = _0xa61093.split("@")[0];
    const _0xa0f263 = _0xcb8aca.some(_0xf2006 => {
      const _0x3cbd10 = (_0xf2006 || "").split("@")[0];
      return _0x3cbd10 === _0x16e72d || _0xf2006 === _0xa61093;
    });
    if (_0xa0f263) {
      return;
    }
    if (_0x3befa9 === "delete") {
      try {
        const _0x5ebc81 = {
          delete: _0x489f91.key
        };
        await _0x550554.sendMessage(_0x278939, _0x5ebc81);
        const _0x2af8df = {
          text: "⚠️ *" + _0x126fd7 + " Anti-Status-Mention*\n\n@" + _0x23d98e + ", mentioning this group in your status is not allowed. Your message has been deleted.",
          mentions: [_0xa61093]
        };
        await _0x550554.sendMessage(_0x278939, _0x2af8df);
      } catch (_0x1f3e08) {
        console.error("Failed to delete status mention message:", _0x1f3e08.message);
      }
    } else if (_0x3befa9 === "kick") {
      try {
        await _0x550554.groupParticipantsUpdate(_0x278939, [_0xa61093], "remove");
        const _0x3c59ea = {
          text: "🚫 *" + _0x126fd7 + " Anti-Group-Mention!*\n\n@" + _0x23d98e + " has been kicked for mentioning this group in their status!",
          mentions: [_0xa61093]
        };
        await _0x550554.sendMessage(_0x278939, _0x3c59ea);
      } catch (_0x17854f) {
        console.error("Failed to kick user:", _0x17854f.message);
        const _0x35acc8 = {
          text: "⚠️ Group mentioned in status by @" + _0x23d98e + "! Could not remove user.",
          mentions: [_0xa61093]
        };
        await _0x550554.sendMessage(_0x278939, _0x35acc8);
      }
    } else if (_0x3befa9 === "warn" || _0x3befa9 === "true" || _0x3befa9 === "on") {
      const _0x21c983 = parseInt(await _0xae9308(_0x278939, "ANTIGROUPMENTION_WARN_COUNT")) || 3;
      const _0x157cf2 = await _0x4f3153(_0x278939, _0xa61093);
      if (_0x157cf2 >= _0x21c983) {
        try {
          await _0x550554.groupParticipantsUpdate(_0x278939, [_0xa61093], "remove");
          await _0x555b09(_0x278939, _0xa61093);
          const _0x5acf01 = {
            text: "🚫 *" + _0x126fd7 + " Anti-Group-Mention!*\n\n@" + _0x23d98e + " reached " + _0x21c983 + " warnings and has been kicked for mentioning this group in status!",
            mentions: [_0xa61093]
          };
          await _0x550554.sendMessage(_0x278939, _0x5acf01);
        } catch (_0x2c77b6) {
          console.error("Failed to kick user:", _0x2c77b6.message);
          const _0x168bf5 = {
            text: "⚠️ @" + _0x23d98e + " has " + _0x157cf2 + "/" + _0x21c983 + " warnings! Could not kick.",
            mentions: [_0xa61093]
          };
          await _0x550554.sendMessage(_0x278939, _0x168bf5);
        }
      } else {
        const _0x1a6275 = {
          text: "⚠️ *Warning " + _0x157cf2 + "/" + _0x21c983 + "* for @" + _0x23d98e + "!\n\nMentioning this group in status is not allowed. You will be kicked after " + _0x21c983 + " warnings.",
          mentions: [_0xa61093]
        };
        await _0x550554.sendMessage(_0x278939, _0x1a6275);
      }
    }
  } catch (_0x5bd576) {
    console.error("Anti-group-mention error:", _0x5bd576);
  }
};
function getTimeBlock() {
  const _0x243ef3 = new Date().getHours();
  if (_0x243ef3 >= 5 && _0x243ef3 < 11) {
    return "morning";
  }
  if (_0x243ef3 >= 11 && _0x243ef3 < 16) {
    return "afternoon";
  }
  if (_0x243ef3 >= 16 && _0x243ef3 < 21) {
    return "evening";
  }
  if (_0x243ef3 >= 21 || _0x243ef3 < 2) {
    return "night";
  }
  return "latenight";
}
const quotes = {
  morning: ["" + fancy("☀️ rise and shine. great things never came from comfort zones.", "smallcaps"), "" + fancy("🌅 each �morning we are born again. what we do today is what matters �most.", "smallcaps"), "" + fancy("⚡ start your day with determination, end it with satisfaction.", "smallcaps"), "" + fancy("🌞 the sun is up, the day is yours.", "smallcaps"), "" + fancy("📖 every morning is a new page of your story. make it count.", "smallcaps")],
  afternoon: ["" + fancy("⏳ keep going. you're halfway to greatness.", "smallcaps"), "" + fancy("🔄 stay focused. the grind doesn't stop at noon.", "smallcaps"), "" + fancy("🏗️ success is built in the hours nobody talks about.", "smallcaps"), "" + fancy("🔥 push through. champions are made in the middle of the day.", "smallcaps"), "" + fancy("⏰ don't watch the clock, do what it does—keep going.", "smallcaps")],
  evening: ["" + fancy("🛌 rest is part of the process. recharge wisely.", "smallcaps"), "" + fancy("🌇 evening brings silence that speaks louder than daylight.", "smallcaps"), "" + fancy("✨ you did well today. prepare for an even better �tomorrow.", "smallcaps"), "" + fancy("🌙 let the night settle in, but keep your dreams wide awake.", "smallcaps"), "" + fancy("🧠 growth doesn't end at sunset. it sleeps with you.", "smallcaps")],
  night: ["" + fancy("🌌 the night is silent, but your dreams are loud.", "smallcaps"), "" + fancy("⭐ stars shine brightest in the dark. so can you.", "smallcaps"), "" + fancy("🧘‍♂️ let go of the noise. embrace the peace.", "smallcaps"), "" + fancy("✅ you made it through the day. now dream big.", "smallcaps"), "" + fancy("🌠 midnight thoughts are the blueprint of tomorrow's greatness.", "smallcaps")],
  latenight: ["" + fancy("🕶️ while the world sleeps, the minds of legends wander.", "smallcaps"), "" + fancy("⏱️ late nights teach the deepest lessons.", "smallcaps"), "" + fancy("🔕 silence isn't empty—it's full of answers.", "smallcaps"), "" + fancy("✨ creativity whispers when �the world is quiet.", "smallcaps"), "" + fancy("🌌 rest or reflect, but never waste the night.", "smallcaps")]
};
function getCurrentDateTime() {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  }).format(new Date());
}
const MalvinAutoBio = async _0x22fa33 => {
  try {
    const _0x36075c = await getAllSettings();
    const _0x44fd93 = _0x36075c.BOT_NAME || fancy("Malvin-XD");
    const _0x406814 = getTimeBlock();
    const _0x4aaac3 = getCurrentDateTime();
    const _0x5c11e7 = quotes[_0x406814];
    const _0x22857f = _0x5c11e7[Math.floor(Math.random() * _0x5c11e7.length)];
    const _0x5d87f8 = _0x44fd93 + " Online ||\n\n📅 " + _0x4aaac3 + "\n\n➤ " + _0x22857f;
    await _0x22fa33.updateProfileStatus(_0x5d87f8);
  } catch (_0x18e3d2) {}
};
const availableApis = [MalvinTechApi + "/ai/lumo?apikey=" + MalvinApiKey + "&text="];
function getRandomApi() {
  return availableApis[Math.floor(Math.random() * availableApis.length)];
}
function processForTTS(_0x4acb53) {
  if (!_0x4acb53 || typeof _0x4acb53 !== "string") {
    return "";
  }
  return _0x4acb53.replace(/[\[\]\(\)\{\}]/g, " ").replace(/\s+/g, " ").substring(0, 190);
}
const identityPatterns = [/who\s*(made|created|built)\s*you/i, /who\s*is\s*your\s*(creator|developer|maker|owner|father|parent)/i, /what('?s| is)\s*your\s*name\??/i, /who\s*are\s*you\??/i, /who\s*a?you\??/i, /who\s*au\??/i, /what('?s| is)\s*ur\s*name\??/i, /wat('?s| is)\s*(ur|your)\s*name\??/i, /wats?\s*(ur|your)\s*name\??/i, /wot('?s| is)\s*(ur|your)\s*name\??/i, /hoo\s*r\s*u\??/i, /who\s*u\??/i, /whos\s*u\??/i, /whos?\s*this\??/i, /you\s*called\s*Malvin/i, /are\s*you\s*Malvin/i, /are\s*u\s*Malvin/i, /u\s*Malvin\??/i, /who\s*is\s*your\s*boss\??/i, /who\s*ur\s*boss\??/i, /who\s*your\s*boss\??/i, /whoa\s*created\s*you\??/i, /who\s*made\s*u\??/i, /who\s*create\s*u\??/i, /who\s*built\s*u\??/i, /who\s*ur\s*owner\??/i, /who\s*is\s*u\??/i, /what\s*are\s*you\??/i, /what\s*r\s*u\??/i, /wat\s*r\s*u\??/i];
function isIdentityQuestion(_0x1ade9c) {
  return identityPatterns.some(_0x328fcf => typeof _0x1ade9c === "string" && _0x328fcf.test(_0x1ade9c));
}
const aiSessionCache = new Map();
const MAX_AI_SESSIONS = 1000;
async function getAIResponse(_0x4905ff, _0x5c972d = null) {
  if (isIdentityQuestion(_0x4905ff)) {
    return "I am an Interactive Ai Assistant Chat Bot, created by Malvin Tech!";
  }
  try {
    const _0x236ec8 = {
      apikey: MalvinApiKey,
      text: _0x4905ff
    };
    const _0x4b63f6 = _0x236ec8;
    const _0xc0c3a9 = _0x5c972d ? aiSessionCache.get(_0x5c972d) : null;
    if (_0xc0c3a9) {
      _0x4b63f6.session_id = _0xc0c3a9;
    }
    const _0x211c2b = {
      params: _0x4b63f6,
      timeout: 30000,
      validateStatus: () => true
    };
    const _0x1ccb6d = await axios.get(MalvinTechApi + "/ai/malvinai", _0x211c2b);
    if (_0x1ccb6d.status >= 400) {
      const {
        rawMessage: _0x354320
      } = classifyApiError(_0x1ccb6d.status, _0x1ccb6d.data);
      console.error("API Error:", _0x354320);
      return "Sorry, I couldn't get a response right now";
    }
    const _0x394a77 = _0x1ccb6d.data?.data !== undefined ? _0x1ccb6d.data.data : _0x1ccb6d.data;
    if (_0x5c972d && _0x394a77?.session_id) {
      aiSessionCache.set(_0x5c972d, _0x394a77.session_id);
      while (aiSessionCache.size > MAX_AI_SESSIONS) {
        aiSessionCache.delete(aiSessionCache.keys().next().value);
      }
    }
    const _0x4420a0 = _0x394a77?.result;
    if (!_0x4420a0) {
      return "Sorry, I couldn't get a response right now";
    }
    if (typeof _0x4420a0 === "object") {
      return JSON.stringify(_0x4420a0);
    } else {
      return _0x4420a0;
    }
  } catch (_0x26cd67) {
    console.error("API Error:", _0x26cd67.message);
    return "Sorry, I couldn't get a response right now";
  }
}
function tryResolveMentionJid(_0x53c9ac) {
  if (!_0x53c9ac || !_0x53c9ac.endsWith("@lid")) {
    return _0x53c9ac;
  }
  try {
    const {
      getLidMapping: _0x500bf6
    } = require("./socket/groupStore");
    const _0x3c77b4 = _0x500bf6(_0x53c9ac);
    if (_0x3c77b4) {
      return _0x3c77b4;
    }
  } catch (_0x36f13f) {}
  return _0x53c9ac;
}
function isMentionOrReplyTrigger(_0x33e73b, _0x9dfed8) {
  if (!_0x9dfed8) {
    return false;
  }
  const _0x1d3234 = _0x33e73b.message?.extendedTextMessage?.contextInfo || _0x33e73b.message?.imageMessage?.contextInfo || _0x33e73b.message?.videoMessage?.contextInfo;
  const _0x2df3da = _0x1d3234?.mentionedJid || [];
  if (_0x2df3da.some(_0x27479e => tryResolveMentionJid(_0x27479e) === _0x9dfed8)) {
    return true;
  }
  if (_0x1d3234?.participant === _0x9dfed8) {
    return true;
  }
  return false;
}
function setupMalvinChatBot(_0x2ed770, _0xb94e16, _0x51ab2e, _0x2c50cb) {
  _0x2ed770.ev.on("messages.upsert", async ({
    messages: _0x39729f
  }) => {
    try {
      const _0x5582fd = _0x39729f[0];
      if (!_0x5582fd?.message || _0x5582fd.key.fromMe) {
        return;
      }
      const _0x40dd85 = _0x2ed770.user?.id?.split(":")[0] + "@s.whatsapp.net";
      const _0x49c98d = _0x5582fd.key.remoteJid;
      const _0x47f431 = _0x49c98d.endsWith("@g.us");
      const _0x352d93 = await getAllSettings();
      const _0x527aee = _0x352d93.CHATBOT;
      const _0x2eea00 = _0x352d93.CHATBOT_MODE || "inbox";
      const _0x45a1a9 = _0x527aee === "true" || _0x527aee === "audio";
      const _0x5dbbdc = _0x2eea00 === "allchats" || _0x2eea00 === "inbox" && !_0x47f431 || _0x2eea00 === "groups" && _0x47f431;
      const _0x41c37e = isMentionOrReplyTrigger(_0x5582fd, _0x40dd85);
      const _0x1b13d1 = _0x45a1a9 && _0x5dbbdc || _0x41c37e;
      if (!_0x1b13d1) {
        return;
      }
      let _0x5aa565 = "";
      if (_0x5582fd.message.conversation) {
        _0x5aa565 = _0x5582fd.message.conversation;
      } else if (_0x5582fd.message.extendedTextMessage?.text) {
        _0x5aa565 = _0x5582fd.message.extendedTextMessage.text;
      } else if (_0x5582fd.message.imageMessage?.caption) {
        _0x5aa565 = _0x5582fd.message.imageMessage.caption;
      }
      if (_0x41c37e && _0x5aa565) {
        const _0x46dc96 = _0x5582fd.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        for (const _0x41f396 of _0x46dc96) {
          _0x5aa565 = _0x5aa565.replace(new RegExp("@" + _0x41f396.split("@")[0] + "\\b", "g"), "").trim();
        }
      }
      if (!_0x5aa565 || typeof _0x5aa565 !== "string") {
        return;
      }
      const _0x20ab4c = _0x352d93.BOT_NAME || fancy("Malvin-XD");
      const _0x59b061 = _0x5582fd.key.participant || _0x5582fd.key.remoteJid;
      const _0x29f6fb = await getAIResponse(_0x5aa565, _0x59b061);
      const _0x27c9b4 = _0x527aee === "audio" && _0x45a1a9 && _0x5dbbdc;
      if (!_0x27c9b4) {
        const _0x32b60c = {
          quoted: _0x5582fd
        };
        await _0x2ed770.sendMessage(_0x49c98d, {
          text: String(_0x29f6fb),
          ...(await _0xb94e16(_0x49c98d, {
            title: _0x20ab4c + " " + fancy("Chat Bot"),
            body: fancy("Powered by Malvin API")
          }))
        }, _0x32b60c);
      } else {
        const _0x4ebd16 = processForTTS(String(_0x29f6fb));
        if (_0x4ebd16) {
          const _0x457faa = _0x2c50cb.getAudioUrl(_0x4ebd16, {
            lang: "en",
            slow: false,
            host: "https://translate.google.com"
          });
          const _0x5c003a = {
            url: _0x457faa
          };
          const _0x215d61 = {
            quoted: _0x5582fd
          };
          await _0x2ed770.sendMessage(_0x49c98d, {
            audio: _0x5c003a,
            mimetype: "audio/mpeg",
            ptt: true,
            waveform: [1000, 0, 1000, 0, 1000, 0, 1000],
            ...(await _0x51ab2e(_0x49c98d, {
              title: _0x20ab4c + " " + fancy("Audio-Chat Bot"),
              body: fancy("Powered by Malvin APIs")
            }))
          }, _0x215d61);
        }
      }
    } catch (_0x548793) {
      console.error("Message processing error:", _0x548793);
    }
  });
}
const presenceTimers = new Map();
const MalvinPresence = async (_0x96d37a, _0x4f25d5) => {
  try {
    const _0x4b5974 = _0x4f25d5.endsWith("@g.us");
    const _0x546a3d = 900000;
    if (presenceTimers.has(_0x4f25d5)) {
      clearTimeout(presenceTimers.get(_0x4f25d5));
      presenceTimers.delete(_0x4f25d5);
    }
    const _0x4fd10a = (await getSetting("GC_PRESENCE")) || "offline";
    const _0x53572b = (await getSetting("DM_PRESENCE")) || "offline";
    const _0x1b684a = _0x4b5974 ? _0x4fd10a : _0x53572b;
    if (!_0x1b684a) {
      return;
    }
    const _0xc1c9ff = _0x1b684a.toLowerCase();
    if (_0xc1c9ff === "offline") {
      return;
    }
    let _0xf4f84b;
    switch (_0xc1c9ff) {
      case "online":
        _0xf4f84b = "available";
        break;
      case "typing":
        _0xf4f84b = "composing";
        break;
      case "recording":
        _0xf4f84b = "recording";
        break;
      default:
        logger.warn("Invalid " + (_0x4b5974 ? "group" : "") + "presence: " + _0x1b684a);
        return;
    }
    await _0x96d37a.sendPresenceUpdate(_0xf4f84b, _0x4f25d5);
    logger.debug((_0x4b5974 ? "Group" : "Chat") + " presence activated: " + _0xc1c9ff + " for " + _0x4f25d5);
    presenceTimers.set(_0x4f25d5, setTimeout(() => {
      presenceTimers.delete(_0x4f25d5);
      logger.debug((_0x4b5974 ? "Group" : "Chat") + " presence duration ended for " + _0x4f25d5);
    }, _0x546a3d));
  } catch (_0x519e27) {
    logger.error("Presence update failed:", _0x519e27.message);
  }
};
const MalvinAnticall = async (_0x2ae954, _0xba96e5) => {
  const _0x57dc6d = await getAllSettings();
  const _0x3fd457 = _0x57dc6d.ANTICALL || "false";
  const _0x2e8346 = _0x57dc6d.ANTICALL_MSG || "Calls are not allowed. This bot automatically rejects calls.";
  for (const _0x13195b of _0x2ae954) {
    if (_0x13195b.status === "offer") {
      if (_0x3fd457 === "true" || _0x3fd457 === "decline") {
        let _0x20c894 = await _0xba96e5.sendMessage(_0x13195b.from, {
          text: "" + _0x2e8346,
          mentions: [_0x13195b.from]
        });
        await _0xba96e5.rejectCall(_0x13195b.id, _0x13195b.from);
      } else if (_0x3fd457 === "block") {
        let _0x4d6b8b = await _0xba96e5.sendMessage(_0x13195b.from, {
          text: _0x2e8346 + "\nYou are Being Blocked due to Calling While Anticall Action Is *\"Block\"*!",
          mentions: [_0x13195b.from]
        });
        await _0xba96e5.rejectCall(_0x13195b.id, _0x13195b.from);
        await _0xba96e5.updateBlockStatus(_0x13195b.from, "block");
      }
    }
  }
};
const processMediaMessage = async _0x4422ac => {
  let _0x40bd6b;
  let _0x3a7809;
  const _0x164434 = {
    imageMessage: "image",
    videoMessage: "video",
    audioMessage: "audio",
    stickerMessage: "sticker",
    documentMessage: "document"
  };
  for (const [_0x5985f9, _0x478df9] of Object.entries(_0x164434)) {
    if (_0x4422ac.message?.[_0x5985f9]) {
      _0x40bd6b = _0x478df9;
      _0x3a7809 = _0x4422ac.message[_0x5985f9];
      break;
    }
  }
  if (!_0x40bd6b || !_0x3a7809) {
    return null;
  }
  try {
    const _0x4dbffb = {
      logger: logger
    };
    const _0xe8d3fc = await downloadMediaMessage(_0x4422ac, _0x4dbffb);
    const _0x57516d = {
      image: "jpg",
      video: "mp4",
      audio: _0x3a7809.mimetype?.includes("mpeg") ? "mp3" : "ogg",
      sticker: "webp",
      document: _0x3a7809.fileName?.split(".").pop() || "bin"
    };
    const _0x39977c = path.join(__dirname, "./temp/temp_" + Date.now() + "." + _0x57516d[_0x40bd6b]);
    await fs.ensureDir(path.dirname(_0x39977c));
    await pipeline(_0xe8d3fc, fs.createWriteStream(_0x39977c));
    return {
      path: _0x39977c,
      type: _0x40bd6b,
      caption: _0x3a7809.caption || "",
      mimetype: _0x3a7809.mimetype,
      fileName: _0x3a7809.fileName || _0x40bd6b + "_" + Date.now() + "." + _0x57516d[_0x40bd6b],
      ptt: _0x3a7809.ptt
    };
  } catch (_0x4cf858) {
    logger.error("Media processing failed:", _0x4cf858);
    return null;
  }
};
const MalvinAntiDelete = async (_0x58b877, _0x281dd0, _0x37faf2, _0x431eb3, _0x1de6da, _0x50b1a1, _0x41cc95, _0x4c9af4) => {
  const _0x436aa7 = await getAllSettings();
  const _0x1f85b3 = _0x436aa7.BOT_NAME || fancy("Malvin-XD");
  const _0x2533de = _0x436aa7.BOT_PIC || "";
  const _0x21d792 = _0x436aa7.FOOTER || "";
  const _0x1570e2 = _0x436aa7.ANTIDELETE || "indm";
  const _0x35d3a5 = _0x436aa7.TIME_ZONE || "Africa/Harare";
  const _0x5bc194 = await createContext(_0x431eb3, {
    title: "Anti-Delete",
    body: _0x1f85b3,
    thumbnail: _0x2533de
  });
  const _0x54455a = formatTime(Date.now(), _0x35d3a5);
  const _0x5968ec = formatDate(Date.now(), _0x35d3a5);
  const {
    getLidMapping: _0x52646f,
    getGroupMetadata: _0x1e49eb
  } = require("./socket/groupStore");
  const _0x36aaef = async (_0x2f5085, _0x414962, _0x41666d) => {
    if (!_0x2f5085) {
      return {
        jid: null,
        display: _0x414962 || "Unknown",
        number: null
      };
    }
    let _0x21c979 = _0x2f5085;
    if (_0x2f5085.endsWith("@lid")) {
      let _0x3fc1df = _0x52646f(_0x2f5085);
      if (!_0x3fc1df && _0x58b877.getJidFromLid) {
        try {
          _0x3fc1df = await _0x58b877.getJidFromLid(_0x2f5085);
        } catch (_0x345408) {}
      }
      if (!_0x3fc1df && _0x41666d && isJidGroup(_0x41666d)) {
        try {
          const _0x4a808c = await _0x1e49eb(_0x58b877, _0x41666d);
          if (_0x4a808c?.participants) {
            const _0x179835 = _0x4a808c.participants.find(_0x20663e => _0x20663e.lid === _0x2f5085 || _0x20663e.id === _0x2f5085);
            if (_0x179835) {
              _0x3fc1df = _0x179835.pn || _0x179835.jid || _0x179835.id;
            }
          }
        } catch (_0x178065) {}
      }
      if (_0x3fc1df && _0x3fc1df.endsWith("@s.whatsapp.net")) {
        _0x21c979 = _0x3fc1df;
      }
    }
    if (_0x21c979.endsWith("@s.whatsapp.net")) {
      const _0x1e76c6 = _0x21c979.split("@")[0];
      const _0x4f27da = {
        jid: _0x21c979,
        display: "@" + _0x1e76c6,
        number: _0x1e76c6
      };
      return _0x4f27da;
    }
    const _0x4d08db = {
      jid: null,
      display: _0x414962 || _0x2f5085,
      number: null
    };
    return _0x4d08db;
  };
  const _0x26a35d = isJidGroup(_0x37faf2.remoteJid);
  const _0x436cea = await _0x36aaef(_0x1de6da, _0x4c9af4, _0x37faf2.remoteJid);
  const _0x3a4c6a = await _0x36aaef(_0x431eb3, _0x41cc95, _0x37faf2.remoteJid);
  const _0x3a39bc = _0x436cea.display;
  const _0x39c283 = _0x3a4c6a.display;
  const _0x280e33 = _0x436cea.jid;
  const _0x1d1a3 = _0x3a4c6a.jid;
  const _0x32b832 = [_0x280e33, _0x1d1a3].filter(_0x23d7e1 => _0x23d7e1 !== null);
  let _0x1b1183;
  let _0x564f1a = null;
  if (isJidGroup(_0x37faf2.remoteJid)) {
    try {
      const _0x1c18bf = await _0x1e49eb(_0x58b877, _0x37faf2.remoteJid);
      _0x1b1183 = "💬 Group Chat: " + (_0x1c18bf?.subject || "Unknown");
    } catch (_0x476d7a) {
      logger.error("Failed to fetch group metadata:", _0x476d7a);
      _0x1b1183 = "💬 Group Chat";
    }
  } else {
    _0x1b1183 = "💬 Dm Chat: " + _0x39c283;
    if (_0x1d1a3) {
      _0x564f1a = _0x1d1a3;
    }
  }
  const _0x5006a2 = _0x564f1a ? [..._0x32b832, _0x564f1a] : _0x32b832;
  const _0x4e9f18 = (_0x50a30e = []) => ({
    mentionedJid: _0x50a30e.filter(_0x2fe4f3 => _0x2fe4f3 !== null)
  });
  try {
    const _0xfee50b = [];
    if (_0x1570e2 === "inchat") {
      _0xfee50b.push((async () => {
        try {
          const _0x3effc2 = "*" + fancy("ANTIDELETE MESSAGE SYSTEM", "mono") + "*\n\n" + ("*👤 Sent By:* " + _0x3a39bc + "\n") + ("*👤 Deleted By:* " + _0x39c283 + "\n") + ("*🕑 Time:* " + _0x54455a + "\n") + ("*📆 Date:* " + _0x5968ec + "\n") + (_0x1b1183 + "\n\n> *" + _0x21d792 + "*");
          if (_0x281dd0.message?.conversation || _0x281dd0.message?.extendedTextMessage?.text) {
            const _0xcb1c9f = _0x281dd0.message.conversation || _0x281dd0.message.extendedTextMessage.text;
            await _0x58b877.sendMessage(_0x37faf2.remoteJid, {
              text: _0x3effc2 + "\n\n📝 *Content:* " + _0xcb1c9f,
              mentions: _0x5006a2,
              contextInfo: _0x4e9f18(_0x5006a2),
              ..._0x5bc194
            });
          } else {
            const _0x47c39c = await processMediaMessage(_0x281dd0);
            if (_0x47c39c) {
              if (_0x47c39c.type === "sticker" || _0x47c39c.type === "audio") {
                await _0x58b877.sendMessage(_0x37faf2.remoteJid, {
                  [_0x47c39c.type]: {
                    url: _0x47c39c.path
                  },
                  mentions: _0x5006a2,
                  contextInfo: _0x4e9f18(_0x5006a2),
                  ..._0x5bc194,
                  ...(_0x47c39c.type === "audio" ? {
                    ptt: _0x47c39c.ptt,
                    mimetype: _0x47c39c.mimetype
                  } : {})
                });
                await _0x58b877.sendMessage(_0x37faf2.remoteJid, {
                  text: _0x47c39c.caption ? _0x3effc2 + "\n\n📌 *Caption:* " + _0x47c39c.caption : _0x3effc2,
                  mentions: _0x5006a2,
                  contextInfo: _0x4e9f18(_0x5006a2),
                  ..._0x5bc194
                });
              } else {
                await _0x58b877.sendMessage(_0x37faf2.remoteJid, {
                  [_0x47c39c.type]: {
                    url: _0x47c39c.path
                  },
                  caption: _0x47c39c.caption ? _0x3effc2 + "\n\n📌 *Caption:* " + _0x47c39c.caption : _0x3effc2,
                  mentions: _0x5006a2,
                  contextInfo: _0x4e9f18(_0x5006a2),
                  ..._0x5bc194,
                  ...(_0x47c39c.type === "document" ? {
                    mimetype: _0x47c39c.mimetype,
                    fileName: _0x47c39c.fileName
                  } : {})
                });
              }
              setTimeout(() => {
                fs.unlink(_0x47c39c.path).catch(_0x5d8c8e => logger.error("Media cleanup failed:", _0x5d8c8e));
              }, 30000);
            }
          }
        } catch (_0x504c7b) {
          logger.error("Failed to process in-chat ANTIDELETE:", _0x504c7b);
        }
      })());
    }
    if (_0x1570e2 === "indm") {
      _0xfee50b.push((async () => {
        try {
          const _0x32b08c = "*👤 Sent By:* " + _0x3a39bc + "\n*👤 Deleted By:* " + _0x39c283 + "\n" + _0x1b1183;
          if (_0x281dd0.message?.conversation || _0x281dd0.message?.extendedTextMessage?.text) {
            const _0x51d759 = _0x281dd0.message.conversation || _0x281dd0.message.extendedTextMessage.text;
            await _0x58b877.sendMessage(_0x50b1a1, {
              text: "*" + fancy("ANTIDELETE MESSAGE SYSTEM", "mono") + "*\n\n*🕑 Time:* " + _0x54455a + "\n*📆 Date:* " + _0x5968ec + "\n\n" + _0x32b08c + "\n\n*Deleted Msg:*\n" + _0x51d759 + "\n\n> *" + _0x21d792 + "*",
              mentions: _0x5006a2,
              contextInfo: _0x4e9f18(_0x5006a2),
              ..._0x5bc194
            });
          } else {
            const _0x583ed8 = await processMediaMessage(_0x281dd0);
            if (_0x583ed8) {
              const _0x254c32 = _0x583ed8.caption ? "*" + fancy("ANTIDELETE MESSAGE SYSTEM", "mono") + "*\n\n*🕑 Time:* " + _0x54455a + "\n*📆 Date:* " + _0x5968ec + "\n\n" + _0x32b08c + "\n\n*Caption:*\n" + _0x583ed8.caption + "\n\n> *" + _0x21d792 + "*" : "*" + fancy("ANTIDELETE MESSAGE SYSTEM", "mono") + "*\n\n*🕑 Time:* " + _0x54455a + "\n*📆 Date:* " + _0x5968ec + "\n\n" + _0x32b08c + "\n\n> *" + _0x21d792 + "*";
              if (_0x583ed8.type === "sticker" || _0x583ed8.type === "audio") {
                await _0x58b877.sendMessage(_0x50b1a1, {
                  [_0x583ed8.type]: {
                    url: _0x583ed8.path
                  },
                  mentions: _0x5006a2,
                  contextInfo: _0x4e9f18(_0x5006a2),
                  ..._0x5bc194,
                  ...(_0x583ed8.type === "audio" ? {
                    ptt: _0x583ed8.ptt,
                    mimetype: _0x583ed8.mimetype
                  } : {})
                });
                await _0x58b877.sendMessage(_0x50b1a1, {
                  text: _0x254c32,
                  mentions: _0x5006a2,
                  contextInfo: _0x4e9f18(_0x5006a2),
                  ..._0x5bc194
                });
              } else {
                await _0x58b877.sendMessage(_0x50b1a1, {
                  [_0x583ed8.type]: {
                    url: _0x583ed8.path
                  },
                  caption: _0x254c32,
                  mentions: _0x5006a2,
                  contextInfo: _0x4e9f18(_0x5006a2),
                  ..._0x5bc194,
                  ...(_0x583ed8.type === "document" ? {
                    mimetype: _0x583ed8.mimetype,
                    fileName: _0x583ed8.fileName
                  } : {})
                });
              }
              setTimeout(() => {
                fs.unlink(_0x583ed8.path).catch(_0x187b98 => logger.error("Media cleanup failed:", _0x187b98));
              }, 30000);
            }
          }
        } catch (_0xf49ed) {
          logger.error("Failed to forward ANTIDELETE to owner:", _0xf49ed);
          await _0x58b877.sendMessage(_0x50b1a1, {
            text: "⚠️ Failed to forward deleted message from " + _0x39c283 + "\n\nError: " + _0xf49ed.message,
            mentions: _0x5006a2,
            contextInfo: _0x4e9f18(_0x5006a2),
            ..._0x5bc194
          });
        }
      })());
    }
    await Promise.all(_0xfee50b);
  } catch (_0x485481) {
    logger.error("Anti-delete handling failed:", _0x485481);
  }
};
const MalvinAntiViewOnce = async (_0x558d40, _0x3e8d71) => {
  try {
    if (!_0x3e8d71?.message) {
      return;
    }
    if (_0x3e8d71.key.fromMe) {
      return;
    }
    const _0x2df94a = _0x3e8d71.message;
    let _0x5008af = null;
    let _0xb302bb = null;
    if (_0x2df94a.imageMessage?.viewOnce || _0x2df94a.videoMessage?.viewOnce || _0x2df94a.audioMessage?.viewOnce) {
      _0xb302bb = Object.keys(_0x2df94a).find(_0x5c4f20 => _0x5c4f20.endsWith("Message") && ["image", "video", "audio"].some(_0x26450a => _0x5c4f20.includes(_0x26450a)));
      if (_0xb302bb) {
        const _0x49d0b0 = {
          [_0xb302bb]: _0x2df94a[_0xb302bb]
        };
        _0x5008af = _0x49d0b0;
      }
    } else if (_0x2df94a.viewOnceMessage) {
      _0x5008af = _0x2df94a.viewOnceMessage.message;
      _0xb302bb = _0x5008af ? Object.keys(_0x5008af).find(_0x1cdd4b => _0x1cdd4b.endsWith("Message") && ["image", "video", "audio"].some(_0x12f1f8 => _0x1cdd4b.includes(_0x12f1f8))) : null;
    } else if (_0x2df94a.viewOnceMessageV2) {
      _0x5008af = _0x2df94a.viewOnceMessageV2.message;
      _0xb302bb = _0x5008af ? Object.keys(_0x5008af).find(_0x294cba => _0x294cba.endsWith("Message") && ["image", "video", "audio"].some(_0x30dd80 => _0x294cba.includes(_0x30dd80))) : null;
    } else if (_0x2df94a.viewOnceMessageV2Extension) {
      _0x5008af = _0x2df94a.viewOnceMessageV2Extension.message;
      _0xb302bb = _0x5008af ? Object.keys(_0x5008af).find(_0x569c08 => _0x569c08.endsWith("Message") && ["image", "video", "audio"].some(_0x3ad99c => _0x569c08.includes(_0x3ad99c))) : null;
    }
    if (!_0x5008af || !_0xb302bb || !_0x5008af[_0xb302bb]) {
      return;
    }
    const _0x3f2885 = await getAllSettings();
    const _0x583c4c = _0x3f2885.ANTIVIEWONCE || "indm";
    if (_0x583c4c === "off") {
      return;
    }
    const _0x3f39ce = _0x558d40.user?.id?.split(":")[0] + "@s.whatsapp.net";
    const _0x1cbc30 = _0x583c4c === "indm" ? _0x3f39ce : _0x3e8d71.key.remoteJid;
    const _0x47ac13 = (_0x3e8d71.key.participant || _0x3e8d71.key.remoteJid).split("@")[0].split(":")[0];
    const _0x321f14 = _0x3f2885.BOT_NAME || "Malvin MD";
    const _0x595e99 = {
      ..._0x5008af[_0xb302bb]
    };
    _0x595e99.viewOnce = false;
    const _0x4b525c = _0x595e99;
    const _0x5dd01b = require("path");
    const _0x3b88e4 = require("fs").promises;
    const _0x231316 = _0x5dd01b.join(__dirname, "temp");
    try {
      await _0x3b88e4.mkdir(_0x231316, {
        recursive: true
      });
    } catch (_0x5c44d9) {}
    const _0x2e3334 = "vo_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    let _0x201711 = null;
    try {
      _0x201711 = await _0x558d40.downloadAndSaveMediaMessage(_0x4b525c, _0x5dd01b.join(_0x231316, _0x2e3334));
      const _0x464224 = _0x4b525c.caption || "";
      const _0x44b652 = "👁️ *VIEW ONCE REVEALED*\n\n📤 *From:* @" + _0x47ac13 + "\n" + (_0x464224 ? "📝 *Caption:* " + _0x464224 + "\n" : "") + "\n> _Revealed by " + _0x321f14 + "_";
      const _0x5a8bec = _0x4b525c.mimetype || "";
      let _0x1adf14;
      if (_0xb302bb.includes("image")) {
        const _0x526a60 = {
          url: _0x201711
        };
        const _0x1950ec = {
          image: _0x526a60,
          caption: _0x44b652,
          mimetype: _0x5a8bec,
          mentions: [_0x47ac13 + "@s.whatsapp.net"]
        };
        _0x1adf14 = _0x1950ec;
      } else if (_0xb302bb.includes("video")) {
        const _0x4138d4 = {
          url: _0x201711
        };
        const _0x2ee855 = {
          video: _0x4138d4,
          caption: _0x44b652,
          mimetype: _0x5a8bec,
          mentions: [_0x47ac13 + "@s.whatsapp.net"]
        };
        _0x1adf14 = _0x2ee855;
      } else if (_0xb302bb.includes("audio")) {
        const _0x2514db = {
          url: _0x201711
        };
        _0x1adf14 = {
          audio: _0x2514db,
          ptt: true,
          mimetype: _0x5a8bec || "audio/mp4"
        };
      }
      if (_0x1adf14) {
        await _0x558d40.sendMessage(_0x1cbc30, _0x1adf14);
      }
    } catch (_0x2743ab) {
      console.error("Anti-ViewOnce download/send error:", _0x2743ab.message);
    } finally {
      if (_0x201711) {
        try {
          await require("fs").promises.unlink(_0x201711);
        } catch (_0x4610a) {}
      }
    }
  } catch (_0x1ab6af) {
    console.error("Anti-ViewOnce handler error:", _0x1ab6af.message);
  }
};
const _extractEditContent = _0x483744 => {
  if (!_0x483744 || typeof _0x483744 !== "object") {
    return "";
  }
  const _0x538cd8 = Object.keys(_0x483744)[0];
  if (!_0x538cd8) {
    return "";
  }
  const _0x38eb6d = _0x483744[_0x538cd8];
  if (_0x538cd8 === "conversation") {
    return _0x483744.conversation || "";
  }
  if (_0x538cd8 === "extendedTextMessage") {
    return _0x38eb6d?.text || "";
  }
  if (_0x538cd8 === "imageMessage") {
    return "[Image]" + (_0x38eb6d?.caption ? " " + _0x38eb6d.caption : "");
  }
  if (_0x538cd8 === "videoMessage") {
    return "[Video]" + (_0x38eb6d?.caption ? " " + _0x38eb6d.caption : "");
  }
  if (_0x538cd8 === "audioMessage") {
    return "[Audio/Voice]";
  }
  if (_0x538cd8 === "documentMessage") {
    return ("[Document] " + (_0x38eb6d?.fileName || _0x38eb6d?.caption || "")).trim();
  }
  if (_0x538cd8 === "stickerMessage") {
    return "[Sticker]";
  }
  if (_0x538cd8 === "editedMessage") {
    const _0x2d103f = _0x38eb6d?.message;
    if (_0x2d103f) {
      return _extractEditContent(_0x2d103f);
    } else {
      return "";
    }
  }
  return _0x38eb6d?.text || _0x38eb6d?.caption || "[" + _0x538cd8 + "]";
};
const _extractRawCaption = _0xefe12a => {
  if (!_0xefe12a || typeof _0xefe12a !== "object") {
    return "";
  }
  const _0x4be2d5 = Object.keys(_0xefe12a)[0];
  if (!_0x4be2d5) {
    return "";
  }
  const _0x4ffd50 = _0xefe12a[_0x4be2d5];
  if (_0x4be2d5 === "conversation") {
    return _0xefe12a.conversation || "";
  }
  if (_0x4be2d5 === "extendedTextMessage") {
    return _0x4ffd50?.text || "";
  }
  if (_0x4be2d5 === "editedMessage") {
    const _0x3410cc = _0x4ffd50?.message;
    if (_0x3410cc) {
      return _extractRawCaption(_0x3410cc);
    } else {
      return "";
    }
  }
  return _0x4ffd50?.caption || _0x4ffd50?.text || "";
};
const _resolveLid = async (_0x4d1d44, _0xfc86ea) => {
  if (!_0xfc86ea?.endsWith("@lid")) {
    return _0xfc86ea;
  }
  const {
    getLidMapping: _0x5b5e4e
  } = require("./socket/groupStore");
  const _0x7a3e3c = _0x5b5e4e(_0xfc86ea);
  if (_0x7a3e3c) {
    return _0x7a3e3c;
  }
  try {
    const _0x52cd1b = await _0x4d1d44.getJidFromLid(_0xfc86ea);
    if (_0x52cd1b) {
      return _0x52cd1b;
    }
  } catch (_0x396c18) {}
  return _0xfc86ea;
};
const MalvinAntiEdit = async (_0x38e76e, _0x2d1f85, _0x4c190d) => {
  try {
    const _0x5252f4 = await getAllSettings();
    const _0x4f9376 = _0x5252f4.ANTI_EDIT || "indm";
    if (_0x4f9376 === "false" || _0x4f9376 === "off") {
      return;
    }
    const {
      key: _0x3b5f88,
      update: _0x721b7b
    } = _0x2d1f85;
    if (!_0x3b5f88 || !_0x721b7b?.message) {
      return;
    }
    if (_0x3b5f88.fromMe) {
      return;
    }
    if (_0x3b5f88.remoteJid === "status@broadcast") {
      return;
    }
    const _0x12f67d = _0x3b5f88.remoteJid;
    const _0x80b381 = _0x3b5f88.id;
    const {
      getGroupMetadata: _0x3b0c23
    } = require("./socket/groupStore");
    const _0x5d056e = await _resolveLid(_0x38e76e, _0x12f67d);
    const _0x4fabd5 = _0x5d056e?.endsWith("@g.us") || _0x12f67d?.endsWith("@g.us");
    const _0x3ff942 = _0x721b7b.message;
    const _0x2e71d7 = _extractEditContent(_0x3ff942);
    if (!_0x2e71d7) {
      return;
    }
    const _0x1e5a00 = ["imageMessage", "videoMessage", "documentMessage"];
    let _0x3bb9c3 = "N/A";
    let _0x37d92e = null;
    let _0x655a91 = null;
    let _0x97ec73 = null;
    let _0x1cff6f = null;
    let _0x5e8f97 = null;
    if (_0x4c190d) {
      const _0x14391b = _0x4c190d(_0x12f67d, _0x80b381);
      if (_0x14391b?.message) {
        _0x97ec73 = Object.keys(_0x14391b.message)[0];
        _0x1cff6f = _0x14391b.message[_0x97ec73];
        _0x3bb9c3 = _extractEditContent(_0x14391b.message) || "N/A";
        if (_0x1e5a00.includes(_0x97ec73)) {
          _0x655a91 = _0x14391b;
        }
      }
      if (_0x14391b?.originalPushName) {
        _0x37d92e = _0x14391b.originalPushName;
      }
      if (_0x14391b?.originalSender && !_0x14391b.originalSender.endsWith("@lid")) {
        _0x5e8f97 = _0x14391b.originalSender;
      }
    }
    let _0x1cd7a2 = _0x5e8f97 || (_0x3b5f88.participantPn && !_0x3b5f88.participantPn.endsWith("@lid") ? _0x3b5f88.participantPn : null) || _0x3b5f88.participant || (_0x4fabd5 ? null : _0x5d056e);
    _0x1cd7a2 = await _resolveLid(_0x38e76e, _0x1cd7a2);
    const _0x33dfaf = _0x1cd7a2 && !_0x1cd7a2.endsWith("@lid") ? _0x1cd7a2.split("@")[0] : _0x5d056e?.split("@")[0] || "Unknown";
    const _0xff31ce = _0x5252f4.FOOTER || "";
    const _0x5bcc1e = _0x5252f4.TIME_ZONE || "Africa/Harare";
    let _0x97b66e = _0x4fabd5 ? _0x5d056e : "DM";
    if (_0x4fabd5) {
      try {
        const _0x1f6017 = await _0x3b0c23(_0x38e76e, _0x5d056e);
        _0x97b66e = _0x1f6017?.subject || _0x5d056e;
      } catch (_0x3713a9) {}
    }
    const _0x521a10 = formatTime(Date.now(), _0x5bcc1e);
    const _0x7deb2f = formatDate(Date.now(), _0x5bcc1e);
    const _0x58fd46 = _0x1cd7a2 && !_0x1cd7a2.endsWith("@lid") ? [_0x1cd7a2] : [];
    const _0x4c5bd0 = _0x655a91 ? _extractRawCaption(_0x655a91.message) || "(no caption)" : _0x3bb9c3;
    const _0x42563b = _extractRawCaption(_0x721b7b.message) || _0x2e71d7;
    const _0x1eebe0 = "*✏️ ANTI-EDIT MESSAGE SYSTEM*\n\n" + ("*👤 Edited By:* @" + _0x33dfaf + "\n") + ("*🕑 Time:* " + _0x521a10 + "\n") + ("*📆 Date:* " + _0x7deb2f + "\n") + ("*💬 Chat:* " + _0x97b66e + "\n\n") + ("*📄 Original " + (_0x655a91 ? "Caption" : "Message") + ":* " + _0x4c5bd0 + "\n") + ("*📝 Edited To:* " + _0x42563b + "\n\n") + ("> *" + _0xff31ce + "*");
    const _0xfd83e = async _0xad40aa => {
      if (!_0xad40aa) {
        return;
      }
      if (_0x655a91) {
        try {
          const {
            downloadMediaMessage: _0x105310
          } = require("mrxd-baileys");
          const _0x4282cd = await _0x105310(_0x655a91, "buffer", {});
          if (_0x97ec73 === "imageMessage") {
            const _0x30062c = {
              image: _0x4282cd,
              caption: _0x1eebe0,
              mentions: _0x58fd46
            };
            await _0x38e76e.sendMessage(_0xad40aa, _0x30062c);
          } else if (_0x97ec73 === "videoMessage") {
            const _0x37119b = {
              video: _0x4282cd,
              caption: _0x1eebe0,
              mentions: _0x58fd46
            };
            await _0x38e76e.sendMessage(_0xad40aa, _0x37119b);
          } else if (_0x97ec73 === "documentMessage") {
            const _0x4f4e9c = {
              document: _0x4282cd,
              fileName: _0x1cff6f?.fileName || "document",
              mimetype: _0x1cff6f?.mimetype || "application/octet-stream",
              caption: _0x1eebe0,
              mentions: _0x58fd46
            };
            await _0x38e76e.sendMessage(_0xad40aa, _0x4f4e9c);
          } else {
            const _0x10b49f = {
              text: _0x1eebe0,
              mentions: _0x58fd46
            };
            await _0x38e76e.sendMessage(_0xad40aa, _0x10b49f);
          }
          return;
        } catch (_0x414856) {
          console.error("[ANTI-EDIT] media forward failed:", _0x414856.message);
        }
      }
      const _0x5c202b = {
        text: _0x1eebe0,
        mentions: _0x58fd46
      };
      await _0x38e76e.sendMessage(_0xad40aa, _0x5c202b);
    };
    const _0xe0747b = _0x5d056e && !_0x5d056e.endsWith("@lid") ? _0x5d056e : _0x12f67d;
    const _0x48c713 = _0x38e76e.user?.id ? _0x38e76e.user.id.split(":")[0] + "@s.whatsapp.net" : null;
    if (_0x4f9376 === "indm" || _0x4f9376 === "on") {
      if (_0x48c713) {
        try {
          await _0xfd83e(_0x48c713);
        } catch (_0x123694) {}
      }
    }
    if ((_0x4f9376 === "inchat" || _0x4f9376 === "on") && _0xe0747b) {
      try {
        await _0xfd83e(_0xe0747b);
      } catch (_0x1f8ca4) {}
    }
  } catch (_0x54e1ad) {
    console.error("Anti-edit error:", _0x54e1ad.message);
  }
};
const _0x36c4e9 = {
  logger: logger,
  emojis: emojis,
  MalvinAutoReact: MalvinAutoReact,
  MalvinTechApi: MalvinTechApi,
  MalvinApiKey: MalvinApiKey,
  classifyApiError: classifyApiError,
  MalvinAntiLink: MalvinAntiLink,
  MalvinAntibad: MalvinAntibad,
  MalvinAntiGroupMention: MalvinAntiGroupMention,
  MalvinAutoBio: MalvinAutoBio,
  setupMalvinChatBot: setupMalvinChatBot,
  MalvinAntiDelete: MalvinAntiDelete,
  MalvinAnticall: MalvinAnticall,
  MalvinPresence: MalvinPresence,
  MalvinAntiViewOnce: MalvinAntiViewOnce,
  MalvinAntiEdit: MalvinAntiEdit
};
module.exports = _0x36c4e9;
