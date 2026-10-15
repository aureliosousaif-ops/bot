const { mxd, commands, monospace, formatBytes } = require("../king"),
  fs = require("fs"),
  axios = require("axios"),
  BOT_START_TIME = Date.now(),
  { totalmem: totalMemoryBytes, freemem: freeMemoryBytes } = require("os"),
  moment = require("moment-timezone"),
  more = String.fromCharCode(8206),
  readmore = more.repeat(4001),
  ram = `${formatBytes(freeMemoryBytes)}/${formatBytes(totalMemoryBytes)}`;
const { mrxd } = require('../king/mrxd');
const { sendButtons, sendInteractiveMessage } = require("malvin-btns");
const { fetchPlayer } = require('../king/rpg/db');
const { getRank } = require('../king/rpg/ranks');
const { fancy } = require('../king/fancyFont');
const { getCommandLabel } = require('../king/commandAliases');

const DESCRIPTION_TRANSLATIONS = [
  [/^download /i, "Baixar "],
  [/^downloads? /i, "Baixar "],
  [/^fetch /i, "Consultar "],
  [/^get /i, "Obter "],
  [/^set /i, "Configurar "],
  [/^show /i, "Mostrar "],
  [/^search /i, "Pesquisar "],
  [/^generate /i, "Gerar "],
  [/^create /i, "Criar "],
  [/^convert /i, "Converter "],
  [/^send /i, "Enviar "],
  [/^check /i, "Verificar "],
  [/^view /i, "Visualizar "],
  [/^get bot owner\.?$/i, "Mostrar o contato do dono"],
  [/^request new features\.?$/i, "Solicitar novos recursos"],
  [/^download github repository as zip file$/i, "Baixar repositório do GitHub como arquivo ZIP"],
  [/^set group /i, "Configurar grupo "],
  [/^set full /i, "Configurar "],
  [/^remove /i, "Remover "],
  [/^list /i, "Listar "],
  [/^lookup /i, "Consultar "],
  [/^translate /i, "Traduzir "],
  [/^play /i, "Reproduzir "],
  [/^read /i, "Ler "],
  [/^upload /i, "Enviar "],
  [/^delete /i, "Excluir "],
  [/^kick /i, "Remover "],
  [/^promote /i, "Promover "],
  [/^demote /i, "Rebaixar "],
  [/^tag /i, "Mencionar "],
  [/^enable /i, "Ativar "],
  [/^disable /i, "Desativar "],
  [/\bowner\b/gi, "dono"],
  [/\bprofile picture\b/gi, "foto de perfil"],
  [/\bwithout cropping\b/gi, "sem cortar"],
  [/\bcurrent weather and forecast\b/gi, "clima atual e previsão"],
  [/\bfor a city\b/gi, "para uma cidade"],
  [/facebook videos?/gi, "vídeos do Facebook"],
  [/youtube videos?/gi, "vídeos do YouTube"],
  [/instagram videos?/gi, "vídeos do Instagram"],
  [/tiktok videos?/gi, "vídeos do TikTok"],
  [/github repository/gi, "repositório do GitHub"],
  [/as zip file/gi, "como arquivo ZIP"],
  [/valid (.+) url/gi, "uma URL válida de $1"],
  [/please provide/gi, "Informe"],
  [/video/gi, "vídeo"],
  [/image/gi, "imagem"],
  [/audio/gi, "áudio"],
  [/sticker/gi, "figurinha"],
  [/group/gi, "grupo"],
  [/user/gi, "usuário"],
];

function getCommandDescription(command) {
  const label = getCommandLabel(command?.pattern || "comando");
  let description = String(command?.description || "").trim();
  if (!description) return `Executa o comando ${label}.`;
  for (const [pattern, replacement] of DESCRIPTION_TRANSLATIONS) {
    description = description.replace(pattern, replacement);
  }
  return description.charAt(0).toUpperCase() + description.slice(1).replace(/\.$/, "") + ".";
}

// PING Command
mxd(
  {
    pattern: "ping",
    aliases: ["pi", "p"],
    react: "⚡",
    category: "general",
      description: "Verificar a velocidade de resposta do bot",
  },
  async (from, Malvin, conText) => {
    const {
      react,
      newsletterUrl,
      botFooter,
      botPrefix,
    } = conText;

    const startTime = process.hrtime();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(80 + Math.random() * 420)),
    );
    const elapsed = process.hrtime(startTime);
    const responseTime = Math.floor(elapsed[0] * 1000 + elapsed[1] / 1000000);

    await sendButtons(Malvin, from, {
      title: "",
      text: `↠velocidade ⚡ \`${responseTime}ms\``,
      footer: `> *${botFooter}*`,
      buttons: [
        { id: `${botPrefix}uptime`, text: "⏱️ Tempo ativo" },
      ],
    }, { quoted: mrxd });

    await react("✅");
  },
);

// UPTIME Command
mxd(
  {
    pattern: "uptime",
    aliases: ["up"],
    react: "⏳",
    category: "general",
    description: "Verificar o tempo ativo do bot",
  },
  async (from, Malvin, conText) => {
    const {
      react,
      botFooter,
      botPrefix,
    } = conText;

    const uptimeMs = Date.now() - BOT_START_TIME;
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

    await sendButtons(Malvin, from, {
      title: `${fancy("Velocidade do bot", "mono")}`,
      text: `↠${fancy("Tempo ativo", "mono")} ⏱️ \`${days}${fancy("d", "mono")} ${hours}${fancy("h", "mono")} ${minutes}${fancy("m", "mono")} ${seconds}${fancy("s", "mono")}\``,
      footer: `> *${botFooter}*`,
      buttons: [
        { id: `${botPrefix}ping`, text: `⚡ ${fancy("velocidade", "mono")}` },
      ],
    }, { quoted: mrxd });

    await react("✅");
  },
);

// BOTSTATS Command
mxd(
  {
    pattern: "botstats",
    aliases: ["status", "botinfo"],
    react: "📊",
    category: "general",
    description: "Mostrar as estatísticas completas do bot",
  },
  async (from, Malvin, conText) => {
    const {
      react,
      botFooter,
      botPrefix,
      botName,
    } = conText;

    const startTime = process.hrtime();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(80 + Math.random() * 420)),
    );
    const elapsed = process.hrtime(startTime);
    const ping = Math.floor(elapsed[0] * 1000 + elapsed[1] / 1000000);

    const uptimeMs = Date.now() - BOT_START_TIME;
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

    await sendButtons(Malvin, from, {
      title: "",
      text: `╭══〘〘 *${botName}* 〙〙═⊷\n│↠ ⚡ ${fancy("ping", "smallcaps")}: \`${ping}${fancy("m", "mono")}s\`\n│↠ ⏱️ ${fancy("uptime", "smallcaps")}: \`${days}${fancy("d", "mono")} ${hours}${fancy("h", "mono")} ${minutes}${fancy("m", "mono")} ${seconds}${fancy("s", "mono")}\`\n╰═════════════════⊷`,
      footer: `> *${botFooter}*`,
      buttons: [
        { id: `${botPrefix}ping`, text: `🏓 ${fancy("ping", "mono")}` },
        { id: `${botPrefix}uptime`, text: `⏱️ ${fancy("uptime", "mono")}` },
      ],
    }, { quoted: mrxd });

    await react("✅");
  },
);

