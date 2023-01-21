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
    get same(){
        return true
    }
    async run(client,message,args,prefix,player){
        try{
        if(!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !client.config.owners.includes(message.author.id)){
            return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| You are lacking permissions`,iconURL : message.author.displayAvatarURL({dynamic : true})})]})
        }
        if(player.autoplay === `false`){
            try{
                await player.autoplay(`true`);
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| Autoplay has been enabled in this guild` ,iconURL : message.author.displayAvatarURL({dynamic : true})})]})
            } catch(e) { return message.reply({content : `[Error] : ${e.message}`})}
        }
        if(player.autoplay === `true`){
            try{
                await player.autoplay(`false`);
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| Autoplay has been disabled in this guild` ,iconURL : message.author.displayAvatarURL({dynamic : true})})]})
            } catch(e) { return message.reply({content : `[Error] : ${e.message}`})}
        }
    } catch(e) { console.log(e) }
    }
}
module.exports = Autoplay;