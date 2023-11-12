import AvonCommand from "../../base/AvonCommand.js";
import ms from "ms";
import { updatePrem } from "../../api/db/premium.js";
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
export default class UpdatePremium extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "updatePremium";
    this.aliases = ["updateprem", "updatepremium"];
    this.cat = "dev";
    this.desc = "Updates the premium for a user by management";
    this.usage = "updatePremium <user> <time> <server_count>";
    this.manage = true;
    this.dev = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0])
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
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
            new this.client.utils.errorEmbed().setDescription(
              `${this.client.emoji.cross} Please provide me a valid User`
            ),
          ],
        });

      if (this.client.utils.checkUserPrem(user.id) === false)
        return message.reply({
          embeds: [
            this.client.utils
              .errorEmbed()
              .setDescription(
                `${this.client.emoji.cross} This User ${user} is not a Premium User`
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
            this.client.utils
              .errorEmbed()
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
      let code = this.client.utils.genPremId();
      let add = updatePrem(user.id, time, count, code, reason, tier);
      if (add === true)
        return message.reply({
          embeds: [
            this.client.utils
              .successEmbed()
              .setTimestamp()
              .setTitle(`Premium Updated`)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Updated** Premium to ${user} for ${count} Servers\nwhich will expire on: <t:${time}> (<t:${time}:R>)\nExecutive Code: \`${code}\``
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