// REPORT Command
mxd(
  {
    pattern: "report",
    aliases: ["request"],
    react: "💫",
    description: "Solicitar novos recursos.",
    category: "owner",
  },
  async (from, Malvin, conText) => {
    const { mek, q, sender, react, pushName, botPrefix, isSuperUser, reply } =
      conText;
    const reportedMessages = {};
    const devlopernumber = "6399215379";
    try {
      if (!isSuperUser) return reply("*Comando exclusivo do dono.*");
      if (!q)
        return reply(
          `Exemplo: ${botPrefix}request os comandos de download não estão funcionando`,
        );
      const messageId = mek.key.id;
      if (reportedMessages[messageId]) {
        return reply(
          "Este relatório já foi enviado ao dono. Aguarde uma resposta.",
        );
      }
      reportedMessages[messageId] = true;
      const textt = `*| SOLICITAÇÃO/RELATÓRIO |*`;
      const teks1 = `\n\n*Usuário*: @${sender.split("@")[0]}\n*Solicitação:* ${q}`;
      Malvin.sendMessage(
        devlopernumber + "@s.whatsapp.net",
        {
          text: textt + teks1,
          mentions: [sender],
        },
        {
          quoted: mrxd,
        },
      );
      reply(
        `Obrigado pelo relatório. Ele foi enviado ao dono. Aguarde uma resposta.`,
      );
      await react("✅");
    } catch (e) {
      reply(e);
      console.log(e);
    }
  },
);

