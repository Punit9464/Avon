import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import AvonCommand from "../../base/AvonCommand.js";
import {
  addManagement,
  getManagement,
  manageMent,
  removeManagement,
} from "../../api/db/management.js";

import pkg from "lodash";
const { chunk } = pkg;

export default class AvonManagement extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "management";
    this.aliases = ["manage"];
    this.cat = "dev";
    this.desc = "Helps Handles management of the whole bot";
    this.dev = true;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0]) {
        return message?.channel?.send({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.config.color)
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp()
              .setTitle(`Management`)
              .setDescription(
                `\`${prefix}management add\`
                Adds a user to the bot's management
                
                \`${prefix}management remove\`
                Removes a user from bot's management
                
                \`${prefix}management list\`
                Shows the list of the current management of the bot`
              ),
          ],
        });
      }

      if (args[0].toLowerCase() === `add`) {
        let user;
        if (
          message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first()
        )
          user = message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first();
        else if (args[1]) user = await this.client.users.fetch(args[1]);
        if (!user || user === undefined)
          return message.reply({
            content: `${this.client.emoji.cross} Please provide me a valid user`,
          });
        let get = manageMent(user.id);
        if (get.MANAGE === 1)
          return message.reply({
            content: `${this.client.emoji.cross} This User ${user.tag} is already in my Management List`,
          });

        let ok = addManagement(user.id);
        if (ok === true) {
          return message.reply({
            content: `${this.client.emoji.tick} Successfully **Added** ${user.tag} to my Management List`,
          });
        } else if (ok === false) {
          return message.reply({
            content: `${this.client.emoji.cross} Error while adding to management!`,
          });
        }
      }
      if (args[0].toLowerCase() === `remove`) {
        let user;
        if (
          message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first()
        )
          user = message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first();
        else if (args[1]) user = await client.users.fetch(args[1]);
        if (!user)
          return message.reply({
            content: `${this.client.emoji.cross} Please provide me a valid user`,
          });

//        let get = manageMent(user.id);
//        if (get.MANAGE !== 1)
//          return message.reply({
//            content: `${this.client.emoji.cross} This User ${user.tag} is not in my **Management List**`,
//          });

        let remove = removeManagement(user.id);
        if (remove === true)
          return message.reply({
            content: `${this.client.emoji.tick} Successfully **Removed** User ${user.tag} from my Management List`,
          });
        else
          return message.reply({
            content: `${this.client.user.cross} I couldn't interact with database!`,
          });
      }

      if (
        args[0].toLowerCase() === `list` ||
        args[0].toLowerCase() === `show`
      ) {
        let list: string[] = [];
        let get = getManagement();
        let us;
        for (let i = 0; i < get.length; i++) {
          us = await client.users.fetch(get[i]);
          list.push(
            `[\`${i + 1}\`]. [${us.tag}](https://discord.com/users/${
              us.id
            }) (ID: ${us.id})`
          );
        }
        if (list.length < 11) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(this.client.config.color)
                .setDescription(
                  list.length !== 0
                    ? list.sort().join("\n")
                    : `No Users set yet`
                )
                .setTitle(`Management List`)
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setThumbnail(
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setFooter({ text: `${message.author.tag}:- Requester` }),
            ],
          });
        }

        let maps = chunk(list, 10);

        let pages = maps.map((x) => x.join("\n"));

        let page = 0;

        let em = new EmbedBuilder()
          .setColor(this.client.config.color)
          .setTitle(`Management List`)
          .setAuthor({
            name: `${this.client.user.username}`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`${pages[page]}`);

        let b1 = new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`prev`)
          .setLabel(`Previous`);

        let b2 = new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`nxt`)
          .setLabel(`Next`);

        let b3 = new ButtonBuilder()
          .setCustomId(`stop`)
          .setLabel(`Stop`)
          .setStyle(ButtonStyle.Danger);

        let ro = new ActionRowBuilder().addComponents([b1, b3, b2]);

        let msg = await message.reply({
          embeds: [em],
          components: [ro],
        });

        let collector = await msg.createMessageComponentCollector({
          filter: (b: any) => {
            if (b.user.id === message.author.id) return true;
            else
              return b.reply({
                content: `${this.client.emoji.cross} You are not the message requester`,
                ephemeral: true,
              });
          },
          time: 100000 * 5,
          idle: (100000 * 5) / 2,
        });

        collector.on("collect", async (interaction: any) => {
          if (interaction.isButton()) {
            if (interaction.customId === `prev`) {
              page = page > 0 ? --page : pages.length - 1;
              return interaction.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setDescription(`${pages[page]}`)
                    .setTitle(`Management List`)
                    .setAuthor({
                      name: `${this.client.user.username}`,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setThumbnail(
                      message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setFooter({ text: `${message.author.tag}:- Requester` }),
                ],
              });
            }
            if (interaction.customId === `nxt`) {
              page = page + 1 < pages.length ? ++page : 0;
              return interaction.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setDescription(`${pages[page]}`)
                    .setAuthor({
                      name: `${this.client.user.username}`,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setTitle(`Management List`)
                    .setFooter({ text: `${message.author.tag}:- Requester` })
                    .setThumbnail(
                      message.author.displayAvatarURL({ dynamic: true })
                    ),
                ],
              });
            }
            if (interaction.customId === `stop`) {
              return await collector.stop();
            }
          }
        });
        collector.on("end", async () => {
          if (!message.channel.messages.cache.get(msg.id)) return;
          else
            return await msg.edit({
              components: [
                b1.setDisabled(true),
                b3.setDisabled(true),
                b2.setDisabled(true),
              ],
            });
        });
      } else
        return message?.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.client.config.color)
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp()
              .setTitle(`Management`)
              .setDescription(
                `\`${prefix}management add\`
              Adds a user to the bot's management
              
              \`${prefix}management remove\`
              Removes a user from bot's management
              
              \`${prefix}management list\`
              Shows the list of the current management of the bot`
              ),
          ],
        });
    };
  }
}
