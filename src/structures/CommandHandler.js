const { Collection , ButtonBuilder , ActionRowBuilder , ButtonStyle , EmbedBuilder } = require('discord.js');
const EventEmitter = require('events');
const { readdirSync } = require('fs');
const ascii = require(`ascii-table`);
const table = new ascii().setHeading('Avon Commands','Status');
class AvonCommands extends EventEmitter {
    constructor(client){
        super();
        this.client = client;
        this.commands = new Collection();
        this.load = false;
        this.on("error",async(err) => {console.error(err)});
        this.client.on('messageCreate',(message) => this.run(message));
    }
    loadCommands(){
        if(this.load) return this;
        readdirSync(`./src/commands/`).forEach(d => {
            const commands = readdirSync(`./src/commands/${d}/`).filter(f => f.endsWith('.js'));
            for(const cmd of commands){
                const AvonCommand = require(`${process.cwd()}/src/commands/${d}/${cmd}`);
                const command = new AvonCommand(this.client);
                this.commands.set(command.name,command);
                table.addRow(command.name,'✅');
            }
        });
        console.log(table.toString());
        this.load = true;
        return this;
    }

    async run(message){
        if(!message.guild || message.author.bot) return;
        let prefix;
        let data = await this.client.data.get(`${message.guild.id}-prefix`);
        if(data) prefix = data; else prefix = this.client.config.prefix;

        if(message.content === `<@${this.client.user.id}>`)
        {
            let b1 = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(`Invite`).setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=415602886720&scope=bot`);
            let b2 = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(`Support`).setURL(this.client.config.server);
            let b3 = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(`Vote`).setURL(`https://top.gg/bot/904317141866647592/vote`);
            let ro = new ActionRowBuilder().addComponents(b1,b2,b3);
            let embed = new EmbedBuilder().setColor(this.client.config.color).setFooter({text : `Developed with ❤️ By Avon Development` , iconURL : message.author.displayAvatarURL({dynamic : true})}).setDescription(
                `__**Settings For ${message.guild.name}**__
                Server Id : \`${message.guild.id}\`
                Voice Channel : ${message.guild.members.me.voice.channel ? message.guild.members.me.voice.channel : "`Null`"}
                Voice Channel Id : ${message.guild.members.me.voice.channel ? `\`${message.guild.members.me.voice.channelId}\`` : "`Null`"}
                My prefix here : \`${prefix}\`
                
                Try me with this command - \`${prefix}help\` or \`${prefix}play\``
            ).addFields({name : `__Links__` , value : `[Support]() | [Invite]()`}).setAuthor({name : `Hey I am ${this.client.user.username}` , iconURL : this.client.user.displayAvatarURL({dynamic : true})}).setThumbnail(message.author.displayAvatarURL({dynamic : true}))
            return message.channel.send({embeds : [embed],components : [ro]}).catch((e) => { message.author.send({content : `Error while sending message there : ${e.message}`}).catch(() => {}) })
        }
        if(!message.content.startsWith(prefix)) return;
        try{
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const avonCommand = this.commands.get(commandName) || this.commands.find((c) => c.aliases && c.aliases.includes(commandName));
        if(!avonCommand) return;
        let client = this.client;
        if(avonCommand.inVoice){
            if(message.guild.members.me.voice.channel && !message.member.voice.channel){
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.cross} | You must be connected to a voice channel.`)]})
            }
        }
        if(avonCommand.sameVoice){
            if(message.guild.members.me.voice.channelId !== message.member.voice.channelId && message.guild.members.me.voice.channel){
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.cross} | You must be connected to ${message.guild.members.me.voice.channel}`)]})
            }
        }
        let player = client.poru.players.get(message.guild.id);
        if(avonCommand.player){
            if(!player || !player.currentTrack){
                return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `| I am not playing Anything` , iconURL : message.author.displayAvatarURL({dynamic : true})})]})
            }
        }
        
        avonCommand.run(client,message,args,prefix,player).catch(() => { });
        } catch(e) { console.error(e) } 
    }
}
module.exports = AvonCommands;