// MENU Command principal: lista completa separada por categorias
mxd(
  {
    pattern: "menu2",
    aliases: ["help", "men", "allmenu", "lista-comandos"],
    react: "💙",
      category: "general",
      description: "Menu completo separado por categorias",
      },
      async (from, Malvin, conText) => {
        const {
          sender,
          react,
          pushName,
          botPic,
          botName,
          botFooter,
          botPrefix,
          timeZone,
          reply,
        } = conText;

        try {
          function formatUptime(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= 24 * 60 * 60;
        const hours = Math.floor(seconds / (60 * 60));
        seconds %= 60 * 60;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }

      const now = new Date();
      const date = new Intl.DateTimeFormat("pt-BR", {
        timeZone: timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(now);

      const time = new Intl.DateTimeFormat("pt-BR", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      const uptime = formatUptime(process.uptime());
      const regularCmds = commands.filter((c) => c.pattern && !c.on && !c.dontAddCommandList);
      const bodyCmds = commands.filter((c) => c.pattern && c.on === "body" && !c.dontAddCommandList);
      const totalCommands = regularCmds.length + bodyCmds.length;

      const rpgPlayer = await fetchPlayer(sender).catch(() => null);
      const displayName = rpgPlayer?.username || pushName;
      const { rankName } = rpgPlayer ? getRank(rpgPlayer.level, rpgPlayer.jid) : { rankName: 'Sem classificação' };
      const rpgLevel = rpgPlayer?.level ?? '—';
      const rpgXp = rpgPlayer ? `${rpgPlayer.exp.toLocaleString()}` : '—';
      const rpgAlign = rpgPlayer?.alignment ?? 'Neutro';
      const rpgBlood = rpgPlayer?.bloodline ?? '—';
      const alignEmoji = { Light: '☀️', Chaos: '🌑', Dark: '🌒', Neutral: '⚖️' }[rpgAlign] || '⚖️';

      const categoryEmojis = {
        ai: "🤖",
        "ai image": "🖌️",
        "ai-image": "🖌️",
        aiimage: "🖌️",
        anime: "🎌",
        canvas: "🎨",
        combat: "⚔️",
        converter: "🔄",
        downloader: "⬇️",
        economy: "💰",
        exploration: "🗺️",
        faker: "🎭",
        fun: "🎉",
        gambling: "🎰",
        game: "🎮",
        gathering: "🌾",
        general: "📜",
        group: "👥",
        info: "ℹ️",
        notes: "📝",
        nsfw: "🔞",
        origin: "🧬",
        owner: "👑",
        progression: "📈",
        random: "🎲",
        reaction: "😊",
        rpg: "🏆",
        search: "🔍",
        social: "💬",
        sports: "⚽",
        stalk: "👀",
        sticker: "🏷️",
        survival: "🍖",
        tools: "🔧",
        uploader: "☁️",
        utility: "⚙️",
      };

      const categoryLabels = {
        ai: "Inteligência Artificial", "ai image": "Imagens com IA", "ai-image": "Imagens com IA", aiimage: "Imagens com IA",
        anime: "Anime", canvas: "Artes e canvas", combat: "Combate", converter: "Conversores", downloader: "Downloads",
        economy: "Economia", exploration: "Exploração", faker: "Geradores", fun: "Diversão", gambling: "Apostas e sorte",
        game: "Jogos", gathering: "Coleta", general: "Geral", group: "Grupos", info: "Informações", notes: "Anotações",
        nsfw: "Conteúdo adulto", origin: "Origem", owner: "Dono", progression: "Progressão", random: "Aleatório",
        reaction: "Reações", rpg: "RPG", search: "Pesquisa", social: "Social", sports: "Esportes", stalk: "Consultas",
        sticker: "Figurinhas", survival: "Sobrevivência", tools: "Ferramentas", uploader: "Envio de arquivos", utility: "Utilidades"
      };
      const displayCategory = (category) => categoryLabels[category.toLowerCase()] || category;

      const categorized = commands.reduce((menu, cmd) => {
        if (cmd.pattern && !cmd.dontAddCommandList) {
          const category = cmd.category || "general";
          if (!menu[category]) menu[category] = [];
          menu[category].push({
            pattern: getCommandLabel(cmd.pattern),
            isBody: cmd.on === "body",
          });
        }
        return menu;
      }, {});

      const sortedCategories = Object.keys(categorized).sort();
      const rows = [];
      
      for (const cat of sortedCategories) {
        const cmdCount = categorized[cat].length;
        const emoji = categoryEmojis[cat.toLowerCase()] || "📁";
        rows.push({
          id: `menu_${cat}`,
          title: `${emoji} ${displayCategory(cat).toUpperCase()}`,
          description: `${cmdCount} comando(s)`,
        });
      }

      const sections = [];
      const chunkSize = 10;
      for (let i = 0; i < rows.length; i += chunkSize) {
        sections.push({
          title: i === 0 ? "🌸 CATEGORIAS" : "📁 MAIS",
          rows: rows.slice(i, i + chunkSize),
        });
      }

      let menuText = `╭══〘〘 \`🤖 ${monospace(botName)}\` 〙〙═⊷
│↠👤 ${fancy("usuário", "smallcaps")}: ${monospace(displayName)}
│↠🏅 ${fancy("classificação", "smallcaps")}: ${monospace(rankName)}  
│↠⭐ Lv: ${rpgLevel}
│↠✨ x${fancy("p", "smallcaps")}: ${monospace(rpgXp)}
│↠${alignEmoji} ${fancy("align", "smallcaps")}: ${monospace(rpgAlign)}
│↠🩸${fancy("bloodline", "smallcaps")}: ${monospace(rpgBlood)}
├───────────
│↠✒️ ${fancy("prefi", "smallcaps")}x: [ ${monospace(botPrefix)} ]
│↠🧩 ${fancy("comando", "smallcaps")}s: ${monospace(totalCommands.toString())}
│↠⏱️ ${fancy("uptime", "smallcaps")}: ${monospace(uptime)}
      │↠⏰ ${fancy("hora", "smallcaps")}: ${monospace(time)}
      │↠📅 ${fancy("data", "smallcaps")}: ${monospace(date)}
      ╰═════════════════⊷

📌 *Comandos organizados por categoria abaixo*
`;

      const organizedMenu = sortedCategories.map(category => {
        const emoji = categoryEmojis[category.toLowerCase()] || "📁";
        const title = displayCategory(category).toUpperCase();
        const lines = categorized[category].map(command => {
          const prefix = command.isBody ? "" : botPrefix;
          const original = commands.find(item => item.pattern === command.pattern || getCommandLabel(item.pattern) === command.pattern);
          return `│ 💗 ${prefix}${command.pattern}\n│    ↳ ${getCommandDescription(original || { pattern: command.pattern })}`;
        });
        return `\n╭─── ${emoji} *${title}* ───╮\n${lines.join("\n│\n")}\n╰────────────────────╯`;
      }).join("\n");

      menuText += organizedMenu + `\n\n💗 *Sousinha Bot — comandos separados e explicados*`;

const sendWithDropdown = async (title, text) => {
  await Malvin.sendMessage(from, { text: `${text}\n\n${botFooter}` }, { quoted: mrxd });
  if (botPic) {
    try {
      await Malvin.sendMessage(from, {
        image: { url: botPic },
        caption: `💗 ${botName}\nMenu acima com os comandos organizados.`
      }, { quoted: mrxd });
    } catch (photoError) {
      console.warn("[MENU] Foto indisponível; menu textual mantido:", photoError.message);
    }
  }
};

      await sendWithDropdown("📋 MENU PRINCIPAL", menuText);
      await react("📋");

    } catch (e) {
      console.error("Menu Error:", e);
      reply(`❌ Erro: ${e.message}`);
    }
  },
);

// MENU legado interativo
mxd(
  {
    pattern: "menu",
    aliases: ["help2", "men2", "categorias"],
    react: "🪀",
    category: "general",
    description: "Menu completo separado por categorias",
  },
  async (from, Malvin, conText) => {
    const {
      mek,
      sender,
      react,
      pushName,
      botPic,
      botMode,
      botVersion,
      botName,
      botFooter,
      timeZone,
      botPrefix,
      newsletterJid,
      newsletterUrl,
      reply,
      malvinRepo,
      ownerName,
    } = conText;
    try {
      const totalUsers = "—";

      function formatUptime(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= 24 * 60 * 60;
        const hours = Math.floor(seconds / (60 * 60));
        seconds %= 60 * 60;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }

      const now = new Date();
      const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(now);

      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);

      const uptime = formatUptime(process.uptime());
      const regularCmds = commands.filter((c) => c.pattern && !c.on && !c.dontAddCommandList);
      const bodyCmds = commands.filter((c) => c.pattern && c.on === "body" && !c.dontAddCommandList);
      const totalCommands = regularCmds.length + bodyCmds.length;

      const rpgPlayer = await fetchPlayer(sender).catch(() => null);
      const displayName = rpgPlayer?.username || pushName;
      const { rankName } = rpgPlayer ? getRank(rpgPlayer.level, rpgPlayer.jid) : { rankName: 'Sem classificação' };
      const rpgLevel    = rpgPlayer?.level ?? '—';
      const rpgXp       = rpgPlayer ? `${rpgPlayer.exp.toLocaleString()}` : '—';
      const rpgAlign    = rpgPlayer?.alignment ?? 'Neutro';
      const rpgBlood    = rpgPlayer?.bloodline ?? '—';
      const alignEmoji  = { Light: '☀️', Chaos: '🌑', Dark: '🌒', Neutral: '⚖️' }[rpgAlign] || '⚖️';

      const categorized = commands.reduce((menu, mxd) => {
        if (mxd.pattern && !mxd.dontAddCommandList) {
          if (!menu[mxd.category]) menu[mxd.category] = [];
          menu[mxd.category].push({
            pattern: getCommandLabel(mxd.pattern),
            isBody: mxd.on === "body",
          });
        }
        return menu;
      }, {});

      const sortedCategories = Object.keys(categorized).sort((a, b) =>
        a.localeCompare(b),
      );
      for (const cat of sortedCategories) {
        categorized[cat].sort((a, b) => a.pattern.localeCompare(b.pattern));
      }

      let header = `╭══〘〘 \`🤖 ${monospace(botName)}\` 〙〙═⊷
│↠👤 ${fancy("usuário", "smallcaps")}: ${monospace(displayName)}
│↠🏅 ${fancy("classificação", "smallcaps")}: ${monospace(rankName)}  
│↠⭐ Lv.${rpgLevel}
│↠✨ x${fancy("p", "smallcaps")}: ${monospace(rpgXp)}
│↠${alignEmoji} ${fancy("align", "smallcaps")}: ${monospace(rpgAlign)}
│↠🩸${fancy("bloodline", "smallcaps")}: ${monospace(rpgBlood)}
├───────────
│↠✒️ ${fancy("prefi", "smallcaps")}x: [ ${monospace(botPrefix)} ]
│↠🧩 ${fancy("comando", "smallcaps")}s: ${monospace(totalCommands.toString())}
│↠⏱️ ${fancy("uptime", "smallcaps")}: ${monospace(uptime)}
│↠⏰ ${fancy("hora", "smallcaps")}: ${monospace(time)}
│↠📅 ${fancy("data", "smallcaps")}: ${monospace(date)}
│↠👥 ${fancy("usuário", "smallcaps")}s: ${monospace(totalUsers.toString())}
╰═══════════════⊷\n${readmore}\n`;

      const formatCategory = (category, mxds) => {
        const categoryEmojis = {
          "ai": "🤖",
          "converter": "🔄",
          "downloader": "⬇️",
          "game": "🎮",
          "general": "📜",
          "group": "👥",
          "logo": "🎨",
          "notes": "📝",
          "owner": "👑",
          "religion": "⛪",
          "search": "🔍",
          "sports": "⚽",
          "tempmail": "📧",
          "tools": "🔧",
          "uploader": "☁️",
          "utility": "⚙️",
          "rpg":        "⚔️",
          "combat":     "⚔️",
          "gathering":  "🌾",
          "exploration":"🗺️",
          "survival":   "🍖",
          "progression":"📈",
          "gambling":   "🎰",
          "economy":    "💰",
          "social":     "👥",
          "origin":     "🧬",
          "world":      "🌍",
          "roles":      "🎭",
          "pet":        "🐾",
          "quests":     "📋",
          "owner":      "👑"
        };
        
        const emoji = categoryEmojis[category.toLowerCase()] || "📁";
        const title = `╭─「 ${emoji} *${category.toUpperCase()}* 」\n`;
        const body = mxds
          .map((mxd) => {
            const prefix = mxd.isBody ? "" : botPrefix;
            const originalCommand = commands.find((command) => command.pattern === mxd.pattern || getCommandLabel(command.pattern) === mxd.pattern);
            return `│  ◈  \`${prefix + mxd.pattern}\`\n│     _${getCommandDescription(originalCommand || { pattern: mxd.pattern })}_`;
          })
          .join("\n");
        const footer = `╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`;
        return `${title}${body}\n${footer}`;
      };

      let menu = header;
      for (const category of sortedCategories) {
        menu += formatCategory(category, categorized[category]) + "\n";
      }

      let channelUrl = newsletterUrl;
      if (!channelUrl && newsletterJid) {
        const channelId = newsletterJid.split('@')[0];
        channelUrl = `https://whatsapp.com/channel/${channelId}`;
      }

      await Malvin.sendMessage(from, {
        text: `${menu.trim()}\n\n${botFooter}`,
      }, { quoted: mrxd });

      await react("✅");
    } catch (e) {
      console.error(e);
      reply(`${e}`);
    }
  },
);

// MENU3 Command - Numbered category selection
mxd(
  {
    pattern: "menu3",
    aliases: ["menu3", "help3", "men3"],
    react: "🎯",
    category: "general",
    description: "Menu with numbered categories (reply with number)",
  },
  async (from, Malvin, conText) => {
    const {
      sender,
      react,
      pushName,
      botPic,
      botName,
      botFooter,
      botMode,
      botVersion,
      botPrefix,
      timeZone,
      malvinRepo,
      newsletterJid,
      newsletterUrl,
      reply,
      ownerName,
    } = conText;

    try {
      // Fetch GitHub forks
      const fetchGitHubForks = async () => {
        try {
          const response = await axios.get(`https://api.github.com/repos/${malvinRepo}`);
          return response.data.forks_count || 'N/A';
        } catch (e) {
          return 'N/A';
        }
      };

      const totalUsers = await fetchGitHubForks();

      function formatUptime(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= 24 * 60 * 60;
        const hours = Math.floor(seconds / (60 * 60));
        seconds %= 60 * 60;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }

      const now = new Date();
      const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(now);

      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);

      const uptime = formatUptime(process.uptime());
      const regularCmds = commands.filter((c) => c.pattern && !c.on && !c.dontAddCommandList);
      const bodyCmds = commands.filter((c) => c.pattern && c.on === "body" && !c.dontAddCommandList);
      const totalCommands = regularCmds.length + bodyCmds.length;

      // RPG Player Data
      const rpgPlayer = await fetchPlayer(sender).catch(() => null);
      const displayName = rpgPlayer?.username || pushName;
      const { rankName } = rpgPlayer ? getRank(rpgPlayer.level, rpgPlayer.jid) : { rankName: 'Sem classificação' };

      // Category mapping for numbers 1-10
      const categoryMap = {
        "1": { name: `${fancy("IA e chat", "smallcaps")}s`, emoji: "🤖", categories: ["ai", "aiimage"] },
        "2": { name: `${fancy("gerenciador de downloads", "smallcaps")}`, emoji: "📥", categories: ["downloader"] },
        "3": { name: `${fancy("diversão e jogos", "smallcaps")}s`, emoji: "🎮", categories: ["fun", "game", "gambling", "rpg", "combat"] },
        "4": { name: `${fancy("gerenciamento de grupos", "smallcaps")}`, emoji: "💬", categories: ["group"] },
        "5": { name: `${fancy("utilidades e ferramentas", "smallcaps")}s`, emoji: "🛠️", categories: ["utility", "tools", "converter", "uploader"] },
        "6": { name: `${fancy("mídia e figurinhas", "smallcaps")}s`, emoji: "🎨", categories: ["sticker", "media", "canvas", "reaction"] },
        "7": { name: `${fancy("configurações do bot", "smallcaps")}s`, emoji: "⚙️", categories: ["owner"] },
        "8": { name: `${fancy("comandos do dono", "smallcaps")}s`, emoji: "👑", categories: ["origin"] },
        "9": { name: `${fancy("texto e efeitos", "smallcaps")}s`, emoji: "📝", categories: ["notes", "faker"] },
        "10": { name: `${fancy("imagens e filtros", "smallcaps")}s`, emoji: "🖼️", categories: ["logo", "search", "stalk"] }
      };

      // Collect all commands by category
      const categorized = commands.reduce((menu, cmd) => {
        if (cmd.pattern && !cmd.dontAddCommandList) {
          const category = cmd.category || "general";
          if (!menu[category]) menu[category] = [];
          menu[category].push({
            pattern: getCommandLabel(cmd.pattern),
            isBody: cmd.on === "body",
          });
        }
        return menu;
      }, {});

      // menu 
      const menuText = `╭─➣ *🤖 ${botName}*
│↠👤 ${fancy("dono", "smallcaps")}: ${ownerName}
│↠👋 ${fancy("usuário", "smallcaps")}: ${displayName}
│↠🏅 ${fancy("classificação", "smallcaps")}: ${rankName}
│↠⏰ ${fancy("hora", "smallcaps")}: ${time}
│↠📅 ${fancy("data", "smallcaps")}: ${date}
│↠🌍 ${fancy("modo", "smallcaps")}: ${botMode}
│↠✒️ ${fancy("prefi", "smallcaps")}x: [ ${botPrefix} ]
│↠🧩 ${fancy("comando", "smallcaps")}s: ${totalCommands}
│↠🚀 ${fancy("versão", "smallcaps")}: ${botVersion}
│↠👥 ${fancy("usuário", "smallcaps")}s: ${totalUsers}
│↠✍️ ${fancy("autor", "smallcaps")}: ${fancy("MR XDKING", "mono")}
╰──────────➣

╭─「 📁 ${fancy("lista de categorias", "smallcaps")} 」
│ ➊  🤖 ${fancy("IA e chat", "smallcaps")}s
│ ➋  📥 ${fancy("gerenciador de downloads", "smallcaps")}
│ ➌  🎮 ${fancy("diversão e jogos", "smallcaps")}s
│ ➍  💬 ${fancy("gerenciamento de grupos", "smallcaps")}
│ ➎  🛠️ ${fancy("utilidades e ferramentas", "smallcaps")}s
│ ➏  🎨 ${fancy("mídia e figurinhas", "smallcaps")}s
│ ➐  ⚙️ ${fancy("configurações do bot", "smallcaps")}s
│ ➑  👑 ${fancy("comandos do dono", "smallcaps")}s
│ ➒  📝 ${fancy("texto e efeitos", "smallcaps")}s
│ ➓  🖼️ ${fancy("imagens e filtros", "smallcaps")}s
╰──────➣➣

💡 *Responda com um número de 1 a 10 para ver os comandos*`;

      // Send menu
      await sendButtons(Malvin, from, {
        title: `📋 ${fancy("menu", "smallcaps")} 3`,
        text: menuText,
        footer: botFooter,
        image: { url: botPic },
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "📢 Canal",
              url: newsletterUrl,
            }),
          },
        ],
      }, { quoted: mrxd });

      await react("🎯");

      // Handle number replies
      const handleNumberReply = async (event) => {
        const messageData = event.messages[0];
        if (!messageData?.message) return;

        const isFromSameChat = messageData.key?.remoteJid === from;
        if (!isFromSameChat) return;

        // Get the reply text
        let replyText = messageData.message?.conversation || 
                        messageData.message?.extendedTextMessage?.text;
        
        if (!replyText) return;

        // Check if reply is a number 1-10
        const num = replyText.trim();
        if (!categoryMap[num]) return;

        const selected = categoryMap[num];
        const emoji = selected.emoji;
        const categoryName = selected.name;
        
        // Collect all commands from the categories in this group
        let allCmds = [];
        for (const cat of selected.categories) {
          if (categorized[cat]) {
            allCmds = [...allCmds, ...categorized[cat]];
          }
        }

        if (allCmds.length === 0) {
          await Malvin.sendMessage(from, { text: `❌ Nenhum comando encontrado para ${categoryName}` }, { quoted: mrxd });
          return;
        }

        // Build command list
        let cmdText = `╭─「 ${emoji} *${categoryName}* 」\n`;
        cmdText += `│  📝 *${allCmds.length} comandos*\n`;
        cmdText += `├───────────⊷\n`;
        
        allCmds.slice(0, 40).forEach((cmd, idx) => {
          const prefix = cmd.isBody ? "" : botPrefix;
          cmdText += `│  ${idx + 1}. \`${prefix}${cmd.pattern}\`\n`;
        });
        
        if (allCmds.length > 40) {
          cmdText += `│\n│  ⚠️ *+${allCmds.length - 40} mais*\n`;
        }
        cmdText += `╰────────────⊷\n`;
        cmdText += `\n> ${fancy("POWERED BY MR XD", "mono")}`;

        await Malvin.sendMessage(from, { text: cmdText }, { quoted: mrxd });
      };

      Malvin.ev.on("messages.upsert", handleNumberReply);
      
      setTimeout(() => {
        Malvin.ev.off("messages.upsert", handleNumberReply);
      }, 120000);

    } catch (e) {
      console.error("Menu3 Error:", e);
      reply(`❌ Error: ${e.message}`);
    }
  },
);

