# Catálogo de comandos — Bot WhatsApp

Este catálogo é gerado a partir dos registros `pattern` encontrados nos módulos `malvin/*.js`. Os nomes originais e aliases originais são preservados. A confirmação estática não substitui o teste de cada comando conectado ao WhatsApp.

**Comandos originais encontrados por análise estática:** 707

## Aliases em português adicionados

| Alias pt-BR | Comando original |
|---|---|
| `ajuda` | `menu` |
| `ajudaesportes` | `sportshelp` |
| `ajudaia` | `aimenu` |
| `ajudatexto` | `texthelp` |
| `anotacoes` | `notes` |
| `anotações` | `notes` |
| `boasvindas` | `setwelcome` |
| `calculadora` | `calc` |
| `calcular` | `calc` |
| `clima` | `weather` |
| `codigoqr` | `qr` |
| `configuracoes` | `settings` |
| `configurações` | `settings` |
| `dado` | `dice` |
| `desmutar` | `unmute` |
| `despedida` | `setgoodbye` |
| `dono` | `owner` |
| `figurinha` | `sticker` |
| `fuso` | `timezone` |
| `hora` | `time` |
| `idade` | `age` |
| `idioma` | `lang` |
| `idiomagrupo` | `setgrouplang` |
| `inventario` | `inventory` |
| `inventário` | `inventory` |
| `jogos` | `games` |
| `marcar` | `tagall` |
| `marcaradmins` | `tagadmins` |
| `meuip` | `myip` |
| `missao` | `quests` |
| `missões` | `quests` |
| `moeda` | `coinflip` |
| `mutar` | `mute` |
| `nivel` | `level` |
| `notas` | `notes` |
| `noticias` | `news` |
| `notícias` | `news` |
| `nível` | `level` |
| `pais` | `country` |
| `perfil` | `profile` |
| `pesquisar` | `search-gate` |
| `piada` | `joke` |
| `pontos` | `stats` |
| `prefixo` | `setprefix` |
| `promover` | `promote` |
| `ranking` | `leaderboard` |
| `rebaixar` | `demote` |
| `remover` | `kick` |
| `roleta` | `roulette` |
| `saldo` | `balance` |
| `senha` | `password` |
| `sorte` | `random` |
| `tempo` | `weather` |
| `uptime` | `uptime` |

## Comandos originais e aliases registrados

