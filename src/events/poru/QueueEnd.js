const { EmbedBuilder, ButtonBuilder , ButtonStyle, ActionRowBuilder } = require("discord.js");
const AvonClientEvent = require("../../structures/Eventhandler");

class QueueEnd extends AvonClientEvent{
    get name(){
        return 'queueEnd';
    }
    async run(player){
        try{
            player.message.delete();
        let ch = this.client.channels.cache.get(player.textChannel);
        let db = await this.client.data.get(`${player.guildId}-autoPlay`);
        if(!db || db === null) this.client.data.set(`${player.guildId}-autoPlay`,`disbaled`);
        if(db === `enabled`)
        {
            let previous = player.previousTrack;
            if(!previous) return;
            let id = previous.info.identifier;
            const search = `https://www.youtube.com/watch?v=${id}&list=RD${idr}`;
            let response = await this.client.poru.resolve(search);
            const { tracks } = response;
            player.queue.add(tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))]);
            player.play();
        }
        let guild = this.client.guilds.cache.get(player.guildId);
        let em = new EmbedBuilder().setColor(this.client.config.color).setAuthor({name : `| Queue Concluded` , iconURL : guild.iconURL({dynamic : true})});
        let but1 = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://top.gg/bot/904317141866647592/vote`);
        let row = new ActionRowBuilder().addComponents(but1);
        await ch.send({embeds : [em],components : [row]});
        } catch(e) { }
    }
}
module.exports = QueueEnd;