// MENU4 - Category selection menu
mxd(
  {
    pattern: "menu4",
    aliases: ["menu4", "help4", "men4"],
    react: "⌨️",
    category: "general",
    description: "Shows category list - then use .categorymenu",
  },
  async (from, Malvin, conText) => {
    const {
      sender,
      react,
      pushName,
      botPic,
      botName,
      botFooter,
      botPrefix,
      timeZone,
      malvinRepo,
      reply,
      mrxd,
      ownerName,
      newsletterUrl,
    } = conText;

    try {
      const fetchGitHubForks = async () => {
        try {
          const response = await axios.get(`https://api.github.com/repos/${malvinRepo}`);
          return response.data.forks_count || 'N/A';
        } catch (e) {
          return 'N/A';
        }
      };

      const totalUsers = await fetchGitHubForks();

      function formatUptime(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= 24 * 60 * 60;
        const hours = Math.floor(seconds / (60 * 60));
        seconds %= 60 * 60;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }

      const now = new Date();
      const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(now);

      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);

      const regularCmds = commands.filter((c) => c.pattern && !c.on && !c.dontAddCommandList);
      const bodyCmds = commands.filter((c) => c.pattern && c.on === "body" && !c.dontAddCommandList);
      const totalCommands = regularCmds.length + bodyCmds.length;

      const rpgPlayer = await fetchPlayer(sender).catch(() => null);
      const displayName = rpgPlayer?.username || pushName;
      const { rankName } = rpgPlayer ? getRank(rpgPlayer.level, rpgPlayer.jid) : { rankName: 'Sem classificação' };

      const menuText = `╭─➣ *🤖 ${botName}*
│↠👤 ${fancy("dono", "smallcaps")}: ${ownerName}
│↠👋 ${fancy("usuário", "smallcaps")}: ${displayName}
│↠🏅 ${fancy("classificação", "smallcaps")}: ${rankName}
│↠⏰ ${fancy("hora", "smallcaps")}: ${time}
│↠📅 ${fancy("data", "smallcaps")}: ${date}
│↠✒️ ${fancy("prefi", "smallcaps")}x: [ ${botPrefix} ]
│↠🧩 ${fancy("comando", "smallcaps")}s: ${totalCommands}
│↠👥 ${fancy("usuário", "smallcaps")}s: ${totalUsers}
╰──────────➣

╭─「 📁 ${fancy("menu de categorias", "smallcaps")}s 」
│ ➊  🤖 .aimenu
│ ➋  📥 .downloadermenu
│ ➌  🎮 .funggmenu
│ ➍  💬 .groupmenu
│ ➎  🛠️ .toolsmenu
│ ➏  🎨 .mediamenu
│ ➐  ⚙️ .ownersmenu
│ ➑  👑 .originmenu
│ ➒  💰 .goldmenu
│ ➓  📝 .textmenu
│ ⓫  🖼️ .imagemenu
╰──────➣➣

💡 *Digite um comando acima para ver os comandos*
📌 *Exemplo:* .goldmenu, .funggmenu
`;

      await sendButtons(Malvin, from, {
        text: menuText,
        footer: botFooter,
        image: { url: botPic },
        buttons: [
          { id: `${botPrefix}menu`, text: `💙 ${fancy("menu", "smallcaps")}` },
          { id: `${botPrefix}menu2`, text: `🩵 ${fancy("menu", "smallcaps")} 2` },
          { id: `${botPrefix}menu3`, text: `💚 ${fancy("menu", "smallcaps")} 3` },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: `📢 ${fancy("canal", "smallcaps")}`,
              url: newsletterUrl,
            }),
          },
        ],
      }, { quoted: mrxd });

      await react("⌨️");

    } catch (e) {
      console.error("Menu4 Error:", e);
      reply(`❌ Error: ${e.message}`);
    }
  },
);

