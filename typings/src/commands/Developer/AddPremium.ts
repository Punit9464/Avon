import { EmbedBuilder } from "discord.js";
import AvonCommand from "../../base/AvonCommand.js";
import "ms";
import ms from "ms";
import { addPrem } from "../../api/db/premium.js";
const tiers = [
  "bronze-tier",
  "silver-tier",
  "gold-tier",
  "diamond-tier",
  "bronze_tier",
  "silver_tier",
  "gold_tier",
  "diamond_tier",
];
export default class AddPremium extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "addPremium";
    this.aliases = ["addpremium", "addprem", "+prem"];
    this.cat = "dev";
    this.manage = true;
    this.desc = "Adds Premium to a user";
    this.usage = "addPremium <user> <time> <server_count>";
    this.dev = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0])
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.config.color)
              .setAuthor({
                name: `${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              })
              .setTitle(`addPremium Syntax`)
              .setFooter({
                text: `${message.author.tag}:- Requester`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(`\`${prefix}addPremium <user> <time> <count>\``),
          ],
        });

      let user;
      if (
        message.mentions.users
          .filter((x: any) => x !== this.client.user)
          .first()
      )
        user = message.mentions.users
          .filter((x: any) => x !== this.client.user)
          .first();
      else if (args[1]) user = await this.client.users.fetch(args[0]);
      if (!user)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.config.color)
              .setDescription(
                `${this.client.emoji.cross} Please provide me a valid User`
              ),
          ],
        });
      let count: number = 0;
      let tier: string = "unknown";
      let reason: string = ``;
      let time = Math.round((Date.now() + ms("1day")) / 1000);
      if (args[1] && args[1].toLowerCase() === `bronze-tier`) {
        tier = "bronze";
        time = Math.round((Date.now() + ms(`30 days`)) / 1000);
        count = 0;
        reason = `${message.author.tag} | ${
          args.slice(2).join(" ")
            ? args.slice(2).join(" ")
            : `No Reason Provided`
        }`;
      } else if (args[1] && args[1].toLowerCase() === `silver-tier`) {
        tier = "silver";
        time = Math.round((Date.now() + ms(`30 days`)) / 1000);
        count = 1;
        reason = `${message.author.tag} | ${
          args.slice(2).join(" ")
            ? args.slice(2).join(" ")
            : `No Reason Provided`
        }`;
      } else if (args[1] && args[1].toLowerCase() === `gold-tier`) {
        tier = "gold";
        time = Math.round((Date.now() + ms(`60 days`)) / 1000);
        count = 3;
        reason = `${message.author.tag} | ${
          args.slice(2).join(" ")
            ? args.slice(2).join(" ")
            : `No Reason Provided`
        }`;
      } else if (args[1] && args[1].toLowerCase() === `diamond-tier`) {
        tier = "diamond";
        time = Math.round((Date.now() + ms(`90 days`)) / 1000);
        count = 5;
        reason = `${message.author.tag} | ${
          args.slice(2).join(" ")
            ? args.slice(2).join(" ")
            : `No Reason Provided`
        }`;
      } else if (args[1] && !tiers.includes(args[1].toLowerCase() && args[2])) {
        time = Math.round((Date.now() + ms(`${args[1]}`)) / 1000);
        count = Number(args[2]);
        tier = "special";
        reason = `${message.author.tag} | ${
          args.slice(3).join(" ")
            ? args.slice(3).join(" ")
            : "No Reason Provided"
        }`;
      } else {
        reason = `${message.author.tag} | ${
          args.slice(3).join(" ")
            ? args.slice(3).join(" ")
            : "No Reason Provided"
        }`;
        count = 1;
        tier = "none";
        time = Math.round((Date.now() + ms(`1 day`)) / 1000);
      }
      if (!time)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.config.color)
              .setTimestamp()
              .setTitle(`Wrong Input`)
              .setAuthor({
                name: `${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              })
              .setDescription(
                `${this.client.emoji.cross} Please provide me a valid time period!`
              ),
          ],
        });
      if (this.client.utils.checkUserPrem(user.id))
        return message.reply({
          embeds: [
            this.client.utils
              .errorEmbed()
              .setDescription(
                `${this.client.emoji.cross} This User is already a Premium User! Try updating premium by \`updatePremium\` Command`
              ),
          ],
        });
      let code = this.client.utils.genPremId();
      let add = addPrem(user.id, time, count, code, reason, tier);
      if (add === true)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.config.color)
              .setTimestamp()
              .setTitle(`Premium Added`)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Added** Premium to ${user} for ${count} Servers\nwhich will expire on: <t:${time}> (<t:${time}:R>)\nExecutive Code: \`${code}\``
              ),
          ],
        });
      else
        return message.reply({
          content: `${this.client.emoji.cross} Failed! Please contact my dev!`,
        });
    };
  }
}
