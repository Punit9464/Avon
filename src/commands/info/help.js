const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const AvonCommand = require("../../structures/avonCommand");

class Help extends AvonCommand{
    get name(){
        return 'help';
    }
    get aliases(){
        return 'h'
    }
    get cat(){
        return 'info'
    }
    async run(client,message,args,prefix){
        try{
        let em = new EmbedBuilder().setColor(client.config.color).setAuthor({name : `${client.user.username} HelpDesk`,iconURL : client.user.displayAvatarURL()}).setDescription(
            `Hey ${message.author} I am ${client.user.username}
             A complete Music Bot for your server
             Providing you the best quality music
             
             ${client.emoji.arrow} [Invite]() | [Support]() | [Vote]()`
        ).addFields({
            name : `Command Categories`,
            value : `${client.emoji.music} \`:\` Music \n ${client.emoji.filters} \`:\` Filters \n ${client.emoji.settings} \`:\` Settings \n ${client.emoji.info} \`:\` Information`
        }).setFooter({text : `Developed with ❤️ By Avon Development` , iconURL : message.guild.iconURL({dynamic : true})}).setThumbnail(message.author.displayAvatarURL({dynamic : true}))

        let b1 = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`m1`).setEmoji(client.emoji.music);
        let b2 = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`m2`).setEmoji(client.emoji.filters);
        let b3 = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`m3`).setEmoji(client.emoji.settings);
        let b4 = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`m4`).setEmoji(client.emoji.info);
        let b5 = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`m5`).setEmoji(client.emoji.allCommands);
        let ro = new ActionRowBuilder().addComponents(b1,b2,b3,b4,b5);

        let em1 = new EmbedBuilder().setColor(client.config.color).addFields({name : `__Music Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `music`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `music`).map(r => `\`${r.name}\``).sort().join(`, `)}`});
        let em2 = new EmbedBuilder().setColor(client.config.color).addFields({name : `__Filter Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `filters`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `filters`).map(r => `\`${r.name}\``).sort().join(`, `)}`});
        let em3 = new EmbedBuilder().setColor(client.config.color).addFields({name : `__Settings Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `set`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `set`).map(r => `\`${r.name}\``).sort().join(`, `)}`});
        let em4 = new EmbedBuilder().setColor(client.config.color).addFields({name : `__Information Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `info`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `info`).map(r => `\`${r.name}\``).sort().join(`, `)}`});
        let em5 = new EmbedBuilder().setColor(client.config.color).addFields([
            {
                name : `__Music Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `music`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `music`).map(r => `\`${r.name}\``).sort().join(`, `)}`
            },
            {
                name : `__Filter Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `filters`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `filters`).map(r => `\`${r.name}\``).sort().join(`, `)}`
            },
            {
                name : `__Settings Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `set`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `set`).map(r => `\`${r.name}\``).sort().join(`, `)}`
            },
            {
                name : `__Information Commands__ [${client.AvonCommands.commands.filter(x => x.cat && x.cat === `info`).size}]`,value : `${client.AvonCommands.commands.filter(x => x.cat && x.cat === `info`).map(r => `\`${r.name}\``).sort().join(`, `)}`
            }
        ]).setThumbnail(message.author.displayAvatarURL({dynamic : true})).setFooter({text : `Developed with ❤️ By Avon Development` , iconURL : message.guild.iconURL({dynamic : true})})


        let msg = await message.channel.send({embeds : [em],components : [ro]});
        let call = await msg.createMessageComponentCollector({
            filter:(o) =>{
                if(o.user.id === message.author.id) return true;
                else{
                    return o.reply({content : `${client.emoji.cross} | This is not your session run ${prefix}help instead.`,ephemeral : true})
                }
            },
            time : 50000,
        });
        call.on('collect',async(int) => {
            if(int.isButton())
            {
                if(int.customId === `m1`)
                {
                    return int.update({embeds : [em1]});
                }
                if(int.customId === `m2`)
                {
                    return int.update({embeds : [em2]});
                }
                if(int.customId === `m3`)
                {
                    return int.update({embeds : [em3]});
                }
                if(int.customId === `m4`)
                {
                    return int.update({embeds : [em4]});
                }
                if(int.customId === `m5`)
                {
                    return int.update({embeds : [em5]});
                }
            }
        });
        call.on('end',async() => {
            if(!msg) return;
            msg.edit({embeds : [em],components : [],content : `${client.emoji.info} | Help commands timed out. Run \`${prefix}help\` again.`})
        });
    } catch(e) { console.log(e) }
} 
}
module.exports = Help;