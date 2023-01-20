const { EmbedBuilder } = require("discord.js");
const AvonClientEvent = require(`../../structures/Eventhandler`);
class TrackStart extends AvonClientEvent{
    get name(){
        return 'trackStart'
    }
    async run(player,track){
        let emb = new EmbedBuilder().setColor(this.client.config.color).setDescription(`[${track.info.title}](${track.info.uri}) \n Author : ${track.info.author} \n Requester : ${track.info.requester}`).setAuthor({name : `| Now Playing` , iconURL : this.client.user.displayAvatarURL()});
        const channel = this.client.channels.cache.get(player.textChannel);
        if(channel){
            return channel?.send({embeds : [emb]}).then(x => player.message = x)
        }
    }
}
module.exports = TrackStart;