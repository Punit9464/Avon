import { addGlobalAfk, addServerAfk } from "../../api/db/premium.js";
import AvonCommand from "../../base/AvonCommand.js";

export default class Afk extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "afk";
    this.aliases = ["away-from-keyboard"];
    this.cat = "utility";
    this.desc = "Sets a user or member to away from keyboard";
    this.usage = "afk [reason]";
    this.dev = false;
    this.premium = {
      guild: false,
      user: false,
    };
    this.manage = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (
        !this.client.utils.checkServerPrem(message.guildId) &&
        !this.client.utils.checkServerPremStatus(message.guildId) &&
        !this.client.utils.checkUserPrem(message.author.id)
      )
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.cross} *You discovered a [Premium Feature](${this.client.config.server}).\nYou may buy our [Premium Plan](${this.client.config.server}) to avail this feature*`
              )
              .setTitle(`Premium Required`),
          ],
        });
      //

      let reason = args[0] ? args.slice(0).join(" ") : "I'm AFK ;)";
      let time = Math.round(Date.now() / 1000);

      let msg = await message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(`Choose Your Afk Type from the buttons below`)
            .setAuthor({
              name: `${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({
                dynamic: true,
              }),
            }),
        ],
        components: [
          this.client.utils.actionRow([
            this.client.utils.button(
              `custom_id`,
              `Global Afk (Afk in Mutual Servers)`,
              4,
              `global_afk`
            ),
            this.client.utils.button(
              `custom_id`,
              `Server Afk (Afk only in this server)`,
              4,
              `server_afk`
            ),
          ]),
        ],
      });

      let collector = await msg.createMessageComponentCollector({
        filter: (b: any) => {
          if (b.user.id === message.author.id) return true;
          else
            return b.reply({
              content: `${this.client.emoji.cross} You are not the Afk Requester`,
              ephemeral: true,
            });
        },
        time: 100000 * 7,
      });

      collector.on("collect", async (interaction: any) => {
        if (interaction.isButton()) {
          if (interaction.customId === `server_afk`) {
            addServerAfk(message.author.id, reason, time, message.guildId);
            return interaction.update({
              embeds: [],
              content: `I've set your Afk to: **${reason}**`,
              allowedMentions: { repliedUser: false },
              components: [],
            });
          } else if (interaction.customId === `global_afk`) {
            addGlobalAfk(message.author.id, reason, time);

            return interaction.update({
              embeds: [],
              content: `I've set Your Global Afk to: **${reason}**`,
              allowedMentions: { repliedUser: false },
              components: [],
            });
          }
        }
      });

      collector.on("end", async () => {
        if (collector.collected) return;
        else if (!msg) return;
        else return await msg.delete().catch(() => {});
      });
    };
  }
}
