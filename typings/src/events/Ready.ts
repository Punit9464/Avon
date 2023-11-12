import AvonEvent from "../base/AvonEvent.js";

export default class Ready extends AvonEvent {
  [x: string]: any;
  constructor(client: any) {
    super(client);
    this.name = "ready";
    this.run = async () => {
      this.client.logger.ready(`${this.client.user.username} is Online!`);

      const activities = [
        {
          content: `${this.client.config.prefix}help`,
          type: 0,
          status: `dnd`,
        },
        {
          content: `${this.client.config.prefix}play`,
          type: 2,
          status: `idle`,
        },
        {
          content: `${this.client.config.prefix}setup`,
          type: 3,
          status: `online`,
        },
      ];

      setInterval(() => {
        let activity = Math.floor(Math.random() * activities.length);
        this.client.user.setPresence({
          activities: [
            {
              name: activities[activity].content,
              type: activities[activity].type,
            },
          ],
          status: activities[activity].status,
        });
      }, 5000);
    };
  }
}
