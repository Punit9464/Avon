const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const AvonCommand = require("../../structures/avonCommand");

class Autoplay extends AvonCommand{
    get name(){
        return 'autoplay'
    }
    get aliases(){
        return ['ap'];
    }
    get player(){
        return true;
    }
    get cat(){
        return 'set'
    }
    get inVoice(){
        return true
    }
    get vote(){
        return true;
    }
    get same(){
        return true
    }
    async run(client,message,args,prefix,player){
        try{
            let data = await client.data.get(`${message.guild.id}-autoPlay`);
            if(!data || data === null) client.data.set(`${message.guild.id}-autoPlay`,`disabled`);
        if(data === `disabled`){
                client.data.set(`${message.guild.id}-autoPlay`,`enabled`);
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| Autoplay has been enabled in this guild` ,iconURL : message.author.displayAvatarURL({dynamic : true})})]})
        }
        if(data === `enabled`){
                client.data.set(`${message.guild.id}-autoPlay`,`disabled`);
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| Autoplay has been disabled in this guild` ,iconURL : message.author.displayAvatarURL({dynamic : true})})]})
        }
    } catch(e) { console.log(e) }
    }
}
module.exports = Autoplay;