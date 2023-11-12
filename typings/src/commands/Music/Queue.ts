import pkg from "lodash";
const { chunk } = pkg;
import AvonCommand from "../../base/AvonCommand.js";

export default class Queue extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "queue";
    this.aliases = ["q"];
    this.cat = "music";
    this.manage = false;
    this.dev = false;
    this.desc = "Displays the queue of the player";
    this.vc = true;
    this.samevc = true;
    this.dispatcher = true;
    this.playing = true;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      if (!dispatcher.queue.length)
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .addFields([
                {
                  name: `Now Playing`,
                  value: `[${dispatcher.current.info.title.substring(0, 35)}](${
                    this.client.config.voteUrl
                  })`,
                },
              ])
              .setTitle(`${message.guild.name}'s Queue`),
          ],
        });

      if (dispatcher.queue.length < 11) {
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setTitle(`${message.guild.name}'s Queue`)
              .setAuthor({
                name: `${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              })
              .setDescription(
                dispatcher.queue
                  .map(
                    (x: any, i: any) =>
                      `**${i + 1}.** [${x.info.title.substring(0, 40)}](${
                        this.client.config.voteUrl
                      }) [*${this.client.utils.humanize(x.info.length)}*]`
                  )
                  .sort()
                  .join("\n")
              )
              .setFooter({
                text: `Requested By: ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(message.guild.iconURL({ dynamic: true })),
          ],
        });
      } else {
        let queue = dispatcher.queue.map(
          (x: any, i: any) =>
            `**${i + 1}.** [${x.info.title.substring(0, 40)}](${
              this.client.config.voteUrl
            }) [*${this.client.utils.humanize(x.info.length)}*]`
        );

        let maps = chunk(queue, 10);

        let pages = maps.map((x: any) => x.join("\n"));
        let page = 0;

        let em = this.client.utils
          .premiumEmbed(message.guildId)
          .setTitle(`${message.guild.name}'s Queue`)
          .setDescription(`${pages[page]}`)
          .setAuthor({
            name: `${this.client.user.username}`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setFooter({
            text: `Requested By: ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true }));
        let b1 = this.client.utils.button(`custom_id`, `Previous`, 2, `prev`);
        let b2 = this.client.utils.button(`custom_id`, `Stop`, 4, `stop`);
        let b3 = this.client.utils.button(`custom_id`, `Next`, 2, `next`);
        let row = this.client.utils.actionRow([b1, b2, b3]);
        let msg = await message.reply({
          embeds: [em],
          components: [row],
        });
        let collector = await msg.createMessageComponentCollector({
          filter: (b: any) => {
            if (b.user.id === message.author.id) return true;
            else
              return b.reply({
                content: `${this.client.emoji.cross} You are not the command requester`,
                ephemeral: true,
              });
          },
          time: 100000 * 7,
        });

        collector.on("collect", async (interaction: any) => {
          if (interaction.isButton()) {
            if (interaction.customId === `prev`) {
              page = page > 0 ? --page : pages.length - 1;
              return interaction.update({
                embeds: [
                  this.client.utils
                    .premiumEmbed(message.guildId)
                    .setTitle(`${message.guild.name}'s Queue`)
                    .setDescription(`${pages[page]}`)
                    .setAuthor({
                      name: `${this.client.user.username}`,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setFooter({
                      text: `Requested By: ${message.author.tag}`,
                      iconURL: message.author.displayAvatarURL({
                        dynamic: true,
                      }),
                    })
                    .setThumbnail(message.guild.iconURL({ dynamic: true })),
                ],
              });
            } else if (interaction.customId === `stop`) {
              await collector.stop();
              return;
            } else if (interaction.customId === `next`) {
              page = page + 1 < pages.length ? ++page : 0;
              return interaction.update({
                embeds: [
                  this.client.utils
                    .premiumEmbed(message.guildId)
                    .setTitle(`${message.guild.name}'s Queue`)
                    .setDescription(`${pages[page]}`)
                    .setAuthor({
                      name: `${this.client.user.username}`,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setFooter({
                      text: `Requested By: ${message.author.tag}`,
                      iconURL: message.author.displayAvatarURL({
                        dynamic: true,
                      }),
                    })
                    .setThumbnail(message.guild.iconURL({ dynamic: true })),
                ],
              });
            }
          }
        });
        collector.on("end", async () => {
          if (!msg) return;
          else
            return await msg.edit({
              components: [
                this.client.utils.actionRow([
                  b1.setDisabled(true),
                  b2.setDisabled(true),
                  b3.setDisabled(true),
                ]),
              ],
            });
        });
      }
    };
  }
}