| Comando | Aliases originais | Módulo |
|---|---|---|
| `absorb` | `drain`, `lifesteal` | `malvin/combat.js` |
| `accept` | `approve` | `malvin/group.js` |
| `acceptall` | `approveall` | `malvin/group.js` |
| `achievements` | `achv`, `medals` | `malvin/progression.js` |
| `add` | `invite` | `malvin/group.js` |
| `add-diamond` | — | `malvin/origin.js` |
| `add-friend` | `addfriend`, `friend` | `malvin/social.js` |
| `addnote` | `createnote`, `makenote`, `newnote` | `malvin/notes.js` |
| `addstat` | `upgrade`, `upstat` | `malvin/progression.js` |
| `adminclearnotes` | `adminrmallnotes`, `clearusernotes`, `deleteusernotes` | `malvin/settings.js` |
| `admindelnote` | `admindeletenote`, `deletenotebyid`, `rmnotebyid` | `malvin/settings.js` |
| `adminupdatenote` | `admineditnote`, `editnotebyid`, `updatenotebyid` | `malvin/settings.js` |
| `advice` | — | `malvin/info.js` |
| `affect` | — | `malvin/canvas.js` |
| `age` | `agecalc`, `calcage`, `howold`, `myage` | `malvin/info.js` |
| `ailist` | — | `malvin/ai.js` |
| `aimenu` | `aimenu` | `malvin/general.js` |
| `aimode` | `chatbotmode`, `setchatbotmode` | `malvin/settings.js` |
| `alamy` | `alamydl`, `alamyvideo` | `malvin/downloads.js` |
| `alchemy` | `brew`, `potion` | `malvin/gathering.js` |
| `alignment-path` | `alignmentguide`, `paths` | `malvin/survival.js` |
| `alignment-shift` | `alignmentshift`, `shiftpath` | `malvin/survival.js` |
| `all-in` | `allin`, `yolo` | `malvin/gambling.js` |
| `alliance` | `ally`, `formalliance` | `malvin/social.js` |
| `allnotes` | `allnotesdb`, `usernotes`, `viewnotes` | `malvin/settings.js` |
| `ambush` | `sneak`, `surprise` | `malvin/combat.js` |
| `animagine` | — | `malvin/ai.js` |
| `animehelp` | `animemenu` | `malvin/anime.js` |
| `antibadwarn` | `antibadwarncount`, `badwarncount`, `setbadwarn` | `malvin/settings.js` |
| `antidemote` | — | `malvin/group.js` |
| `antigcmention` | `antigcstatusmention`, `antigroupmention`, `antimentiongroup`, `antistatusmention` | `malvin/group.js` |
| `antigcwarnlimit` | `antigcmentionwarnlimit`, `antigroupmentionwarnlimit`, `setantigcmentionwarnlimit`, `setantigroupmentionwarn` | `malvin/group.js` |
| `antilinkwarn` | `antilinkwarncount`, `setwarncount`, `warncount`, `warnlimit` | `malvin/settings.js` |
| `antinsfwwarn` | `antinsfwwarncount`, `nsfwwarncount`, `setnsfwwarn` | `malvin/settings.js` |
| `antipromote` | — | `malvin/group.js` |
| `apk` | `apkdl`, `app`, `appdownload` | `malvin/downloads.js` |
| `apprentice` | `apprentices`, `students` | `malvin/social.js` |
| `arcade` | `arcadegame`, `arcadegames` | `malvin/arcade.js` |
| `arise` | `deploy`, `shadowdeploy` | `malvin/combat.js` |
| `arrest` | `detain`, `imprison` | `malvin/social.js` |
| `assassinate` | `assassin`, `hitjob` | `malvin/gambling.js` |
| `astronauts` | `spacepeople`, `whoisinspace` | `malvin/info.js` |
| `atone` | `redeem`, `repent` | `malvin/survival.js` |
| `attack` | `atk`, `strike` | `malvin/combat.js` |
| `aura-check` | `auracheck`, `myaura` | `malvin/survival.js` |
| `auto-craft` | `autocraft`, `smartcraft` | `malvin/gathering.js` |
| `auto-hunt` | `autohunt`, `grind` | `malvin/combat.js` |
| `autobio` | `bio`, `setautobio` | `malvin/settings.js` |
| `autoblock` | `blockcountry`, `setautoblock` | `malvin/settings.js` |
| `autoreact` | `react` | `malvin/settings.js` |
| `autoread` | `readmessages`, `setautoread` | `malvin/settings.js` |
| `autoreadstatus` | `readstatus`, `viewstatus` | `malvin/settings.js` |
| `avatar` | `genavatar`, `randomavatar` | `malvin/info.js` |
| `awaken` | `awakening` | `malvin/progression.js` |
| `badwords` | `badword`, `profanity`, `setbadwords` | `malvin/settings.js` |
| `balance` | `bal`, `wallet` | `malvin/progression.js` |
| `barrier` | `shield`, `ward` | `malvin/combat.js` |
| `base-camp` | `basecamp`, `camp` | `malvin/exploration.js` |
| `batslap` | — | `malvin/canvas.js` |
| `battle-log` | `battlelog`, `combatlog` | `malvin/combat.js` |
| `beautiful` | — | `malvin/canvas.js` |
| `bet` | `gamble`, `wager` | `malvin/gambling.js` |
| `betdice` | `roll`, `rolldice` | `malvin/gambling.js` |
| `betray` | `backstab`, `turncoat` | `malvin/survival.js` |
| `bibleai` | `veniceai` | `malvin/ai.js` |
| `biomes` | `biome`, `biomeinfo` | `malvin/exploration.js` |
| `bj` | `21`, `blackjack` | `malvin/gambling.js` |
| `blackpink` | `dbz` | `malvin/ephoto360.js` |
| `bleed` | `hemorrhage`, `lacerate` | `malvin/combat.js` |
| `bless` | — | `malvin/origin.js` |
| `block` | `blockuser` | `malvin/owner.js` |
| `blocklist` | `blocked`, `listblocked` | `malvin/owner.js` |
| `blood-pact` | `bloodpact`, `demonpact` | `malvin/combat.js` |
| `bloodline` | `ancestry`, `bl` | `malvin/progression.js` |
| `blueneon` | — | `malvin/ephoto360.js` |
| `blueprint` | `blueprints`, `recipes` | `malvin/gathering.js` |
| `blur` | — | `malvin/canvas.js` |
| `bored` | `activity`, `imbored` | `malvin/info.js` |
| `boss` | `bossfight`, `bossraid` | `malvin/combat.js` |
| `boss-location` | `bosslocation`, `findboss` | `malvin/exploration.js` |
| `botstats` | `botinfo`, `status` | `malvin/general.js` |
| `bounty-claim` | `bountyclaim`, `claimkill` | `malvin/social.js` |
| `brat` | `brateffect` | `malvin/converter.js` |
| `brat2` | `bratanim` | `malvin/converter.js` |
| `bribe-enforcer` | `bribeenforcer`, `clearrecord` | `malvin/gambling.js` |
| `bundesligatable` | `bundesligastandings` | `malvin/sports.js` |
| `bundesligatopscorers` | `bundesligascorers` | `malvin/sports.js` |
| `bundesligaupcoming` | `bundesligafixtures` | `malvin/sports.js` |
| `calc` | `calculate`, `compute`, `math` | `malvin/utility.js` |
| `campaign` | `runcampaign`, `runforoffice` | `malvin/social.js` |
| `canvashelp` | `canvas`, `canvasmenu` | `malvin/canvas.js` |
| `capcut` | `capcutdl`, `cct` | `malvin/downloads.js` |
| `captcha` | — | `malvin/canvas.js` |
| `catbox` | — | `malvin/tourl.js` |
| `catfacts` | `catfact` | `malvin/info.js` |
| `census` | `worldcensus`, `worldstats` | `malvin/social.js` |
| `chain-attack` | `chainattack`, `rapidstrike` | `malvin/combat.js` |
| `chaos-roulette` | `chaosroulette`, `darkroulette` | `malvin/gambling.js` |
| `chaos-surge` | `chaospower`, `chaossurge` | `malvin/survival.js` |
| `checkname` | `availname`, `nameavail` | `malvin/register.js` |
| `checkroles` | `checkunlock`, `rolecheck`, `specialrole` | `malvin/roles.js` |
| `chinesezodiac` | `cnzodiac` | `malvin/info.js` |
| `chjid` | `channelinfo`, `channeljid`, `cid`, `newsjid`, `newsletterinfo`, `newsletterjid` | `malvin/general.js` |
| `choose` | `decide`, `pick`, `randomchoice` | `malvin/utility.js` |
| `circle` | — | `malvin/canvas.js` |
| `claim-land` | `claimland`, `stake` | `malvin/exploration.js` |
| `cleanse` | `karmacleanse`, `soulcleanse` | `malvin/survival.js` |
| `clearworld` | `clearevent`, `worldclear` | `malvin/world.js` |
| `clone` | `decoy`, `shadowclone` | `malvin/combat.js` |
| `cmd` | `getcmd` | `malvin/owner.js` |
| `cock-fight` | `cf2`, `cockfight`, `rooster` | `malvin/gambling.js` |
| `coinflip` | `cf`, `flip` | `malvin/gambling.js` |
| `color` | `colorinfo`, `colorpicker`, `hex`, `rgb` | `malvin/utility.js` |
| `combat-stats` | `battlestats`, `cs` | `malvin/combat.js` |
| `combo` | `comboattack`, `tripleattack` | `malvin/combat.js` |
| `compass` | `directions`, `navigate` | `malvin/exploration.js` |
| `conquer` | `claim`, `seize` | `malvin/exploration.js` |
| `convert` | `convertunit`, `uc`, `unitconvert` | `malvin/utility.js` |
| `cook` | `cookfood`, `meal` | `malvin/survival.js` |
| `council` | `joincouncil`, `worldcouncil` | `malvin/social.js` |
| `counter` | `counterattack`, `retaliate` | `malvin/combat.js` |
| `country` | `ccode`, `cinfo`, `countrycode`, `countryinfo` | `malvin/info.js` |
| `cprofile` | — | `malvin/canvas.js` |
| `craft` | `create`, `make` | `malvin/gathering.js` |
| `craft-batch` | `bulkcraft`, `craftbatch` | `malvin/gathering.js` |
| `crash` | `crashgame`, `rocketcrash` | `malvin/gambling.js` |
| `crypto` | `coin`, `coinprice`, `cryptoprice` | `malvin/crypto.js` |
| `cryptoconv` | `btcusd`, `coinconvert`, `cryptocalc` | `malvin/crypto.js` |
| `crystal-forge` | `crystalforge`, `pureforge` | `malvin/gathering.js` |
| `crystal-hunt` | `crystalhunt`, `findcrystal` | `malvin/gathering.js` |
| `currency` | `convert`, `currencyconv`, `exchangerate`, `forex` | `malvin/crypto.js` |
| `curse` | — | `malvin/origin.js` |
| `daily` | `claim`, `dailyreward` | `malvin/progression.js` |
| `daily-spin` | `dailyspin`, `freespin` | `malvin/gambling.js` |
| `dalle` | `flux` | `malvin/ai.js` |
| `dark-embrace` | `darkembrace`, `shadowembrace` | `malvin/survival.js` |
| `dark-ritual` | `darkpower`, `ritual` | `malvin/survival.js` |
| `darkness` | — | `malvin/canvas.js` |
| `declare-peace` | `declarepeace`, `peace` | `malvin/social.js` |
| `decode` | `b64enc`, `base64encode` | `malvin/utility.js` |
| `deep-mine` | `deepdig`, `deepmine` | `malvin/gathering.js` |
| `deepimg` | `flux` | `malvin/ai.js` |
| `defend` | `block`, `guard` | `malvin/combat.js` |
| `define` | `dictionary`, `meaning` | `malvin/info.js` |
| `del` | `delete`, `dlt`, `remove` | `malvin/owner.js` |
| `delallnotes` | `clearnotes`, `deleteallnotes`, `delnotes`, `removeallnotes` | `malvin/notes.js` |
| `delete` | — | `malvin/canvas.js` |
| `delnote` | `deletenote`, `removenote`, `rmnote` | `malvin/notes.js` |
| `delsudo` | `removesudo` | `malvin/owner.js` |
| `demote` | — | `malvin/group.js` |
| `devil` | `dbz` | `malvin/ephoto360.js` |
| `dice` | `dicegame`, `dicestart`, `rolldice` | `malvin/games.js` |
| `diceai` | `aidice`, `dicebot`, `rolldiceai` | `malvin/games.js` |
| `diceend` | `dicecancel`, `dicestop`, `enddice`, `stopdice` | `malvin/games.js` |
| `dicejoin` | `joindice` | `malvin/games.js` |
| `diffusion` | `flux` | `malvin/ai.js` |
| `dimension-jump` | `dimjump`, `dimshift` | `malvin/exploration.js` |
| `dimension-list` | `alldimensions`, `dimensionlist` | `malvin/exploration.js` |
| `disapp` | `disappear`, `disappearing`, `vanish` | `malvin/owner.js` |
| `dismantle` | `breakdown`, `salvage` | `malvin/gathering.js` |
| `divorce` | `breakup`, `separate` | `malvin/social.js` |
| `dmpresence` | `chatpresence`, `inboxpresence`, `setdmpresence` | `malvin/settings.js` |
| `dogfacts` | `dogfact` | `malvin/info.js` |
| `domain-expand` | `domain`, `domainexpand` | `malvin/combat.js` |
| `dota` | — | `malvin/ephoto360.js` |
| `double-or-nothing` | `allin`, `don`, `doubleup` | `malvin/gambling.js` |
| `douyin` | `douyindl`, `dydl` | `malvin/downloads.js` |
| `downloadermenu` | `aimenu` | `malvin/general.js` |
| `dragonball` | `dbz` | `malvin/ephoto360.js` |
| `dragonball2` | — | `malvin/ephoto360.js` |
| `drink` | `drinkwater`, `water` | `malvin/survival.js` |
| `duel` | `challenge`, `pvp` | `malvin/combat.js` |
| `dungeon` | `dg`, `gate` | `malvin/combat.js` |
| `dungeon-map` | `dungeonlayout`, `dungeonmap` | `malvin/exploration.js` |
| `eat` | `eatfood`, `food` | `malvin/survival.js` |
| `econcheck` | `econinfo`, `econstatus` | `malvin/group.js` |
| `economy` | `econ`, `econmode` | `malvin/group.js` |
| `election` | `startelection`, `vote-leader` | `malvin/social.js` |
| `embassy` | `buildembassy`, `diplomatic` | `malvin/social.js` |
| `emergency-eat` | `emergencyeat`, `raweat` | `malvin/survival.js` |
| `enchant` | `ench`, `enchantment` | `malvin/gathering.js` |
| `encode` | `b64enc`, `base64encode` | `malvin/utility.js` |
| `endure` | `steelheart`, `toughen` | `malvin/survival.js` |
| `ephoto` | `ephoto360`, `texteffect`, `textfx` | `malvin/ephoto360.js` |
| `epltable` | `eplstandings`, `premierleaguetable` | `malvin/sports.js` |
| `epltopscorers` | `eplscorers`, `premierleaguescorers` | `malvin/sports.js` |
| `eplupcoming` | `eplfixtures`, `premierleaguefixtures` | `malvin/sports.js` |
| `eurostable` | `eurochampionship`, `eurosstandings` | `malvin/sports.js` |
| `eurostopscorers` | `euros scorers` | `malvin/sports.js` |
| `eurosupcoming` | `euros fixtures` | `malvin/sports.js` |
| `event-start` | — | `malvin/origin.js` |
| `everyone` | `all`, `mention`, `tag` | `malvin/group.js` |
| `execute` | `finish`, `killblow` | `malvin/combat.js` |
| `exile` | `banish`, `expel` | `malvin/social.js` |
| `explore` | `scout-area`, `search` | `malvin/exploration.js` |
| `explore-deep` | `deepexplore`, `exploredeep` | `malvin/exploration.js` |
| `extract` | `shadowextract` | `malvin/combat.js` |
| `extract-gem` | `extractgem`, `gemextract` | `malvin/gathering.js` |
| `facepalm` | — | `malvin/canvas.js` |
| `fact` | — | `malvin/info.js` |
| `fame` | `celebrity`, `famestatus` | `malvin/social.js` |
| `farm` | `farming`, `plant` | `malvin/gathering.js` |
| `fast-heal` | `fastheal`, `quickheal` | `malvin/survival.js` |
| `fast-travel` | `fasttravel`, `ft`, `quicktravel` | `malvin/exploration.js` |
| `fastdl` | `fastinstagram`, `fdl` | `malvin/downloads.js` |
| `fb` | `facebook`, `facebookdl`, `fbdl` | `malvin/downloads.js` |
| `fifatable` | `fifaworldcup`, `worldcuptable` | `malvin/sports.js` |
| `fifatopscorers` | `worldcupscorers` | `malvin/sports.js` |
| `fifaupcoming` | `worldcupfixtures` | `malvin/sports.js` |
| `fire` | — | `malvin/ephoto360.js` |
| `fish` | `cast`, `fishing` | `malvin/gathering.js` |
| `flank` | `blindside`, `sideattack` | `malvin/combat.js` |
| `flee` | `escape`, `run` | `malvin/combat.js` |
| `flip` | `coinflip2`, `headortails`, `toss` | `malvin/utility.js` |
| `fluxai` | `flux` | `malvin/ai.js` |
| `footballnews` | `fnews`, `soccernews` | `malvin/sports.js` |
| `force-rank` | — | `malvin/origin.js` |
| `forceevent` | `wevent`, `worldevent` | `malvin/world.js` |
| `forge` | `blacksmith`, `smith` | `malvin/gathering.js` |
| `fortify` | `reinforce`, `strengthen` | `malvin/survival.js` |
| `forward` | `fwd` | `malvin/owner.js` |
| `friends` | `fl`, `friendlist` | `malvin/social.js` |
| `fullpp` | `setfullpp` | `malvin/owner.js` |
| `funggmenu` | `downloadermenu` | `malvin/general.js` |
| `fury` | `berserk`, `enrage` | `malvin/combat.js` |
| `galaxycover` | — | `malvin/ephoto360.js` |
| `galaxyneon` | — | `malvin/ephoto360.js` |
| `gamble-stats` | `gamblelb`, `gamblestats` | `malvin/gambling.js` |
| `games` | `game`, `gamelist`, `playgame`, `playgames` | `malvin/games.js` |
| `gate-list` | `gatelist`, `nearbygates` | `malvin/exploration.js` |
| `gate-rank` | `gaterank`, `mygate` | `malvin/exploration.js` |
| `gather-all` | `gatherall`, `megagather` | `malvin/gathering.js` |
| `gcdesc` | `description`, `groupdesc`, `setdescription`, `setgcdesc`, `setgroupdesc` | `malvin/group.js` |
| `gcjid` | `groupjid`, `setgcjid`, `supportgc` | `malvin/settings.js` |
| `gcpp` | `fullgcpp`, `gcfullpp`, `setgcpp` | `malvin/owner.js` |
| `gcsettings` | `gcset`, `groupset`, `groupsettings`, `gsettings` | `malvin/settings.js` |
| `gdrive` | `drive`, `gdrivedl`, `googledrive` | `malvin/downloads.js` |
| `gemini` | `ai` | `malvin/ai.js` |
| `getgcpp` | `snatchgcpp`, `stealgcpp` | `malvin/owner.js` |
| `getlid` | `lid`, `userlid` | `malvin/owner.js` |
| `getnote` | `listnote`, `shownote`, `viewnote` | `malvin/notes.js` |
| `getnotes` | `allnotes`, `getallnotes`, `listnotes`, `mynotes`, `viewnotes` | `malvin/notes.js` |
| `getpp` | `snatchpp`, `stealpp` | `malvin/owner.js` |
| `getsetting` | `getconfig`, `viewsetting` | `malvin/settings.js` |
| `getsudo` | `getsudos`, `listsudo`, `listsudos` | `malvin/owner.js` |
| `gift` | `givegift`, `present` | `malvin/social.js` |
| `gita` | — | `malvin/ai.js` |
| `gitclone` | `clone`, `git`, `gitdl`, `github`, `repodl` | `malvin/downloads.js` |
| `github` | `gh`, `ghstalk`, `gitstalk` | `malvin/stalk.js` |
| `give-shadow` | — | `malvin/origin.js` |
| `glitch` | — | `malvin/origin.js` |
| `glitchtext` | — | `malvin/ephoto360.js` |
| `glossy` | `dbz` | `malvin/ephoto360.js` |
| `gohome` | `returnhome`, `tphome` | `malvin/exploration.js` |
| `goodbyemsg` | `byemsg`, `goodbyemessage`, `setgoodbyemsg`, `setgoodbyetext` | `malvin/settings.js` |
| `goodbyev1` | — | `malvin/canvas.js` |
| `goodbyev2` | — | `malvin/canvas.js` |
| `goodbyev3` | — | `malvin/canvas.js` |
| `goodbyev4` | — | `malvin/canvas.js` |
| `goodbyev5` | — | `malvin/canvas.js` |
| `gps` | `location`, `where`, `whereami` | `malvin/exploration.js` |
| `greyscale` | — | `malvin/canvas.js` |
| `groupcache` | `cachedmetadata`, `cachemeta`, `gcmeta` | `malvin/owner.js` |
| `groupmenu` | `funggmenu` | `malvin/general.js` |
| `groupname` | `gcname`, `gcsubject`, `setgcname`, `setgcsubject`, `setgroupname` | `malvin/group.js` |
| `guild-create` | `createguild`, `newguild` | `malvin/social.js` |
| `guild-disband` | `disband`, `guilddisband` | `malvin/social.js` |
| `guild-info` | `guild`, `guildinfo` | `malvin/social.js` |
| `guild-join` | `joinguild` | `malvin/social.js` |
| `guild-kick` | `guildkick`, `kickmember` | `malvin/social.js` |
| `guild-lb` | `guildlb`, `guildleaderboard`, `toplguilds` | `malvin/social.js` |
| `guild-leave` | `leaveguild`, `quitguild` | `malvin/social.js` |
| `guild-members` | `guildlist`, `guildmembers` | `malvin/social.js` |
| `guild-promote` | `guildpromote`, `promotemember` | `malvin/social.js` |
| `guild-rank` | `guildlb`, `guildrank` | `malvin/social.js` |
| `guild-upgrade` | `guildupgrade`, `upguildlevel` | `malvin/social.js` |
| `guild-vault` | `guilddeposit`, `guildvault` | `malvin/social.js` |
| `guild-war` | `declarewar`, `guildwar` | `malvin/social.js` |
| `guild-withdraw` | `guildwithdraw`, `guildwithdrawal` | `malvin/social.js` |
| `h2h` | `fixture`, `headtohead`, `matches` | `malvin/sports.js` |
| `hacker` | — | `malvin/ephoto360.js` |
| `hackernews` | `hackernewstop`, `hn` | `malvin/info.js` |
| `harvest` | `forage`, `gather` | `malvin/gathering.js` |
| `heal` | `hp`, `usepot` | `malvin/combat.js` |
| `herb-run` | `herbrun`, `quickherb` | `malvin/gathering.js` |
| `heritage` | `bloodlinebonus`, `lineage` | `malvin/survival.js` |
| `hidden-room` | `hiddenroom`, `secretroom` | `malvin/exploration.js` |
| `hidetag` | `hidden`, `hidtag`, `htag` | `malvin/group.js` |
| `higher-lower` | `higherlower`, `hl` | `malvin/gambling.js` |
| `holidays` | `publicholidays` | `malvin/info.js` |
| `hospital` | `clinic`, `infirmary` | `malvin/combat.js` |
| `httpstatus` | `httpcode` | `malvin/info.js` |
| `hunger-rank` | `foodlb`, `hungerrank` | `malvin/survival.js` |
| `hunger-status` | `status`, `survival`, `vitals` | `malvin/survival.js` |
| `hunt` | `fight`, `h` | `malvin/combat.js` |
| `ice` | `metallic` | `malvin/ephoto360.js` |
| `identify` | `appraise`, `id` | `malvin/gathering.js` |
| `ig` | `igdl`, `insta`, `instadl`, `instagram` | `malvin/downloads.js` |
| `igstalk` | `ig`, `instagram`, `instastalk` | `malvin/stalk.js` |
| `imagemenu` | `textmenu` | `malvin/general.js` |
| `imgbb` | — | `malvin/tourl.js` |
| `impeach` | `overthrow`, `remove-master` | `malvin/social.js` |
| `influence` | `exertpower`, `worldinfluence` | `malvin/social.js` |
| `infohelp` | `infocmds`, `infocommands` | `malvin/info.js` |
| `inscribe` | `carve`, `inscription` | `malvin/gathering.js` |
| `inv-drop` | `discard`, `dropitem`, `invdrop` | `malvin/gathering.js` |
| `inv-give` | `giveitem`, `invgive`, `tradeitem` | `malvin/gathering.js` |
| `inv-sell` | `invsell`, `sellinv`, `sellmat` | `malvin/gathering.js` |
| `inventory` | `bag`, `inv`, `items` | `malvin/gathering.js` |
| `invert` | — | `malvin/canvas.js` |
| `ip` | `ipaddress`, `ipinfo`, `iplookup` | `malvin/info.js` |
| `iqc` | `fakeimessage`, `imessage` | `malvin/converter.js` |
| `iss` | `isslocation`, `spacestation` | `malvin/info.js` |
| `jackpot` | `globaljackpot`, `megawin` | `malvin/gambling.js` |
| `jail` | `jailstatus`, `prison` | `malvin/social.js` |
| `jid` | — | `malvin/owner.js` |
| `join` | `joingc`, `joingroup` | `malvin/owner.js` |
| `joke` | `randomfact` | `malvin/info.js` |
| `karma` | `alignment`, `karmacheck` | `malvin/survival.js` |
| `karma-rank` | `karmalb`, `karmarank` | `malvin/survival.js` |
| `kick` | `remove` | `malvin/group.js` |
| `kill-streak` | `killstreak`, `streak` | `malvin/combat.js` |
| `killgc` | `destroygc`, `nukegc`, `terminategc` | `malvin/group.js` |
| `kisspic` | — | `malvin/canvas.js` |
| `lahelu` | `laheludl`, `lhl` | `malvin/downloads.js` |
| `laligatable` | `laligastandings` | `malvin/sports.js` |
| `laligatopscorers` | `laligascorers` | `malvin/sports.js` |
| `laligaupcoming` | `laligafixtures` | `malvin/sports.js` |
| `landmark` | `discover`, `landmarks` | `malvin/exploration.js` |
| `lang` | `coinflip2`, `headortails`, `toss` | `malvin/utility.js` |
| `last-stand` | `finalstrike`, `laststand` | `malvin/combat.js` |
| `lb` | `leaderboard`, `top`, `top10` | `malvin/progression.js` |
| `leaderboard` | `lb`, `top10` | `malvin/rpg.js` |
| `leaves` | — | `malvin/ephoto360.js` |
| `left` | `exitgc`, `exitgroup`, `leave` | `malvin/group.js` |
| `level` | `exp`, `xp` | `malvin/progression.js` |
| `levelup` | — | `malvin/canvas.js` |
| `light` | `metallic` | `malvin/ephoto360.js` |
| `light-blessing` | `divineblessing`, `lightblessing` | `malvin/survival.js` |
| `ligue1table` | `ligue1standings` | `malvin/sports.js` |
| `ligue1topscorers` | `ligue1scorers` | `malvin/sports.js` |
| `ligue1upcoming` | `ligue1fixtures` | `malvin/sports.js` |
| `link` | `gclink`, `grouplink`, `invitelink` | `malvin/group.js` |
| `listrequests` | `joinrequests`, `listjoinrequests`, `pendingrequests` | `malvin/group.js` |
| `livehighlights` | `highlights`, `livescorehd` | `malvin/sports.js` |
| `livescore` | `live`, `livefootball`, `livescores` | `malvin/sports.js` |
| `location-info` | `areainfo`, `locationinfo` | `malvin/exploration.js` |
| `lolavatar` | — | `malvin/ephoto360.js` |
| `lotto` | `lottery`, `ticket` | `malvin/gambling.js` |
| `lucky-spin` | `fortunespin`, `luckyspin` | `malvin/gambling.js` |
| `lumo` | `veniceai` | `malvin/ai.js` |
| `maintenance` | — | `malvin/origin.js` |
| `malvinai` | `ai` | `malvin/ai.js` |
| `map` | `locations`, `worldmap` | `malvin/exploration.js` |
| `map-rank` | `maprank`, `territorylb` | `malvin/exploration.js` |
| `marry` | `propose`, `wed` | `malvin/social.js` |
| `mass-chop` | `masschop`, `masslumber` | `malvin/gathering.js` |
| `mastercraft` | `legendary-craft`, `mastercrafting` | `malvin/gathering.js` |
| `material-rank` | `gatherrank`, `materialrank` | `malvin/gathering.js` |
| `matrix` | `metallic` | `malvin/ephoto360.js` |
| `mediafire` | `mediafiredl`, `mfire`, `mfiredl` | `malvin/downloads.js` |
| `mediamenu` | `toolsmenu` | `malvin/general.js` |
| `meditate` | `mp`, `rest` | `malvin/combat.js` |
| `meditate-align` | `soulmeditate`, `zen` | `malvin/survival.js` |
| `meditate-deep` | `deepmeditate`, `zenstate` | `malvin/survival.js` |
| `mega` | `megadl`, `meganz` | `malvin/downloads.js` |
| `melt` | `meltdown`, `smelt` | `malvin/gathering.js` |
| `mentor` | `setmentor`, `teacher` | `malvin/social.js` |
| `menu` | `allmenu`, `help`, `men` | `malvin/general.js` |
| `menu2` | `help2`, `men2` | `malvin/general.js` |
| `menu3` | `help3`, `men3`, `menu3` | `malvin/general.js` |
| `menu4` | `help4`, `men4`, `menu4` | `malvin/general.js` |
| `met` | — | `malvin/group.js` |
| `metal` | `metallic` | `malvin/ephoto360.js` |
| `mine` | `dig`, `mining` | `malvin/gathering.js` |
| `mines` | `minegame`, `minesweeper` | `malvin/gambling.js` |
| `monarch-gate` | `kinggate`, `monarchgate` | `malvin/exploration.js` |
| `monarch-strike` | `monarchstrike`, `sovereignstrike` | `malvin/combat.js` |
| `moon` | `lunar`, `lunarphase`, `moonphase` | `malvin/utility.js` |
| `moonphase` | `moon` | `malvin/info.js` |
| `morale` | `boostmorale`, `inspire` | `malvin/survival.js` |
| `mute` | `close`, `gcclose`, `gcmute`, `groupmute` | `malvin/group.js` |
| `mygroups` | `allgroups`, `fetchgroups`, `groups`, `listgroups` | `malvin/owner.js` |
| `myip` | `ipme`, `myipaddress` | `malvin/info.js` |
| `myname` | `myid`, `myinfo` | `malvin/register.js` |
| `myrole` | `myclass`, `myjob`, `rolestat` | `malvin/roles.js` |
| `myworldinfo` | `currentworld`, `winfo`, `worldinfo` | `malvin/world.js` |
| `namestats` | `nameinfo`, `predictname` | `malvin/info.js` |
| `naruto` | `dbz` | `malvin/ephoto360.js` |
| `nature-bond` | `earthbond`, `naturebond` | `malvin/survival.js` |
| `negotiate` | `bargain`, `deal` | `malvin/social.js` |
| `neon` | — | `malvin/ephoto360.js` |
| `neonsign` | — | `malvin/ephoto360.js` |
| `newgroup` | `creategroup`, `newgc` | `malvin/group.js` |
| `news` | `breakingnews`, `headlines`, `latestnews` | `malvin/crypto.js` |
| `night-farm` | `moonharvest`, `nightfarm` | `malvin/gathering.js` |
| `notes` | `createnote`, `makenote`, `newnote` | `malvin/notes.js` |
| `npm` | `npmpackage`, `npmsearch` | `malvin/info.js` |
| `number-guess` | `guessnumber`, `numberguess` | `malvin/gambling.js` |
| `odds` | `betting`, `bettingodds`, `footballodds` | `malvin/sports.js` |
| `online` | `listonline`, `whos online`, `whosonline` | `malvin/group.js` |
| `onwa` | `checknumber`, `checkwa`, `onwhatsapp` | `malvin/owner-utils.js` |
| `origin-craft` | `origincraft`, `sovereigncraft` | `malvin/gathering.js` |
| `origin-gamble` | `origingamble`, `sovereigngamble` | `malvin/gambling.js` |
| `originmenu` | `ownersmenu` | `malvin/general.js` |
| `outpost` | `establish-outpost`, `setupoutpost` | `malvin/exploration.js` |
| `owner` | — | `malvin/owner.js` |
| `ownersmenu` | `mediamenu` | `malvin/general.js` |
| `paint` | — | `malvin/ephoto360.js` |
| `palindrome` | `generateid`, `guid`, `randomid` | `malvin/utility.js` |
| `pardon` | `freeplayer`, `release-player` | `malvin/social.js` |
| `parry` | `deflect`, `riposte` | `malvin/combat.js` |
| `party` | `formparty`, `joinparty` | `malvin/social.js` |
| `password` | `generateqr`, `qrcode` | `malvin/utility.js` |
| `pastebin` | `getpaste`, `paste`, `pastebindl`, `pastedl` | `malvin/downloads.js` |
| `patrol` | `defend-land`, `guardpatrol` | `malvin/exploration.js` |
| `percent` | `calcpercent`, `pct`, `percentage` | `malvin/utility.js` |
| `petactivate` | `pactivate`, `petstore`, `petswap` | `malvin/pet.js` |
| `petfeed` | `feedpet`, `pfeed` | `malvin/pet.js` |
| `petinfo` | `petstat`, `pinfo` | `malvin/pet.js` |
| `petrelease` | `prelease`, `releasepet` | `malvin/pet.js` |
| `petrename` | `prename`, `renamepet` | `malvin/pet.js` |
| `pets` | `mypet`, `mypets`, `petlist` | `malvin/pet.js` |
| `petspecies` | `allpets`, `petguide`, `pspecies` | `malvin/pet.js` |
| `pickpocket` | `dip`, `liftstuff` | `malvin/gambling.js` |
| `pilgrimage` | `holytrip`, `sacredjourney` | `malvin/survival.js` |
| `pillage` | `plunder`, `raid-player` | `malvin/combat.js` |
| `ping` | `p`, `pi` | `malvin/general.js` |
| `pinstalk` | `pin`, `pinterest`, `pintereststalk` | `malvin/stalk.js` |
| `pinterest` | `pin`, `pinterestdl` | `malvin/downloads.js` |
| `pixhost` | — | `malvin/tourl.js` |
| `play` | `audiodoc`, `song`, `ytmp3`, `ytmp3doc` | `malvin/play.js` |
| `player` | `footballplayer`, `soccerplayer` | `malvin/sports.js` |
| `poison` | `toxic`, `venom` | `malvin/combat.js` |
| `pokemon` | `pokedex` | `malvin/info.js` |
| `poker` | `handpoker`, `videopoker` | `malvin/gambling.js` |
| `polish` | `gempolish`, `shine` | `malvin/gathering.js` |
| `poll` | `createpoll`, `vote` | `malvin/utility.js` |
| `pollinations` | — | `malvin/ai.js` |
| `portal` | `openportal`, `warpgate` | `malvin/exploration.js` |
| `potion-batch` | `brewbatch`, `potionbatch` | `malvin/gathering.js` |
| `pp` | `setpp` | `malvin/owner.js` |
| `pray` | `prayer`, `worship` | `malvin/survival.js` |
| `prestige` | `prestigeinfo` | `malvin/progression.js` |
| `profile` | `me`, `rank` | `malvin/rpg.js` |
| `promote` | `toadmin` | `malvin/group.js` |
| `propaganda` | `demoralize`, `spreadrumor` | `malvin/social.js` |
| `prospect` | `scout-area`, `survey` | `malvin/gathering.js` |
| `pubg` | — | `malvin/ephoto360.js` |
| `purify` | `bodypurify`, `detox` | `malvin/survival.js` |
| `purple` | `metallic` | `malvin/ephoto360.js` |
| `pvp-rank` | `killlb`, `pvplb` | `malvin/combat.js` |
| `qc` | `quotly` | `malvin/converter.js` |
| `qr` | `generateqr`, `qrcode` | `malvin/info.js` |
| `questclaim` | `claimquest`, `qclaim` | `malvin/quests.js` |
| `questlog` | `completedquests`, `qlog` | `malvin/quests.js` |
| `quests` | `myquests`, `q`, `quest` | `malvin/quests.js` |
| `quote` | — | `malvin/info.js` |
| `rage-mode` | `fullrage`, `ragemode` | `malvin/combat.js` |
| `raid` | `guildraid` | `malvin/combat.js` |
| `random` | `randnum`, `randomnumber`, `rng` | `malvin/utility.js` |
| `rankup` | `nextrank`, `rankcheck` | `malvin/progression.js` |
| `rare-fish` | `deepfish`, `rarefish` | `malvin/gathering.js` |
| `rebirth` | `reincarnate`, `reset` | `malvin/progression.js` |
| `recipe-book` | `allrecipes`, `recipebook` | `malvin/gathering.js` |
| `refine` | `purify`, `upgrade-mat` | `malvin/gathering.js` |
| `reject` | `decline` | `malvin/group.js` |
| `rejectall` | `declineall` | `malvin/group.js` |
| `release` | `freeshadow` | `malvin/combat.js` |
| `release-bail` | `bail`, `paybail` | `malvin/social.js` |
| `repair` | `fix`, `mend` | `malvin/gathering.js` |
| `repo` | `rep`, `sc`, `script` | `malvin/general.js` |
| `report` | `request` | `malvin/general.js` |
| `reputation` | `rep`, `worldrep` | `malvin/social.js` |
| `research` | `investigate`, `study` | `malvin/gathering.js` |
| `resetallsettings` | `defaultsetting`, `resetconfig` | `malvin/settings.js` |
| `resetdb` | `factoryreset`, `flushdatabase`, `flushdb`, `resetdatabase`, `wipedatabase`, `wipedb` | `malvin/settings.js` |
| `resetgroup` | `cleargc`, `cleargroupsettings`, `resetgc`, `resetgroupsettings` | `malvin/settings.js` |
| `resetlink` | `newlink`, `resetgclink`, `resetgrouplink`, `revoke`, `revokelink` | `malvin/group.js` |
| `resetsetting` | `defaultsetting`, `resetconfig` | `malvin/settings.js` |
| `resetsudo` | `clearsudo`, `clearsudos`, `deleteallsudos`, `resetsudos` | `malvin/settings.js` |
| `retroneon` | — | `malvin/ephoto360.js` |
| `return` | `imagemenu` | `malvin/general.js` |
| `revive` | `respawn`, `resurrect` | `malvin/combat.js` |
| `rift-open` | `openrift`, `rift` | `malvin/exploration.js` |
| `rift-scan` | `riftscan`, `scanrift` | `malvin/exploration.js` |
| `risk-it` | `riskgame`, `riskit` | `malvin/gambling.js` |
| `rob` | `mug`, `steal` | `malvin/gambling.js` |
| `roleinfo` | `classinfo`, `jobinfo` | `malvin/roles.js` |
| `roles` | `jobroles`, `rolelist` | `malvin/roles.js` |
| `roll` | `diceroll`, `throwdice` | `malvin/games.js` |
| `roulette` | `spin`, `wheel` | `malvin/gambling.js` |
| `route` | `directions`, `path` | `malvin/exploration.js` |
| `rov` | — | `malvin/ephoto360.js` |
| `rpg-ban` | `banrpg`, `rpgban` | `malvin/rpgAdmin.js` |
| `rpg-broadcast` | `rpgannounce`, `rpgbroadcast` | `malvin/rpgAdmin.js` |
| `rpg-give` | `admingiverpg`, `giverpg`, `rpggive` | `malvin/rpgAdmin.js` |
| `rpg-immortal` | `adminimmortal`, `setimmortal` | `malvin/rpgAdmin.js` |
| `rpg-lookup` | `adminlookup`, `playerinfo`, `rpglookup` | `malvin/rpgAdmin.js` |
| `rpg-reset` | `adminresetrpg`, `resetrpg` | `malvin/rpgAdmin.js` |
| `rpg-setlevel` | `adminsetlevel`, `setlevelrpg` | `malvin/rpgAdmin.js` |
| `rpg-setworld` | `adminsetworld`, `setworld` | `malvin/rpgAdmin.js` |
| `rpg-stats` | `adminrpg`, `rpgglobal`, `rpgstats` | `malvin/rpgAdmin.js` |
| `rpg-unban` | `rpgunban`, `unbanrpg` | `malvin/rpgAdmin.js` |
| `rpgweather` | `conditions`, `forecast`, `huntweather` | `malvin/exploration.js` |
| `rune-craft` | `makerune`, `runecraft` | `malvin/gathering.js` |
| `sand` | `dbz` | `malvin/ephoto360.js` |
| `save` | `.`, `s`, `sav`, `sv` | `malvin/general.js` |
| `savefrom` | `savefromdl`, `sf` | `malvin/downloads.js` |
| `scout` | `recon`, `survey` | `malvin/combat.js` |
| `scratch` | `card`, `scratchcard` | `malvin/gambling.js` |
| `search-gate` | `findgate`, `gatescout`, `searchgate` | `malvin/exploration.js` |
| `secret-path` | `secretpath`, `shortcut` | `malvin/exploration.js` |
| `security` | — | `malvin/canvas.js` |
| `sell` | `sellall`, `sellmats` | `malvin/gathering.js` |
| `senate` | `propose`, `senate-vote` | `malvin/social.js` |
| `sendaudio` | `dlaudio`, `dlmp3`, `sendmp3` | `malvin/play.js` |
| `sendvideo` | `dlmp4`, `dvideo`, `sendmp4` | `malvin/play.js` |
| `serieatable` | `serieastandings` | `malvin/sports.js` |
| `serieatopscorers` | `serieascorers` | `malvin/sports.js` |
| `serieaupcoming` | `serieafixtures` | `malvin/sports.js` |
| `set-karma` | — | `malvin/origin.js` |
| `set-player` | — | `malvin/origin.js` |
| `setantibad` | `antibad`, `antibadwords`, `badwordfilter` | `malvin/settings.js` |
| `setanticall` | `anticall`, `blockcall` | `malvin/settings.js` |
| `setantidelete` | `antidel`, `antidelete` | `malvin/settings.js` |
| `setantiedit` | `antiedit` | `malvin/settings.js` |
| `setantilink` | `antilink` | `malvin/settings.js` |
| `setantinsfw` | `antinsfw`, `antiporn`, `nsfwfilter` | `malvin/settings.js` |
| `setautoreply` | `autoreply` | `malvin/settings.js` |
| `setautoreplystatus` | `defaultsettings`, `resetall`, `resetsettings` | `malvin/settings.js` |
| `setbotname` | `botname`, `changename`, `namebot` | `malvin/settings.js` |
| `setbotpic` | `botimage`, `botpic`, `setbotimage` | `malvin/settings.js` |
| `setcaption` | `botcaption`, `caption` | `malvin/settings.js` |
| `setchatbot` | `ai`, `chatbot`, `setai` | `malvin/settings.js` |
| `setfont` | `botfont`, `font`, `fontstyle` | `malvin/settings.js` |
| `setfooter` | `botfooter`, `footer` | `malvin/settings.js` |
| `setgcpresence` | `gcpresence`, `grouppresence`, `grppresence` | `malvin/settings.js` |
| `setgender` | `gender`, `mygender` | `malvin/register.js` |
| `setgoodbye` | `bye`, `goodbye`, `goodbyemsg` | `malvin/settings.js` |
| `setgroupevents` | `events`, `gcevents`, `groupevents`, `setgcevents` | `malvin/settings.js` |
| `setgrouplang` | `grouplang` | `malvin/utility.js` |
| `sethome` | `home`, `setbase` | `malvin/exploration.js` |
| `setmode` | `botmode`, `changemode`, `mode` | `malvin/settings.js` |
| `setname` | `changename`, `rename` | `malvin/register.js` |
| `setownername` | `myname`, `ownername` | `malvin/settings.js` |
| `setownernumber` | `mynumber`, `ownernum`, `ownernumber` | `malvin/settings.js` |
| `setpackauthor` | `packauthor`, `stickerauthor` | `malvin/settings.js` |
| `setpackname` | `packname`, `stickername`, `stickerpack` | `malvin/settings.js` |
| `setpmpermit` | `pmpermit` | `malvin/settings.js` |
| `setprefix` | `botprefix`, `changeprefix`, `prefix` | `malvin/settings.js` |
| `setrole` | `chooserole`, `classchange`, `pickrole` | `malvin/roles.js` |
| `setsetting` | `getconfig`, `viewsetting` | `malvin/settings.js` |
| `setstartmsg` | `startingmessage`, `startmessage`, `startmsg` | `malvin/settings.js` |
| `setsudo` | `addsudo` | `malvin/owner.js` |
| `settime` | `settimemult`, `worldspeed` | `malvin/world.js` |
| `settings` | `allsettings`, `botsetting`, `botsettings`, `setting` | `malvin/settings.js` |
| `setwelcome` | `welcome`, `welcomemsg` | `malvin/settings.js` |
| `shadow-ban` | — | `malvin/origin.js` |
| `shadow-bet` | `armybet`, `shadowbet` | `malvin/gambling.js` |
| `shadow-forge` | `darkforge`, `shadowforge` | `malvin/gathering.js` |
| `shadow-power` | `armypower`, `shadowstr` | `malvin/combat.js` |
| `shadow-travel` | `darktravel`, `shadowtravel` | `malvin/exploration.js` |
| `shadows` | `army`, `shadowlist` | `malvin/combat.js` |
| `shell-game` | `shellgame`, `thimblerig` | `malvin/gambling.js` |
| `ship` | — | `malvin/canvas.js` |
| `shorten` | `b64dec`, `base64decode` | `malvin/utility.js` |
| `siege` | `assault`, `storming` | `malvin/combat.js` |
| `skill` | `cast`, `useskill` | `malvin/combat.js` |
| `skills` | `skill`, `skillshop` | `malvin/progression.js` |
| `skipseason` | `setseason`, `worldseason` | `malvin/world.js` |
| `sleep` | `nap`, `rest` | `malvin/survival.js` |
| `slot` | `slotmachine`, `slots` | `malvin/gambling.js` |
| `smelt-all` | `refineall`, `smeltall` | `malvin/gathering.js` |
| `snack` | `sck`, `snackdl`, `snackvideo` | `malvin/downloads.js` |
| `snackvideo2` | `snack2`, `sv2` | `malvin/downloads.js` |
| `snow` | `metallic` | `malvin/ephoto360.js` |
| `socket` | `gem`, `socketing` | `malvin/gathering.js` |
| `soul-mend` | `soulmend`, `soulrestore` | `malvin/survival.js` |
| `soulmate` | `marriage`, `partner`, `spouse` | `malvin/social.js` |
| `spirit-link` | `spiritbond`, `spiritlink` | `malvin/survival.js` |
| `sportshelp` | `footballhelp`, `soccerhelp` | `malvin/sports.js` |
| `spotify` | `spoti`, `spotidl`, `spotifydl` | `malvin/downloads.js` |
| `spotifycard` | — | `malvin/canvas.js` |
| `spy` | `infiltrate`, `spyguild` | `malvin/social.js` |
| `stalkhelp` | `stalkcmds`, `stalkcommands` | `malvin/stalk.js` |
| `start` | `play`, `register` | `malvin/register.js` |
| `stats` | `attributes`, `stat` | `malvin/progression.js` |
| `statusemojis` | `likeemojis` | `malvin/settings.js` |
| `statuslike` | `autolike`, `autolikestatus`, `autostatuslike`, `likestatus` | `malvin/settings.js` |
| `statusreply` | `setstatusreplytext`, `statusreplytext` | `malvin/settings.js` |
| `sticker` | `st`, `take` | `malvin/converter.js` |
| `stock` | `shares`, `stockinfo`, `stockprice` | `malvin/crypto.js` |
| `stun` | `immobilize`, `paralyze` | `malvin/combat.js` |
| `summon` | `callally`, `conjure` | `malvin/combat.js` |
| `support` | `fork`, `github`, `star` | `malvin/general.js` |
| `surveyor` | `landvalue`, `survey-land` | `malvin/exploration.js` |
| `survival-rank` | `survivallb`, `survivalrank` | `malvin/survival.js` |
| `system-bc` | — | `malvin/origin.js` |
| `tagadmins` | `taggcadmins`, `taggroupadmins` | `malvin/group.js` |
| `tagall` | `mentionall` | `malvin/group.js` |
| `taunt` | `challenge`, `provoke` | `malvin/combat.js` |
| `tax-set` | `settax`, `taxrate` | `malvin/social.js` |
| `team` | `club`, `footballteam`, `soccerteam` | `malvin/sports.js` |
| `terabox` | `1024terabox`, `tbdl`, `teraboxdl` | `malvin/downloads.js` |
| `territory` | `mylands`, `territories` | `malvin/exploration.js` |
| `territory-income` | `collectland`, `territoryincome` | `malvin/exploration.js` |
| `texthelp` | `textmenu` | `malvin/text.js` |
| `textmenu` | `originmenu` | `malvin/general.js` |
| `threads` | `threadsdl` | `malvin/downloads.js` |
| `thunder` | — | `malvin/ephoto360.js` |
| `tictactoe` | `ttt`, `tttstart` | `malvin/games.js` |
| `tiktok` | `tiktokdl`, `tt`, `ttdl` | `malvin/downloads.js` |
| `tiktok2` | `tiktokaplmate`, `tt2`, `ttaplmate` | `malvin/downloads.js` |
| `tiktok5` | `tiktokv5`, `tt5` | `malvin/downloads.js` |
| `tiktok7` | `tiktokv7`, `tt7` | `malvin/downloads.js` |
| `tiktokv2` | `tikv2`, `ttv2` | `malvin/downloads.js` |
| `time` | `clock`, `worldtime` | `malvin/info.js` |
| `timer` | `countdown`, `remind`, `remindme` | `malvin/utility.js` |
| `timezone` | `citytime`, `settz`, `timein`, `timezone`, `tz`, `tzone` | `malvin/settings.js` |
| `title` | `settitle`, `titles` | `malvin/progression.js` |
| `toaudio` | `tomp3` | `malvin/converter.js` |
| `togroupstatus` | `groupstatus`, `statusgroup`, `togcstatus` | `malvin/group.js` |
| `toimg` | `s2img` | `malvin/converter.js` |
| `tool-stats` | `mytools`, `toolstats` | `malvin/gathering.js` |
| `toolsmenu` | `groupmenu` | `malvin/general.js` |
| `topcrypto` | `cryptotop`, `top10crypto`, `topcoins` | `malvin/crypto.js` |
| `toptt` | `tovn`, `tovoice`, `tovoicenote` | `malvin/converter.js` |
| `tostatus` | `fwdstatus`, `statusfwd`, `tomystatus` | `malvin/owner.js` |
| `tovideo` | `blackscreen`, `toblackscreen`, `tomp4`, `tovid` | `malvin/converter.js` |
| `tower` | `climbtower`, `towergame` | `malvin/gambling.js` |
| `transmute` | `convert-mat`, `transform` | `malvin/gathering.js` |
| `travel` | `go`, `move`, `tp` | `malvin/exploration.js` |
| `treasure-hunt` | `findit`, `treasurehunt` | `malvin/gambling.js` |
| `treaty` | `formtreaty`, `pact` | `malvin/social.js` |
| `triple-or-nothing` | `ton`, `tripleornothing` | `malvin/gambling.js` |
| `ttstalk` | `tiktok`, `tiktokstalk`, `tt` | `malvin/stalk.js` |
| `tttai` | `aitt`, `tictactoeai`, `tttbot` | `malvin/games.js` |
| `tttboard` | `board`, `tttshow` | `malvin/games.js` |
| `tttend` | `cancelttt`, `endttt`, `stopttt`, `tictactoeend`, `tictactoestop`, `ttstop`, `tttcancel` | `malvin/games.js` |
| `tttjoin` | `jointtt` | `malvin/games.js` |
| `tweet` | — | `malvin/canvas.js` |
| `twitter` | `twitterdl`, `twitterdownloader`, `x`, `xdl`, `xdownloader` | `malvin/downloads.js` |
| `twitter2` | `twitterdl2`, `x2` | `malvin/downloads.js` |
| `twitterstalk` | `twitter`, `x`, `xstalk` | `malvin/stalk.js` |
| `ucltable` | `championsleaguetable`, `uclstandings` | `malvin/sports.js` |
| `ucltopscorers` | `championsleaguescorers`, `uclscorers` | `malvin/sports.js` |
| `uclupcoming` | `championsleaguefixtures`, `uclfixtures` | `malvin/sports.js` |
| `ummy` | `instagramdl`, `ummydl` | `malvin/downloads.js` |
| `unblock` | `unblockuser` | `malvin/owner.js` |
| `university` | `uni`, `universitysearch` | `malvin/info.js` |
| `unmute` | `adminonly`, `adminsonly`, `gcopen`, `groupopen`, `open` | `malvin/group.js` |
| `update` | — | `malvin/owner-utils.js` |
| `updatenote` | `editnote`, `modifynote` | `malvin/notes.js` |
| `upgrade` | `upstat` | `malvin/rpg.js` |
| `upgrade-tool` | `tooltier`, `upgradetool` | `malvin/gathering.js` |
| `uptime` | `up` | `malvin/general.js` |
| `uselessfact` | — | `malvin/info.js` |
| `userinfo` | `waprofile` | `malvin/owner.js` |
| `uuid` | `generateid`, `guid`, `randomid` | `malvin/utility.js` |
| `vcf` | `contacts`, `savecontact`, `savecontacts`, `scontact` | `malvin/owner-utils.js` |
| `venice` | `ai` | `malvin/ai.js` |
| `venue` | `ground`, `stadium` | `malvin/sports.js` |
| `video` | `dlmp4`, `mp4`, `ytmp4`, `ytmp4doc` | `malvin/play.js` |
| `vidsplay` | `vidsplaydl`, `vplay` | `malvin/downloads.js` |
| `vintage` | `bp` | `malvin/ephoto360.js` |
| `void-jackpot` | `ultimatejackpot`, `voidjackpot` | `malvin/gambling.js` |
| `void-strike` | `dimensionstrike`, `voidstrike` | `malvin/combat.js` |
| `void-walk` | `dimensionwalk`, `voidwalk` | `malvin/exploration.js` |
| `vote` | `poll`, `upvote` | `malvin/social.js` |
| `vv` | `reveal` | `malvin/owner.js` |
| `vv2` | `reveal2` | `malvin/owner.js` |
| `w` | `say`, `wcgword`, `word` | `malvin/games.js` |
| `war-cry` | `battlecry`, `warcry` | `malvin/combat.js` |
| `warp-stone` | `hearthstone`, `warpstone` | `malvin/exploration.js` |
| `waypoint` | `warp`, `wp` | `malvin/exploration.js` |
| `wcg` | `wcgstart`, `wordchain`, `wordgame` | `malvin/games.js` |
| `wcgai` | `aiwcg`, `wcgbot`, `wordchainai` | `malvin/games.js` |
| `wcgbegin` | `startwcg`, `wcggo` | `malvin/games.js` |
| `wcgend` | `endwcg`, `stopwcg`, `wcgcancel`, `wcgstop` | `malvin/games.js` |
| `wcgjoin` | `joinwcg`, `joinwordchain` | `malvin/games.js` |
| `wcgscores` | `wcgscore`, `wordchainscore` | `malvin/games.js` |
| `weather` | `climate`, `temp`, `weatherinfo` | `malvin/info.js` |
| `welcomemsg` | `setwelcomemsg`, `setwelcometext`, `welcomemessage` | `malvin/settings.js` |
| `welcomev1` | — | `malvin/canvas.js` |
| `welcomev2` | — | `malvin/canvas.js` |
| `welcomev3` | — | `malvin/canvas.js` |
| `welcomev4` | — | `malvin/canvas.js` |
| `welcomev5` | — | `malvin/canvas.js` |
| `wheel-of-fate` | `fatewheel`, `wheeloffate` | `malvin/gambling.js` |
| `whois` | `findplayer`, `lookup` | `malvin/register.js` |
| `wings` | `bp` | `malvin/ephoto360.js` |
| `wipe-users` | — | `malvin/origin.js` |
| `woodcut` | `chop`, `lumber`, `wood` | `malvin/gathering.js` |
| `wordcount` | `charcount`, `countwords`, `wc` | `malvin/utility.js` |
| `world-reset` | — | `malvin/origin.js` |
| `worldescape` | `escapworld`, `returnworld`, `wescape` | `malvin/world.js` |
| `worldmod` | `wmod`, `worldbuff`, `worldeffect` | `malvin/world.js` |
| `worlds` | `allworlds`, `realms`, `worldlist` | `malvin/world.js` |
| `worldtime` | `aevoria`, `worldclock`, `wtime` | `malvin/world.js` |
| `worldtravel` | `enterworld`, `tworld`, `wtravel` | `malvin/world.js` |
| `wquestclaim` | `claimwquest`, `wqclaim` | `malvin/world.js` |
| `wquests` | `worldmission`, `worldquests`, `wq` | `malvin/world.js` |
| `xkcd` | `comic` | `malvin/info.js` |
| `yt` | `youtube`, `ytdl`, `ytmp3`, `ytmp4` | `malvin/downloads.js` |
| `ytstalk` | `youtube`, `youtubestalk`, `yt` | `malvin/stalk.js` |
| `zodiac` | `horoscope` | `malvin/info.js` |
