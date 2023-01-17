const { ActivityType } = require("discord.js");
const AvonClientEvents = require("../../structures/Eventhandler");

class AvonReady extends AvonClientEvents{
    get name(){
        return 'ready';
    }
    async run(){
        console.log(`${this.client.user.username} is Online!`)
        let statuses = [`${this.client.config.prefix}help`,`${this.client.config.prefix}play`]
        setInterval(() => {
            let status = statuses[Math.floor(Math.random()*statuses.length)];		
              this.client.user.setPresence({
                  activities: [
                      {
                          name: status,
                          type: ActivityType.Listening
                      }
                  ],
                  status: "idle"
              });
          }, 1000)
    }
}
module.exports = AvonReady;