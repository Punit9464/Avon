const { ActivityType } = require("discord.js");
const AvonClientEvent = require("../../structures/Eventhandler");
class AvonReady extends AvonClientEvent{
    get name(){
        return 'ready';
    }
    async run(){
        console.log(`${this.client.user.username} is Online!`);
        this.client.poru.init(this.client);
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
          }, 10000);
    }
}
module.exports = AvonReady;
