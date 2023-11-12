import { WebhookClient } from "discord.js";
import AvonEvent from "../base/AvonEvent.js";

export default class GuildDelete extends AvonEvent {
  [x: string]: any;
  constructor(client: any) {
    super(client);
    this.name = "guildDelete";
    this.run = async (guild: any) => {
      let em = this.client.utils
        .embed()
        .setTitle(`Guild Left`)
        .setAuthor({
          name: `${this.client.user.username}`,
          iconURL: this.client.user.displayAvatarURL(),
        })
        .addFields([
          {
            name: `Guild Info`,
            value: `Guild Name: ${guild.name}\nGuild Id: ${
              guild.id
            }\nGuild Created: <t:${Math.round(
              guild.createdTimestamp / 1000
            )}:R>\nMemberCount: ${guild.memberCount} Members`,
          },
          {
            name: `Bot Info`,
            value: `Server Count: ${await this.client.cluster
              .broadcastEval((c: any) => c.guilds.cache.size)
              .then((r: any) =>
                r.reduce((a: any, b: any) => a + b, 0)
              )} Servers\nUsers Count: ${await this.client.cluster
              .broadcastEval((c: any) =>
                c.guilds.cache
                  .filter((x: any) => x.available)
                  .reduce((a: any, g: any) => a + g.memberCount, 0)
              )
              .then((r: any) =>
                r.reduce((acc: any, memberCount: any) => acc + memberCount, 0)
              )} Users`,
          },
        ]);

      const web = new WebhookClient({
        url: this.client.config.webhooks.guildDelete,
      });
      web.send({ embeds: [em] });
    };
  }
}
