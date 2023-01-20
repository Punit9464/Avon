const { EmbedBuilder, ButtonBuilder , ButtonStyle, ActionRowBuilder } = require("discord.js");
const AvonClientEvent = require("../../structures/Eventhandler");

class QueueEnd extends AvonClientEvent{
    get name(){
        return 'queueEnd';
    }
    async run(player){
        try{
        let ch = this.client.channels.cache.get(player.textChannel);
        player.message?.delete().catch((e) => {});
        if(player.autoplay === `true`) return;
        let guild = this.client.guilds.cache.get(player.message.guildId);
        let em = new EmbedBuilder().setColor(this.client.config.color).setAuthor({name : `| Queue Concluded` , iconURL : guild.iconURL({dynamic : true})});
        let but1 = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://top.gg/bot/904317141866647592/vote`);
        let row = new ActionRowBuilder().addComponents(but1);
        await ch.send({embeds : [em],components : [row]});
        } catch(e) { }
    }
}
module.exports = QueueEnd;