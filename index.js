import { Client, WebhookClient, MessageEmbed } from 'discord.js-selfbot-v13';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';
import moment from 'moment';
import 'colors';
import { fetchUserProfile, processProfileData } from './utils/api.js';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, 'node_modules', 'discord.js-selfbot-v13', 'src', 'managers', 'ClientUserSettingManager.js');
  
  let content = readFileSync(filePath, 'utf-8');
  
  if (!content.includes('// PATCH: friend_source_flags - verifica se não é null')) {
    const patchPattern = /if \('friend_source_flags' in data\) \{[^}]+this\.addFriendFrom = \{[^}]+\};[^}]+\}/s;
    const patchReplacement = `if ('friend_source_flags' in data) {
      // PATCH: friend_source_flags - verifica se não é null
      const flags = data.friend_source_flags || {};
      this.addFriendFrom = {
        all: flags.all || false,
        mutual_friends: flags.all ? true : (flags.mutual_friends || false),
        mutual_guilds: flags.all ? true : (flags.mutual_guilds || false),
      };
    }`;
    
    if (patchPattern.test(content)) {
      content = content.replace(patchPattern, patchReplacement);
      writeFileSync(filePath, content, 'utf-8');
    }
  }
} catch (error) {
}

let config;
try {
  const configFile = readFileSync('./config.json', 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('❌ Erro ao carregar config.json:', error.message);
  process.exit(1);
}

if (!config.token) {
  console.error('❌ Token não configurado no config.json');
  process.exit(1);
}

if (!config.webhook_url) {
  console.error('❌ Webhook URL não configurada no config.json');
  process.exit(1);
}

const client = new Client({ checkUpdate: false });
const webhook = new WebhookClient({ url: config.webhook_url });

const emojiBadges = {
  '2c': '<:2c:1462561755476525167>',
  '3c': '<:3c:1462561791996592250>',
  BoostLevel1: '<:discordboost1:1462546187751002205>',
  BoostLevel2: '<:discordboost2:1462546229161623758>',
  BoostLevel3: '<:discordboost3:1462546258030755981>',
  BoostLevel4: '<:discordboost4:1462546284647809290>',
  BoostLevel5: '<:discordboost5:1462546311587827763>',
  BoostLevel6: '<:discordboost6:1462546341304729662>',
  BoostLevel7: '<:discordboost7:1462546372057235778>',
  BoostLevel8: '<:discordboost8:1462546396589592839>',
  BoostLevel9: '<:discordboost9:1462546423450042569>',
  'premium_tenure_1_month_v2': '<:bronze:1462546149079519313>',
  'premium_tenure_3_month_v2': '<:silver:1462546147401793722>',
  'premium_tenure_6_month_v2': '<:gold:1462546140321939517>',
  'premium_tenure_12_month_v2': '<:platinum:1462546142972874894>',
  'premium_tenure_24_month_v2': '<:diamond:1462546150354845851>',
  'premium_tenure_36_month_v2': '<:emerald:1462546138631639112>',
  'premium_tenure_60_month_v2': '<:ruby:1462546145220755690>',
  'premium_tenure_72_month_v2': '<:opal:1462546141731098695>',
  'NitroBronze': '<:bronze:1462546149079519313>',
  'NitroSilver': '<:silver:1462546147401793722>',
  'NitroGold': '<:gold:1462546140321939517>',
  'NitroPlatinum': '<:platinum:1462546142972874894>',
  'NitroDiamond': '<:diamond:1462546150354845851>',
  'NitroDiamante': '<:diamond:1462546150354845851>',
  'NitroEmerald': '<:emerald:1462546138631639112>',
  'NitroEsmeralda': '<:emerald:1462546138631639112>',
  'NitroRuby': '<:ruby:1462546145220755690>',
  'NitroOpal': '<:opal:1462546141731098695>',
  'NitroRubi': '<:ruby:1462546145220755690>',
  'NitroOpala': '<:opal:1462546141731098695>',
  HypeSquadOnlineHouse1: '<:hypesquadbalance:1462545536501416040>',
  HypeSquadOnlineHouse2: '<:hypesquadbravery:1462545566935290058>',
  HypeSquadOnlineHouse3: '<:hypesquadbrilliance:1462545593791549460>',
  PremiumEarlySupporter: '<:discordearlysupporter:1462545300710232216>',
  VerifiedDeveloper: '<:discordbotdev:1462545206158033027>',
  ActiveDeveloper: '<:activedev:1147277422337720462>',
  Hypesquad: '<:hypesquadevents:1462545625026527355>',
  Nitro: '<:discordnitro:1462545376946159678>',
  Staff: '<:discordstaff:1462545486044074218>',
  CertifiedModerator: '<:discordmod:1462545336131129535>',
  BugHunterLevel1: '<:discordbughunter1:1462545246930866475>',
  BugHunterLevel2: '<:discordbughunter2:1462544674865807645>',
  Partner: '<:discordpartner:1462545451403313152>',
  'Username': '<:username:1462545054282420378>',
  'Orb': '<:orb:1462545655934488746>',
  'Quest': '<:quest:1462545052680323144>',
  'quest_completed': '<:quest:1462545052680323144>',
  'guild_booster_lvl1': '<:discordboost1:1462546187751002205>',
  'guild_booster_lvl2': '<:discordboost2:1462546229161623758>',
  'guild_booster_lvl3': '<:discordboost3:1462546258030755981>',
  'guild_booster_lvl4': '<:discordboost4:1462546284647809290>',
  'guild_booster_lvl5': '<:discordboost5:1462546311587827763>',
  'guild_booster_lvl6': '<:discordboost6:1462546341304729662>',
  'guild_booster_lvl7': '<:discordboost7:1462546372057235778>',
  'guild_booster_lvl8': '<:discordboost8:1462546396589592839>',
  'guild_booster_lvl9': '<:discordboost9:1462546423450042569>',
};

const scrapBadgeEmojis = {
  BoostLevel3: '<:discordboost3:1462546258030755981>',
  BoostLevel4: '<:discordboost4:1462546284647809290>',
  BoostLevel5: '<:discordboost5:1462546311587827763>',
  BoostLevel6: '<:discordboost6:1462546341304729662>',
  BoostLevel7: '<:discordboost7:1462546372057235778>',
  BoostLevel8: '<:discordboost8:1462546396589592839>',
  BoostLevel9: '<:discordboost9:1462546423450042569>',
  PremiumEarlySupporter: '<:discordearlysupporter:1462545300710232216>',
  BugHunterLevel1: '<:discordbughunter1:1462545246930866475>',
  BugHunterLevel2: '<:discordbughunter2:1462544674865807645>',
  Hypesquad: '<:hypesquadevents:1462545625026527355>',
  VerifiedDeveloper: '<:discordbotdev:1462545206158033027>',
  Partner: '<:discordpartner:1462545451403313152>',
  CertifiedModerator: '<:discordmod:1462545336131129535>',
  Staff: '<:discordstaff:1462545486044074218>',
  'premium_tenure_24_month_v2': '<:diamond:1462546150354845851>',
  'premium_tenure_36_month_v2': '<:emerald:1462546138631639112>',
  'premium_tenure_60_month_v2': '<:ruby:1462546145220755690>',
  'premium_tenure_72_month_v2': '<:opal:1462546141731098695>',
};

// Ordem das badges para exibição
const badgeDisplayOrder = [
  '2c',
  '3c',
  'Nitro',
  'premium_tenure_1_month_v2',
  'premium_tenure_3_month_v2',
  'premium_tenure_6_month_v2',
  'premium_tenure_12_month_v2',
  'premium_tenure_24_month_v2',
  'premium_tenure_36_month_v2',
  'premium_tenure_60_month_v2',
  'premium_tenure_72_month_v2',
  'BoostLevel1',
  'BoostLevel2',
  'BoostLevel3',
  'BoostLevel4',
  'BoostLevel5',
  'BoostLevel6',
  'BoostLevel7',
  'BoostLevel8',
  'BoostLevel9',
  'Staff',
  'Partner',
  'CertifiedModerator',
  'Hypesquad',
  'HypeSquadOnlineHouse1',
  'HypeSquadOnlineHouse2',
  'HypeSquadOnlineHouse3',
  'BugHunterLevel1',
  'BugHunterLevel2',
  'ActiveDeveloper',
  'VerifiedDeveloper',
  'PremiumEarlySupporter',
  'Username',
  'Quest',
  'Orb',
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUsers(guildId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    await guild.members.fetch();
    
    const allMembers = Array.from(guild.members.cache.values());
    const memberIds = allMembers
      .filter((member) => !member.user.bot)
      .map((member) => member.id);
    
    await fs.mkdir('./files', { recursive: true });
    await fs.writeFile(`./files/${guildId}.txt`, memberIds.join('\n'));
    
    console.log('[SUCCESS]'.bgGreen + ` Saved ${memberIds.length} member IDs to ${guildId}.txt\n`.green);
    
    await delay(5000);
    showLofyBanner();
  } catch (error) {
    console.error(`❌ Erro ao buscar usuários:`, error.message);
  }
}

async function getServerInvite(guild) {
  try {
    const inviteChannel = guild.channels.cache.find(
      channel => 
        channel.type === 0 && 
        channel.permissionsFor(guild.members.me)?.has('CreateInstantInvite')
    );
    
    if (inviteChannel) {
      const url = await inviteChannel.createInvite({ maxAge: 0, maxUses: 0 });
      return `[${guild.name}](${url})\n[\`${guild.id}\`]`;
    }
  } catch (error) {
  }
  
  if (guild.vanityURLCode) {
    const url = `https://discord.gg/${guild.vanityURLCode}`;
    return `[${guild.name}](${url})\n[\`${guild.id}\`]`;
  }
  
  return '*No Invite*';
}

function isRareUsername(username) {
  if (!username) return false;
  const length = username.length;
  return length === 2 || length === 3;
}

async function badgeScrapper(guildId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const invite = await getServerInvite(guild);
    
    const memberIdsString = await fs.readFile(`./files/${guildId}.txt`, 'utf8');
    const memberIds = memberIdsString.split('\n').filter(id => id.trim());
    
    const processedIdsFile = './files/processed_ids.txt';
    let processedIds = new Set();
    try {
      const processedIdsString = await fs.readFile(processedIdsFile, 'utf8');
      processedIdsString.split('\n').forEach(id => {
        if (id.trim()) processedIds.add(id.trim());
      });
    } catch (error) {
      // Arquivo não existe ainda, cria um novo
      await fs.writeFile(processedIdsFile, '', 'utf8');
    }

    for (let i = 0; i < memberIds.length; i++) {
      const memberId = memberIds[i];
      if (!memberId) {
        continue;
      }
      
      if (processedIds.has(memberId)) {
        continue;
      }

      try {
        const proxyConfig = config.use_proxy ? (config.proxy || null) : null;
        if (proxyConfig && i === 0) {
        }
        const profileData = await fetchUserProfile(
          memberId,
          config.token,
          proxyConfig
        );

        let userFlags = [];
        try {
          const fullUser = await client.users.fetch(memberId);
          if (fullUser.flags) {
            userFlags = fullUser.flags.toArray();
          }
        } catch (error) {
        }

        const processedData = processProfileData(profileData, userFlags);

        const rarePremiumTenureBadges = [
          'premium_tenure_12_month_v2',
          'premium_tenure_24_month_v2',
          'premium_tenure_36_month_v2',
          'premium_tenure_48_month_v2',
          'premium_tenure_60_month_v2'
        ];
        
        const premiumTenureBadges = processedData.badges.filter(badge => 
          badge && (badge.startsWith('premium_tenure_') || badge.includes('premium_tenure_'))
        );
        const hasPremiumTenure = premiumTenureBadges.some(badge => 
          rarePremiumTenureBadges.includes(badge)
        );
        
        const hasRareBadges = processedData.badges.some(badge => {
          if (scrapBadgeEmojis[badge]) return true;
          if (badge && rarePremiumTenureBadges.includes(badge)) {
            return true;
          }
          return false;
        });
        const hasRareBoost = processedData.boost && 
          ['BoostLevel3', 'BoostLevel4', 'BoostLevel5', 'BoostLevel6', 'BoostLevel7', 'BoostLevel8', 'BoostLevel9']
            .includes(processedData.boost.level);
        const hasRareUsername = isRareUsername(processedData.username);

        const shouldSend = hasPremiumTenure || hasRareBadges || hasRareBoost || hasRareUsername;
        
        if (shouldSend) {
          let allBadgesForDisplay = [...processedData.badges];
          
          if (hasRareUsername) {
            const usernameLength = processedData.username.length;
            if (usernameLength === 2) {
              allBadgesForDisplay.unshift('2c');
            } else if (usernameLength === 3) {
              allBadgesForDisplay.unshift('3c');
            }
          }
          
          const premiumTenureBadgesDisplay = allBadgesForDisplay.filter(badge => 
            badge && (badge.startsWith('premium_tenure_') || badge.includes('premium_tenure_'))
          );
          const hasPremiumTenureDisplay = premiumTenureBadgesDisplay.length > 0;
          
          if (hasPremiumTenureDisplay) {
            allBadgesForDisplay = allBadgesForDisplay.filter(badge => badge !== 'Nitro');
          }
          
          if (processedData.premiumType && !hasPremiumTenureDisplay && !allBadgesForDisplay.includes('Nitro')) {
            allBadgesForDisplay.push('Nitro');
          }
          
          if (processedData.boost?.level && !allBadgesForDisplay.includes(processedData.boost.level)) {
            allBadgesForDisplay.push(processedData.boost.level);
          }
          
          // Reordena as badges para manter a ordem correta após adicionar Nitro e boost level
          allBadgesForDisplay.sort((a, b) => {
            const indexA = badgeDisplayOrder.indexOf(a);
            const indexB = badgeDisplayOrder.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
          });
          
          const allEmojisArray = allBadgesForDisplay
            .map((badge) => {
              if (badge === 'quest_completed') {
                return emojiBadges['Quest'] || '';
              }
              if (badge && badge.startsWith('guild_booster_lvl')) {
                const level = badge.replace('guild_booster_lvl', '');
                const boostLevel = `BoostLevel${level}`;
                return emojiBadges[boostLevel] || '';
              }
              return emojiBadges[badge] || '';
            })
            .filter(Boolean)
            .join('');

          const globalName = processedData.globalName || processedData.username;
          const avatarUrl = processedData.avatar 
            ? `https://cdn.discordapp.com/avatars/${memberId}/${processedData.avatar}.${processedData.avatar.startsWith('a_') ? 'gif' : 'png'}?size=4096`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(processedData.discriminator) % 5}.png`;

          const embed = new MessageEmbed()
            .setAuthor({ 
              name: `${globalName} (@${processedData.username})`, 
              iconURL: avatarUrl 
            })
            .setThumbnail(avatarUrl)
            .setColor('#2b2d31')
            .addFields([
              { name: 'Badges:', value: allEmojisArray || 'Nenhuma', inline: true },
              { 
                name: 'Creation:', 
                value: processedData.createdAt 
                  ? `<t:${moment(processedData.createdAt).unix()}:R>`
                  : 'N/A', 
                inline: true 
              },
              { name: 'From Server:', value: invite, inline: false }
            ]);

          if (processedData.boost) {
            const currentBoostLevel = processedData.boost.level;
            const nextBoostLevel = processedData.boost.nextLevel;

            const currentBoostEmoji = emojiBadges[currentBoostLevel] || currentBoostLevel;
            const nextBoostEmoji = emojiBadges[nextBoostLevel] || nextBoostLevel;

            embed.addFields([
              { 
                name: 'Boosting:', 
                value: `${currentBoostEmoji} <t:${moment(processedData.boost.date).unix()}:R>`, 
                inline: true 
              }
            ]);

            if (processedData.boost.level !== 'BoostLevel9' && processedData.boost.nextDate) {
              embed.addFields([
                { 
                  name: 'Next Up:', 
                  value: `${nextBoostEmoji} <t:${moment(processedData.boost.nextDate).unix()}:R>`, 
                  inline: true 
                }
              ]);
            }
          }

          const components = {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: 'Ver Perfil',
                url: `https://discord.com/users/${memberId}`,
              },
            ],
          };

          if (invite && invite !== '*No Invite*') {
            const inviteMatch = invite.match(/\(https?:\/\/[^)]+\)/);
            if (inviteMatch) {
              const inviteUrl = inviteMatch[0].slice(1, -1);
              components.components.push({
                type: 2,
                style: 5,
                label: 'Servidor',
                url: inviteUrl,
              });
            }
          }

          await webhook.send({
            embeds: [embed],
            components: [components]
          });
          
          processedIds.add(memberId);
          await fs.appendFile(processedIdsFile, `${memberId}\n`, 'utf8');
        }
      } catch (error) {
        console.error(`[ERROR] Erro ao processar ${memberId}:`, error.message);
        if (error.response) {
          console.error(`[ERROR] Status: ${error.response.status}`.red);
        }
        if (error.message.startsWith('RATE_LIMIT')) {
          const retryAfter = parseInt(error.message.split(':')[1]) || 5;
          console.log(`[WARN] Rate limit atingido! Aguardando ${retryAfter} segundos...`.yellow);
          console.log(`[INFO] Proxy ativa: ${config.use_proxy ? 'SIM' : 'NÃO'}`.cyan);
          if (config.use_proxy) {
            console.log(`[INFO] Proxy: ${config.proxy?.host}:${config.proxy?.port}`.cyan);
          }
          await delay(retryAfter * 1000);
          i--;
        }
      }

      // Delay configurável entre verificações de usuários
      const checkDelay = config.user_check_delay_ms || 10000;
      const specialDelay = checkDelay + 5000; // Delay adicional a cada 360 requisições
      
      if ((i + 1) % 360 === 0) {
        await delay(specialDelay);
      } else {
        await delay(checkDelay);
      }
    }

    console.log('[COMPLETE]'.bgGreen + ' Badges Scrapping process has completed.'.green);
  } catch (error) {
    console.error('❌ Erro no scraper:', error.message);
  }
}

