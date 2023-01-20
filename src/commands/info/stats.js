const AvonCommand = require("../../structures/avonCommand");
const moment = require(`moment`);
require(`moment-duration-format`);
const { EmbedBuilder , ButtonBuilder , ButtonStyle , ActionRowBuilder } = require(`discord.js`);
class stats extends AvonCommand{
    get name(){
        return 'stats'
    }
    get aliases(){
        return ['st','St','Stats']
    }
    async run(client,message,args,prefix){
        try{
        let uptime = moment.duration(message.client.uptime).format(`D[days], H[hrs], m[mins], s[secs]`);
        let embed = new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| ${client.user.username} Information` , iconURL : client.user.displayAvatarURL()}).setDescription(
            `❯ **Name :** [${client.user.username}](https://discord.com/users/${client.user.id})
            ❯ **Servers :** ${client.guilds.cache.size} 
            ❯ **Users :** ${client.guilds.cache.reduce((a,b) => a + b.memberCount,0)}
            ❯ **Discord.js :** 14.7.1
            ❯ **Uptime :** ${uptime}`
        ).addFields([
            {name : `${client.emoji.owner} __OWNER__` , value : `[~ Rihan_xD#9999](https://discord.com/users/763992862857494558) | [~ Punit_xD🥀#5834](https://discord.com/users/765841266181144596)`},
            {name : `${client.emoji.admin} __ADMIN__` , value : `[!! SuMiT_xD </>#7798](https://discord.com/users/1031106211128549407) | [Ɲ ᵞ 𒌋 ALONE#0031](https://discord.com/users/735003878424313908)`}
        ]).setThumbnail(client.user.displayAvatarURL()).setFooter({text : `Requested By : ${message.author.tag}` , iconURL : message.author.displayAvatarURL({dynamic : true})});

        let b1 = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel(`${Math.round(client.ws.ping)} ms`).setDisabled(true).setCustomId(`lolok`);
        let b2 = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel(`${client.guilds.cache.reduce((a,b) => a + b.memberCount,0)} Users`).setDisabled(true).setCustomId(`lolbhai`);
        let b3 = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel(`${client.guilds.cache.size} Servers`).setDisabled(true).setCustomId(`bc`);

        let row = new ActionRowBuilder().addComponents(b3,b2,b1);

        return message.channel.send({embeds : [embed] , components : [row]});
    } catch(e) { console.error(e) }
    }
}
module.exports = stats;