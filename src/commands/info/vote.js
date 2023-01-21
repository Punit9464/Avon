const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const AvonCommand = require("../../structures/avonCommand");

class Vote extends AvonCommand{
    get name(){
        return 'vote'
    }
    get aliases(){
        return ['vot']
    }
    get cat(){
        return 'info'
    }
    async run(client,message,args,prefix){
        let em = new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.info} | Click [here](https://top.gg/bot/904317141866647592/vote) to [vote](https://top.gg/bot/904317141866647592/vote) me.`);
        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://top.gg/bot/904317141866647592/vote`).setLabel(`Vote`)
        );
        return message.channel.send({embeds : [em] , components : [row]});
    }
}
module.exports = Vote;