/**
 * Exibe o banner LOFY
 */
function showLofyBanner() {
  console.clear();
  console.log(`
    

            ██╗      ██████╗ ███████╗██╗   ██╗
            ██║     ██╔═══██╗██╔════╝╚██╗ ██╔╝
            ██║     ██║   ██║█████╗   ╚████╔╝ 
            ██║     ██║   ██║██╔══╝    ╚██╔╝  
            ███████╗╚██████╔╝██║        ██║   
            ╚══════╝ ╚═════╝ ╚═╝        ╚═╝   
                                                  
                                                                                    
            • Scrapping Badges Rares... •



`.red);
}

// Banner LOFY inicial
showLofyBanner();

// Evento quando o bot está pronto
client.once('ready', async () => {
  console.log('[USER]'.bgCyan + ` Connected in ${client.user.tag}`.cyan);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\n[SERVER]'.bgYellow + ' Enter the Server ID: '.yellow, async (guildId) => {
    await fetchUsers(guildId);
    await badgeScrapper(guildId);
    rl.close();
    await client.destroy();
    process.exit(0);
  });
});

// Tratamento de erros
client.on('error', (error) => {
  console.error('❌ Erro no cliente:', error.message);
});

// Conecta o bot
client.login(config.token).catch((error) => {
  console.error('❌ Erro ao fazer login:', error.message);
  process.exit(1);
});
