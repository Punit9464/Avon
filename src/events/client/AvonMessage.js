const { EmbedBuilder, PermissionsBitField , ButtonBuilder , ButtonStyle, ActionRowBuilder } = require("discord.js");
const AvonClientEvents = require("../../structures/Eventhandler.js");

class AvonMessage extends AvonClientEvents{
    get name(){
        return 'messageCreate';
    }
    async run(message){
    }
}
module.exports = AvonMessage;