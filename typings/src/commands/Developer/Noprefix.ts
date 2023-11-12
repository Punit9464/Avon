import { getGlobalNp, getServerNpDb } from "../../api/db/prefix.js";
import AvonCommand from "../../base/AvonCommand.js";
import pkg from "lodash";
const { chunk } = pkg;
export default class AvonNoprefix extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "noprefix";
    this.aliases = ["nop", "np"];
    this.cat = "dev";
    this.dev = false;
    this.desc = "Toggles Noprefix command by the management of the bot";
    this.usage = "noprefix <add/remove/list/reason> <user> [all | server]";
    this.manage = true;
    this.premium = {
      guild: false,
      user: false,
    };
    this.vc = false;
    this.samevc = false;
    this.vote = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0])
        return message.reply({
          embeds: [
            this.client.utils
              .embed()
              .setDescription(
                `\`${prefix}noprefix add\`
                Adds a user to the noprefix for bot
                
                \`${prefix}noprefix remove\`
                Removes a user from noprefix of bot
                
                \`${prefix}noprefix list\`
                Shows the noprefix list of the bot
                
                \`${prefix}noprefix reason\`
                Reason for the noprefix of a user`
              )
              .setTitle(`No Prefix Subcommands`)
              .setTimestamp()
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${message.author.tag}: Requester`,
                iconURL: this.client.user.displayAvatarURL(),
              }),
          ],
        });

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
        if (!user)
          return message.reply({
            embeds: [
              this.client.utils
                .embed()
                .setDescription(
                  `${this.client.emoji.cross} Please provide me a valid user`
                ),
            ],
          });
        if (args[2] && args[2].toLowerCase() === `all`) {
          if (this.client.utils.checkGlobalNp(user.id) === true)
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} This User ${user} is already in my **All Server's No Prefix**`
                  ),
              ],
            });
          else {
            let res = `${message.author.tag} | ${args[3] ? args.slice(3).join(" ") : "No Reason Provided"
              }`;
            this.client.utils.addGlobalNp(user.id, res);
            return message.reply({
              embeds: [
                this.client.utils
                  .successEmbed()
                  .setTitle(`Successful Addition`)
                  .setDescription(
                    `${this.client.emoji.tick} Successfully **Added** ${user} to my **All Server's No Prefix**`
                  ),
              ],
            });
          }
        } else {
          let guild: undefined | any;
          if (!args[2]) guild = message.guild;
          else if (args[2]) guild = await this.client.guilds.fetch(args[2]);
          if (!guild)
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} Please provide me a valid guild!`
                  ),
              ],
            });
          let id = guild.id;
          if (this.client.utils.checkGuildNp(id, user.id) === true) {
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} This User ${user} is already in ${guild.name}'s **Server No Prefix**`
                  ),
              ],
            });
          } else {
            let res = `${message.author.tag} | ${args[3] ? args.slcie(3).join(" ") : "No Reason Provided"
              }`;
            this.client.utils.addGuildNp(id, user.id, res);
            return message.reply({
              embeds: [
                this.client.utils
                  .successEmbed()
                  .setDescription(
                    `${this.client.emoji.tick} Successfully **Added** ${user} to ${guild.name}'s **Server No Prefix**`
                  ),
              ],
            });
          }
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
        else if (args[1]) user = await this.client.users.fetch(args[1]);
        if (!user)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} Please provide me a valid user!`
                ),
            ],
          });

        if (args[2] && args[2].toLowerCase() === `all`) {
          if (this.client.utils.checkGlobalNp(user.id) === false) {
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} This User ${user} is not present in my **All Server's No Prefix**`
                  ),
              ],
            });
          } else {
            this.client.utils.removeGlobalNp(user.id);
            return message.reply({
              embeds: [
                this.client.utils
                  .successEmbed()
                  .setDescription(
                    `${this.client.emoji.tick} Successfully **Removed** ${user} from my **All Server's No Prefix**`
                  ),
              ],
            });
          }
        } else {
          let guild: undefined | any;
          if (!args[2]) guild = message.guild;
          else if (args[2]) guild = await this.client.guilds.fetch(args[2]);
          if (!guild)
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} Please provide me a valid guild!`
                  ),
              ],
            });
          if (this.client.utils.checkGuildNp(guild.id, user.id) === false) {
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} This user ${user} is not included in ${guild.name}'s **Server No Prefix**`
                  ),
              ],
            });
          }

          this.client.utils.removeServerNp(user.id, guild.id);

          return message.reply({
            embeds: [
              this.client.utils
                .successEmbed()
                .setTitle(`Successful Removal`)
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Removed** ${user.tag} from **${guild.name}'s Server Prefix**`
                ),
            ],
          });
        }
      }

      if (
        args[0].toLowerCase() === `list` ||
        args[0].toLowerCase() === `show`
      ) {
        if (args[1] && args[1].toLowerCase() === `all`) {
          let list = getGlobalNp();
          let lol = [];
          let um;
          for (let i = 0; i < list.length; i++) {
            um = await this.client.users.fetch(list[i]);
            lol.push(
              `**${i + 1}.** [${um.tag}](${this.client.config.voteUrl}) [ID: ${um.id
              }]`
            );
          }
          if (lol.length < 11)
            return message.reply({
              embeds: [
                this.client.utils
                  .premiumEmbed(message.guild.id)
                  .setTitle(`No Prefix List: All`)
                  .setDescription(
                    lol.length ? lol.sort().join("\n") : "No Users Provided"
                  )
                  .setFooter({ text: `Requested By: ${message.author.tag}` }),
              ],
            });

          let queue = lol.map((x: any) => `${x}`);

          let maps = chunk(queue, 10);

          let pages = maps.map((x: any) => x.join("\n"));
          let page = 0;

          let em = this.client.utils
            .premiumEmbed(message.guildId)
            .setTitle(`No Prefix List: All`)
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
          let b1 = this.client.utils.button(`custom_id`, `Previous`, 4, `prev`);
          let b2 = this.client.utils.button(`custom_id`, `Stop`, 4, `stop`);
          let b3 = this.client.utils.button(`custom_id`, `Next`, 4, `next`);
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
                      .setTitle(`No Prefix List: All`)
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
                      .setTitle(`No Prefix List: All`)
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
        } else {
          let guild: any;
          if (!args[1]) guild = message.guild;
          else if (args[1]) guild = await this.client.guilds.fetch(args[1]);

          if (!guild)
            return message.reply({
              embeds: [
                this.client.utils
                  .errorEmbed()
                  .setDescription(
                    `${this.client.emoji.cross} Please provide me a valid guild!`
                  ),
              ],
            });

          let list = getServerNpDb(guild.id);
          let lol = [];
          let um;
          for (let i = 0; i < list.length; i++) {
            um = await this.client.users.fetch(list[i]);
            lol.push(
              `**${i + 1}.** [${um.tag}](${this.client.config.voteUrl}) [ID: ${um.id
              }]`
            );
          }
          if (lol.length < 11)
            return message.reply({
              embeds: [
                this.client.utils
                  .premiumEmbed(message.guild.id)
                  .setTitle(`No Prefix List: ${guild.name}`)
                  .setDescription(
                    lol.length ? lol.sort().join("\n") : "No Users provided"
                  )
                  .setFooter({ text: `Requested By: ${message.author.tag}` }),
              ],
            });

          let queue = lol.map((x: any) => `${x}`);

          let maps = chunk(queue, 10);

          let pages = maps.map((x: any) => x.join("\n"));
          let page = 0;

          let em = this.client.utils
            .premiumEmbed(message.guildId)
            .setTitle(`No Prefix List: ${guild.name}`)
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
                      .setTitle(`No Prefix List: ${guild.name}`)
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
                      .setTitle(`No Prefix List: ${guild.name}`)
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
      }

      if (args[0].toLowerCase() === 'reset') {
        if (!this.client.config.owners.includes(message.author.id)) return;

        else {
          this.client.utils.resetNoPrefix();

          return message.reply({
            content: `${this.client.emoji.tick} Successfully **Resetted** The No-Prefix for the Bot!`
          })
        }
      }
    };
  }
}
