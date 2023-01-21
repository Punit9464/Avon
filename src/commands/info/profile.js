const AvonCommand = require("../../structures/avonCommand");
const api = require(`@top-gg/sdk`);
const { topggapi } = require(`../../../config.json`);
const vote = new api.Api(topggapi);
const badge = require(`./badges.json`);
const { EmbedBuilder } = require("discord.js");
class Badges extends AvonCommand{
    get name(){
        return 'profile';
    }
    get aliases(){
        return ['badges','badge','pr'];
    }
    get cat(){
        return 'info'
    }
    async run(client,message,args,prefix)
    {
        try{
        const guild = client.guilds.cache.get('1010134124490666025');
        let badges = '';
        let user;
        if(message.mentions ) { let mem = message.mentions.members.first();user = guild.members.cache.get(mem.id) }
        if(args[0]) { user = guild.members.cache.get(args[0]) }
        else { user = guild.members.cache.get(message.author.id) }
        console.log(user);
        if(!user)
        {
            badges += `\`No Badges Available\` <a:badges:1066042206986719333> \n You must be avaiable in our [support server](${client.config.server}) to get your badges\nConsider Joining Support server by clicking [here](${client.config.server})`;
            return message.channel.send({embeds : [new EmbedBuilder().setColor(client.config.color).setAuthor({name : `Profile for ${user}`}).setThumbnail(user.user.displayAvatarURL({dynamcic : true})).addFields({name : `__BADGES__ <a:badges:1066042206986719333>` , value : `${badges}`})]});
        }
        else{
            let sys = user.roles.cache;
            if(sys.has(badge.dev)) badges += `\n ${client.emoji.dev} **Developer**`;
            if(sys.has(badge.owner)) badges += `\n ${client.emoji.owner} **Owner**`;
            if(sys.has(badge.codev)) badges += `\n ${client.emoji.codev} **Co-Developer**`;
            if(sys.has(badge.admin)) badges += `\n ${client.emoji.admin} **Admin**`; 
            if(sys.has(badge.supporter)) badges += `\n ${client.emoji.supporter} **Supporter**`;
            if(sys.has(badge.vip)) badges += `\n ${client.emoji.vip} **Vip**`;
            if(sys.has(badge.staff))badges += `\n ${client.emoji.staff} **Staff**`;
            if(sys.has(badge.friend)) badges += `\n ${client.emoji.friend} **Friends**`;
            if(sys.has(badge.bug)) badges += `\n ${client.emoji.bug} **Bug Hunter**`;
            if(badges === '') badges += `\n ${client.emoji.users} **User**`;
        }
    } catch(e) { console.log(e) }
}
}
module.exports = Badges;