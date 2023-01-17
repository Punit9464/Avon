
const AvonCommand = require("../../structures/avonCommand");

class ping extends AvonCommand {
    get name(){
        return 'ping'
    }
    async run(client,message,args,prefix){
        return message.channel.send({content : `${client.emoji.ping} | My Response Latency with Discord API : \`${Math.round(client.ws.ping)}\`ms`});
    }
}
module.exports = ping;