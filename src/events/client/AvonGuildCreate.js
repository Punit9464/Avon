const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, messageLink } = require("discord.js");
const AvonClientEvent = require(`../../structures/Eventhandler`);
class AvonGuildCreate extends AvonClientEvent{
    get name(){
        return 'guildCreate'
    }
    async run(guild){
        this.client.data.set(`${guild.id}-247`,`disabled`);
        this.client.data.set(`${guild.id}-autoPlay`,`disabled`);
        this.client.data2.set(`noprefix_${guild.id}`,[]);

        let channel;
        guild.channels.cache.forEach((x) => {
            if(x.type === `GUILD_TEXT` && guild.memebers.me.permissionsIn(x).has([PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.SendMessages]) && !channel)
            { channel = x }
        });
        if(!channel) return;

        let eme = new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| Thanks for Inviting me` , iconURL : this.client.user.displayAvatarURL({dynamic : true})})
        .setDescription(
            `Hey I am ${this.client.user.username} , A best quality Music bot 
            
            ❯ True Definition of a Advance music bot
            ❯ My Prefix : \`${this.client.config.prefix}\`

            __**Wanna Try me ?**__
            Try me by joining a voice channel and my command - \`${this.client.config.prefix}play\`
            Or \`${this.client.config.prefix}help\``
        ).setThumbnail(guild.iconURL({dynamic : true})).setFooter({text : `Developed with 💘 By Avon Development`}).setTimestamp();

        let b1 = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=36768832&scope=applications.commands%20bot`).setLabel(`Invite`);
        let b2 = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(`Support`).setURL(`https://discord.gg/aCbF3kPjMz`);
        let row = new ActionRowBuilder().addComponents(b1,b2);
        channel.send({embeds : [eme],components : [row]});

        let joinlog = '1065526976833667072';
        const servers = await client.shard.broadcastEval(c => c.guilds.cache.size).then(r => r.reduce((a, b) => a + b, 0));
        const users = await client.shard.broadcastEval(c => c.guilds.cache.filter(x => x.available).reduce((a, g) =>a + g.memberCount, 0)).then(r => r.reduce((acc, memberCount) => acc + memberCount, 0))
        let owner = await guild.fetchOwner();
        const invite = channel.createInvite({maxAge : 0});
        let embed = new EmbedBuilder().setColor(this.client.config.color).setAuthor({name : `| GUILD JOINED`,iconURL : this.client.user.displayAvatarURL()}).setDescription(
            `**Server Name :** ${guild.name} | **ID :** ${guild.id}
            **MemberCount :** ${guild.memberCount} Members
            **Invite :** https://discord.gg/${invite.code}
            **Guild Created :** <t:${Math.round(guild.createdTimestamp/1000)}:R> | **Guild Joined :** <t:${Math.round(guild.joinedTimestamp/1000)}:R>
            **Owner Info** : ${guild.members.cache.get(owner.id) ? guild.members.cache.get(owner.id).user.tag : 'Hoga koi mujhe kya'}
            **Servers Count :** ${servers}
            **Users Count :** ${users}`
        ).setThumbnail(guild.iconURL({dynamic : true}));
        this.client.channels.cache.get(joinlog).send({embeds : [embed]});
    }
}
module.exports = AvonGuildCreate;