// ==================== CATEGORY MENU COMMANDS WITH NAVIGATION ====================

// Helper function to get category commands
const getCategoryCommands = (categoryNames) => {
  const categorized = commands.reduce((menu, cmd) => {
    if (cmd.pattern && !cmd.dontAddCommandList) {
      const category = cmd.category || "general";
      if (!menu[category]) menu[category] = [];
      menu[category].push({
        pattern: getCommandLabel(cmd.pattern),
        isBody: cmd.on === "body",
      });
    }
    return menu;
  }, {});

  let allCmds = [];
  for (const cat of categoryNames) {
    if (categorized[cat]) {
      allCmds = [...allCmds, ...categorized[cat]];
    }
  }
  return allCmds;
};

// Helper function to send category response with navigation buttons
const sendCategoryResponse = async (Malvin, from, title, emoji, cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd) => {
  let text = `╭─「 ${emoji} *${title}* 」\n`;
  text += `│  📝 *${cmds.length} comandos*\n`;
  text += `├──────────⊷\n`;
  
  cmds.slice(0, 50).forEach((cmd, idx) => {
    const prefix = cmd.isBody ? "" : botPrefix;
    text += `│  ${idx + 1}. \`${prefix}${cmd.pattern}\`\n`;
  });
  
  if (cmds.length > 50) {
    text += `│\n│  ⚠️ *+${cmds.length - 50} mais*\n`;
  }
  text += `╰──────────⊷\n`;
  text += `\n💡 Toque em um botão abaixo para ver outra categoria`;

  await sendButtons(Malvin, from, {
    text: text,
    footer: botFooter,
    image: { url: botPic },
    buttons: [
      { id: `${botPrefix}aimenu`, text: "🤖 AI" },
      { id: `${botPrefix}downloadermenu`, text: `📥 ${fancy("baixar", "smallcaps")}` },
      { id: `${botPrefix}funggmenu`, text: `🎮 ${fancy("diversão", "smallcaps")}` },
      { id: `${botPrefix}groupmenu`, text: `💬 ${fancy("grupo", "smallcaps")}s` },
      { id: `${botPrefix}toolsmenu`, text: `🛠️ ${fancy("ferramenta", "smallcaps")}s` },
      { id: `${botPrefix}mediamenu`, text: `🎨 ${fancy("mídia", "smallcaps")}` },
      { id: `${botPrefix}ownersmenu`, text: `⚙️ ${fancy("dono", "smallcaps")}` },
      { id: `${botPrefix}originmenu`, text: `👑 ${fancy("origem", "smallcaps")}` },
      { id: `${botPrefix}textmenu`, text: `📝 ${fancy("texto", "smallcaps")}` },
      { id: `${botPrefix}imagemenu`, text: `🖼️ ${fancy("imagem", "smallcaps")}` },
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "📢 Canal",
          url: newsletterUrl,
        }),
      },
    ],
  }, { quoted: mrxd });
};

