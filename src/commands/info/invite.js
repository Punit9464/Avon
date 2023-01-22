const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const AvonCommand = require("../../structures/avonCommand");

class Invite extends AvonCommand{
    get name(){
        return 'invite'
    }
    get aliases(){
        return 'inv'
    }
    get cat(){
        return 'info';
    }
    async run(client,message,args,prefix)
    {
        let e = new EmbedBuilder().setColor(client.config.color).setDescription(`Click [here](https://discord.com/api/oauth2/authorize?client_id=904317141866647592&permissions=36768832&scope=applications.commands%20bot) to [invite](https://discord.com/api/oauth2/authorize?client_id=904317141866647592&permissions=36768832&scope=applications.commands%20bot) me`);
        let r = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=904317141866647592&permissions=36768832&scope=applications.commands%20bot`).setLabel(`Invite`)
        )
        return message.channel.send({embeds : [e] , components : [r]});
    }
}
module.exports = Invite;