// 1. .aimenu - AI & AI IMAGE commands combined
mxd(
  {
    pattern: "aimenu",
    aliases: ["aimenu"],
    react: "🤖",
    category: "menu",
    description: "Mostrar todos os comandos de IA e imagens com IA",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["ai", "aiimage"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de IA encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE IA E IMAGENS COM IA", "🤖", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// Menu Gold — economia, apostas, RPG e jogos que dão recompensa
mxd(
  {
    pattern: "goldmenu",
    aliases: ["gold", "dinheiromenu", "economiamenu"],
    react: "💰",
    category: "menu",
    description: "Mostrar comandos de Gold, economia, apostas e recompensas",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["gold", "gambling", "rpg", "game"]);
    if (cmds.length === 0) return reply("❌ Nenhum comando de Gold encontrado");
    await sendCategoryResponse(Malvin, from, "MENU GOLD — ECONOMIA E RECOMPENSAS", "💰", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 2. .downloadermenu - Comandos de download
mxd(
  {
    pattern: "downloadermenu",
    aliases: ["downloadermenu"],
    react: "📥",
    category: "menu",
    description: "Mostrar todos os comandos de download",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["downloader"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de download encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE DOWNLOAD", "📥", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 3. .funggmenu - Fun & Games commands
mxd(
  {
    pattern: "funggmenu",
    aliases: ["funggmenu"],
    react: "🎮",
    category: "menu",
    description: "Mostrar todos os comandos de diversão e jogos",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["fun", "game", "gambling", "rpg", "combat"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de diversão e jogos encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE DIVERSÃO E JOGOS", "🎮", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 4. .groupmenu - Group Management commands
mxd(
  {
    pattern: "groupmenu",
    aliases: ["groupmenu"],
    react: "💬",
    category: "menu",
    description: "Mostrar todos os comandos de gerenciamento de grupos",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["group"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de gerenciamento de grupos encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE GERENCIAMENTO DE GRUPOS", "💬", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 5. .toolsmenu - Utilities & Tools commands
mxd(
  {
    pattern: "toolsmenu",
    aliases: ["toolsmenu"],
    react: "🛠️",
    category: "menu",
    description: "Mostrar todos os comandos de utilidades e ferramentas",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["utility", "tools", "converter", "uploader"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de utilidades e ferramentas encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE UTILIDADES E FERRAMENTAS", "🛠️", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 6. .mediamenu - Media & Stickers commands
mxd(
  {
    pattern: "mediamenu",
    aliases: ["mediamenu"],
    react: "🎨",
    category: "menu",
    description: "Mostrar todos os comandos de mídia e figurinhas",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["sticker", "media", "canvas", "reaction"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de mídia e figurinhas encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE MÍDIA E FIGURINHAS", "🎨", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 7. .ownersmenu - Bot Settings commands
mxd(
  {
    pattern: "ownersmenu",
    aliases: ["ownersmenu"],
    react: "⚙️",
    category: "menu",
    description: "Mostrar todos os comandos de configurações do bot",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd, sender } = conText;
    const ownerSender = String(sender || '').split('@')[0].split(':')[0].replace(/\D/g, '');
    if (ownerSender !== '5563999215379' && !ownerSender.endsWith('5563999215379')) return reply("❌ Menu exclusivo do dono. Contato oficial: 5563999215379");
    const cmds = getCategoryCommands(["owner"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de configurações do bot encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE CONFIGURAÇÕES DO BOT", "⚙️", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 8. .originmenu - Owner commands
mxd(
  {
    pattern: "originmenu",
    aliases: ["originmenu"],
    react: "👑",
    category: "menu",
    description: "Mostrar todos os comandos do dono",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd, sender } = conText;
    const ownerSender = String(sender || '').split('@')[0].split(':')[0].replace(/\D/g, '');
    if (ownerSender !== '5563999215379' && !ownerSender.endsWith('5563999215379')) return reply("❌ Menu exclusivo do dono. Contato oficial: 5563999215379");
    const cmds = getCategoryCommands(["origin"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando do dono encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DO DONO", "👑", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 9. .textmenu - Text & Effects commands
mxd(
  {
    pattern: "textmenu",
    aliases: ["textmenu"],
    react: "📝",
    category: "menu",
    description: "Mostrar todos os comandos de texto e efeitos",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["notes", "faker"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de texto e efeitos encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE TEXTO E EFEITOS", "📝", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// 10. .imagemenu - Image & Filters commands
mxd(
  {
    pattern: "imagemenu",
    aliases: ["imagemenu"],
    react: "🖼️",
    category: "menu",
    description: "Mostrar todos os comandos de imagens e filtros",
  },
  async (from, Malvin, conText) => {
    const { reply, botPrefix, botFooter, botPic, newsletterUrl, mrxd } = conText;
    const cmds = getCategoryCommands(["logo", "search", "stalk"]);
    
    if (cmds.length === 0) {
      return reply("❌ Nenhum comando de imagens e filtros encontrado");
    }
    
    await sendCategoryResponse(Malvin, from, "COMANDOS DE IMAGENS E FILTROS", "🖼️", cmds, botPrefix, botFooter, botPic, newsletterUrl, mrxd);
  },
);

// RETURN Command
mxd(
  {
    pattern: "return",
    aliases: ["details", "det", "ret"],
    react: "⚡",
    category: "owner",
    description:
      "Displays the full raw quoted message using Baileys structure.",
  },
  async (from, Malvin, conText) => {
    const {
      mek,
      reply,
      react,
      quotedMsg,
      isSuperUser,
      botName,
      botFooter,
      newsletterJid,
      newsletterUrl,
    } = conText;

    if (!isSuperUser) {
      return reply(`Owner Only Command!`);
    }

    if (!quotedMsg) {
      return reply(`Please reply to/quote a message`);
    }

    try {
      const jsonString = JSON.stringify(quotedMsg, null, 2);
      const chunks = jsonString.match(/[\s\S]{1,100000}/g) || [];

      for (const chunk of chunks) {
        const formattedMessage = `\`\`\`\n${chunk}\n\`\`\``;

        await sendButtons(Malvin, from, {
          title: "",
          text: formattedMessage,
          footer: `> *${botFooter}*`,
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "Copy",
                copy_code: formattedMessage,
              }),
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "WaChannel",
                url: newsletterUrl,
              }),
            },
          ],
        }, { quoted: mrxd });

        await react("✅");
      }
    } catch (error) {
      console.error("Error processing quoted message:", error);
      await reply(`❌ An error occurred while processing the message.`);
    }
  },
);

// REPO Command
mxd(
  {
    pattern: "repo",
    aliases: ["sc", "rep", "script"],
    react: "💙",
    category: "general",
    description: "Fetch bot script.",
  },
  async (from, Malvin, conText) => {
    const {
      mek,
      sender,
      react,
      pushName,
      botPic,
      botName,
      botFooter,
      newsletterUrl,
      ownerName,
      newsletterJid,
      malvinRepo,
    } = conText;

    const response = await axios.get(
      `https://api.github.com/repos/${malvinRepo}`,
    );
    const repoData = response.data;
    const {
      full_name,
      name,
      forks_count,
      stargazers_count,
      created_at,
      updated_at,
      owner,
    } = repoData;
    const rpgPlayer = await require('../king/rpg/db').fetchPlayer(sender).catch(() => null);
    const displayName = rpgPlayer?.username || pushName;
    
    const messageText = `╭══〘〘 *${botName}* 〙〙═⊷
│↠👋 ${fancy("hello", "smallcaps")}: ${displayName}
│↠🤖 ${fancy("bot", "smallcaps")}: ${botName}
│↠👑 ${fancy("dono", "smallcaps")}: ${ownerName}
╰═════════════════⊷

📊 *${fancy("repository info", "smallcaps")}*

│↠📁 ${fancy("name", "smallcaps")}: ${name}
│↠⭐ s${fancy("tar", "smallcaps")}s: ${stargazers_count}
│↠🍴 ${fancy("fork", "smallcaps")}s: ${forks_count}
│↠📅 ${fancy("created", "smallcaps")}: ${new Date(created_at).toLocaleDateString()}
│↠🔄 ${fancy("last updated", "smallcaps")}: ${new Date(updated_at).toLocaleDateString()}
│↠👤 ${fancy("repo owner", "smallcaps")}: ${owner.login}
╰═════════════════⊷
`;

    const dateNow = Date.now();
    await sendButtons(Malvin, from, {
      title: "",
      text: messageText,
      footer: `> *${botFooter}*`,
      image: { url: botPic },
      buttons: [
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "🌐 View Repo",
            url: `https://github.com/${malvinRepo}`,
          }),
        },
        {
          id: `repo_dl_${dateNow}`,
          text: "📥 Download Zip",
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "📢 Canal",
            url: newsletterUrl,
          }),
        },
      ],
    }, { quoted: mrxd });

    const handleResponse = async (event) => {
      const messageData = event.messages[0];
      if (!messageData?.message) return;

      const templateButtonReply =
        messageData.message?.templateButtonReplyMessage;
      if (!templateButtonReply) return;

      const selectedButtonId = templateButtonReply.selectedId;
      if (!selectedButtonId?.includes(`repo_dl_${dateNow}`)) return;

      const isFromSameChat = messageData.key?.remoteJid === from;
      if (!isFromSameChat) return;

      try {
        const zipUrl = `https://github.com/${malvinRepo}/archive/refs/heads/main.zip`;
        await Malvin.sendMessage(
          from,
          {
            document: { url: zipUrl },
            fileName: `${name}.zip`,
            mimetype: "application/zip",
          },
          { quoted: mrxd },
        );
        await react("✅");
      } catch (dlErr) {
        await Malvin.sendMessage(from, { text: "❌ Failed to download repo zip: " + dlErr.message }, { quoted: mrxd });
      }

      Malvin.ev.off("messages.upsert", handleResponse);
    };

    Malvin.ev.on("messages.upsert", handleResponse);
    setTimeout(
      () => Malvin.ev.off("messages.upsert", handleResponse),
      120000,
    );

    await react("✅");
  },
);

// SUPPORT Command
mxd(
  {
    pattern: "support",
    aliases: ["star", "fork", "github"],
    react: "⭐",
    category: "general",
    description: "Support the bot by starring and forking on GitHub",
  },
  async (from, Malvin, conText) => {
    const {
      react,
      botFooter,
      botName,
      malvinRepo,
      newsletterUrl,
      pushName,
      ownerName,
      reply,
      sender,
    } = conText;

    try {
      const response = await axios.get(`https://api.github.com/repos/${malvinRepo}`);
      const { stargazers_count, forks_count } = response.data;
      const rpgPlayer = await fetchPlayer(sender).catch(() => null);
      const displayName = rpgPlayer?.username || pushName;

      const messageText = `╭══〘〘 *${botName}* 〙〙═⊷
│↠👋 ${fancy("hi", "smallcaps")} ${displayName}
│↠👑 ${fancy("dono", "smallcaps")}: ${ownerName}
╰═════════════════⊷

🌟 *S U P P O R T* 🌟

⭐ ${fancy("current star", "smallcaps")}s: ${stargazers_count}
🍴 ${fancy("current fork", "smallcaps")}s: ${forks_count}

✨ *H${fancy("ow to support", "smallcaps")}:*
• Click ⭐ Star Repo
• Click 🍴 Fork Repo
• Share with friends

`;

      await sendButtons(Malvin, from, {
        title: "",
        text: messageText,
        footer: `> *Every star & fork helps the bot grow! 🚀*`,
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "⭐ Star Repo",
              url: `https://github.com/${malvinRepo}`,
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🍴 Fork Repo",
              url: `https://github.com/${malvinRepo}/fork`,
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "📢 Canal",
              url: newsletterUrl,
            }),
          },
        ],
      }, { quoted: mrxd });

      await react("⭐");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  },
);

// SAVE Command
mxd(
  {
    pattern: "save",
    aliases: ["sv", "s", "sav", "."],
    react: "⚡",
    category: "owner",
    description:
      "Save messages (supports images, videos, audio, stickers, and text).",
  },
  async (from, Malvin, conText) => {
    const { mek, reply, react, sender, isSuperUser, getMediaBuffer } = conText;

    if (!isSuperUser) {
      return reply(`❌ Owner Only Command!`);
    }

    const quotedMsg =
      mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quotedMsg) {
      return reply(`⚠️ Please reply to/quote a message.`);
    }

    try {
      let mediaData;

      if (quotedMsg.imageMessage) {
        const buffer = await getMediaBuffer(quotedMsg.imageMessage, "image");
        mediaData = {
          image: buffer,
          caption: quotedMsg.imageMessage.caption || "",
        };
      } else if (quotedMsg.videoMessage) {
        const buffer = await getMediaBuffer(quotedMsg.videoMessage, "video");
        mediaData = {
          video: buffer,
          caption: quotedMsg.videoMessage.caption || "",
        };
      } else if (quotedMsg.audioMessage) {
        const buffer = await getMediaBuffer(quotedMsg.audioMessage, "audio");
        mediaData = {
          audio: buffer,
          mimetype: "audio/mp4",
        };
      } else if (quotedMsg.stickerMessage) {
        const buffer = await getMediaBuffer(
          quotedMsg.stickerMessage,
          "sticker",
        );
        mediaData = {
          sticker: buffer,
        };
      } else if (quotedMsg.documentMessage || quotedMsg.documentWithCaptionMessage?.message?.documentMessage) {
        const docMsg = quotedMsg.documentMessage || quotedMsg.documentWithCaptionMessage.message.documentMessage;
        const buffer = await getMediaBuffer(docMsg, "document");
        mediaData = {
          document: buffer,
          fileName: docMsg.fileName || "document",
          mimetype: docMsg.mimetype || "application/octet-stream",
        };
      } else if (
        quotedMsg.conversation ||
        quotedMsg.extendedTextMessage?.text
      ) {
        const text =
          quotedMsg.conversation || quotedMsg.extendedTextMessage.text;
        mediaData = {
          text: text,
        };
      } else if (quotedMsg.buttonsMessage || quotedMsg.templateMessage || quotedMsg.interactiveMessage || quotedMsg.listMessage || quotedMsg.buttonsResponseMessage || quotedMsg.templateButtonReplyMessage) {
        let text = "";
        if (quotedMsg.buttonsMessage) {
          text = quotedMsg.buttonsMessage.contentText || quotedMsg.buttonsMessage.text || "";
        } else if (quotedMsg.templateMessage?.hydratedTemplate) {
          text = quotedMsg.templateMessage.hydratedTemplate.hydratedContentText || "";
        } else if (quotedMsg.interactiveMessage?.body?.text) {
          text = quotedMsg.interactiveMessage.body.text;
        } else if (quotedMsg.listMessage) {
          text = quotedMsg.listMessage.description || quotedMsg.listMessage.title || "";
        } else if (quotedMsg.buttonsResponseMessage) {
          text = quotedMsg.buttonsResponseMessage.selectedDisplayText || "";
        } else if (quotedMsg.templateButtonReplyMessage) {
          text = quotedMsg.templateButtonReplyMessage.selectedDisplayText || "";
        }
        if (!text) {
          return reply(`❌ Could not extract text from the quoted message.`);
        }
        mediaData = {
          text: text,
        };
      } else {
        return reply(`❌ Unsupported message type.`);
      }

      await Malvin.sendMessage(sender, mediaData, { quoted: mrxd });
      await react("✅");
    } catch (error) {
      console.error("Save Error:", error);
      await reply(`❌ Failed to save the message. Error: ${error.message}`);
    }
  },
);

// CHJID Command
mxd(
  {
    pattern: "chjid",
    aliases: [
      "channeljid",
      "cid",
      "channelinfo",
      "newsletterjid",
      "newsjid",
      "newsletterinfo",
    ],
    react: "📢",
    category: "general",
    description: "Get WhatsApp Channel/Newsletter Info",
  },
  async (from, Malvin, conText) => {
    const { q, reply, react, botFooter, botPrefix, MalvinTechApi, MalvinApiKey } = conText;

    const input = q?.trim();
    if (!input) {
      await react("❌");
      return reply(
        `❌ Provide a channel link.\nUsage: *${botPrefix}chjid* https://whatsapp.com/channel/KEY`,
      );
    }

    const channelMatch = input.match(/whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i);
    if (!channelMatch) {
      await react("❌");
      return reply(
        "❌ Invalid channel link. Provide a valid WhatsApp channel link.\nExample: https://whatsapp.com/channel/ABC123",
      );
    }

    await react("🔍");
    const inviteKey = channelMatch[1];
    const channelUrl = `https://whatsapp.com/channel/${inviteKey}`;

    try {
      const meta = await Malvin.newsletterMetadata("invite", inviteKey);

      if (!meta || !meta.id) {
        await react("❌");
        return reply(
          "❌ Could not fetch channel info. The link may be invalid or the channel no longer exists.",
        );
      }

      const channelJid = meta.id;
      const tm = meta.thread_metadata || {};

      const name = tm.name?.text || "Unknown Channel";
      const rawDesc = tm.description?.text || "";
      const verification = tm.verification || "";
      const isVerified = verification === "VERIFIED";
      const stateType = meta.state?.type || "";
      const isActive = stateType === "ACTIVE";

      const subCount = parseInt(tm.subscribers_count || "0", 10);
      const followers =
        subCount >= 1_000_000
          ? `${(subCount / 1_000_000).toFixed(1)}M`
          : subCount >= 1_000
            ? `${(subCount / 1_000).toFixed(1)}K`
            : subCount > 0
              ? subCount.toLocaleString()
              : "N/A";

      let picUrl = null;
      try {
        const apiUrl = `https://api.giftedtech.co.ke/api/stalk/wachannel?apikey=gifted&url=${encodeURIComponent(channelUrl)}`;
        const apiRes = await axios.get(apiUrl, { timeout: 10000 });
        picUrl = apiRes.data?.result?.img || null;
      } catch (apiErr) {
        console.error("chjid pic error:", apiErr.message);
      }

      const MAX_DESC = 200;
      let descSection = "";
      if (rawDesc) {
        const trimmed = rawDesc.trim();
        if (trimmed.length > MAX_DESC) {
          const visible = trimmed.slice(0, MAX_DESC);
          const hidden = trimmed.slice(MAX_DESC);
          descSection = `\n\n📄 *Description:*\n${visible}${readmore}${hidden}`;
        } else {
          descSection = `\n\n📄 *Description:*\n${trimmed}`;
        }
      }

      const text = `╭══〘〘 *${fancy("channel info", "smallcaps")}* 〙〙═⊷
│↠📢 ${fancy("name", "smallcaps")}: ${name}
│↠🟢 s${fancy("tatu", "smallcaps")}s: ${isActive ? "Active" : stateType || "Unknown"}
│↠✅ ${fancy("verified", "smallcaps")}: ${isVerified ? "Yes" : "No"}
│↠👥 ${fancy("follower", "smallcaps")}s: ${followers}
│↠🆔 ${fancy("jid", "smallcaps")}: \`${channelJid}\`
╰═════════════════⊷${descSection}\n`;

      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 Copy JID",
            copy_code: channelJid,
          }),
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "➕ Follow Channel",
            url: channelUrl,
            merchant_url: channelUrl,
          }),
        },
      ];

      const sendOpts = {
        text,
        footer: botFooter,
        buttons,
      };

      if (picUrl) {
        sendOpts.image = { url: picUrl };
      }

      await sendButtons(Malvin, from, sendOpts, { quoted: mrxd });
      await react("✅");
    } catch (error) {
      console.error("chjid error:", error);
      await react("❌");
      await reply(`❌ Error fetching channel info: ${error.message}`);
    }
  },
);
