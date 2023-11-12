import AvonCommand from "../../base/AvonCommand.js";

export default class Help extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "help";
    this.aliases = [];
    this.cat = "utility";
    this.desc = "Provides with the help menu of the bot";
    this.usage = "help [command/category]";
    this.vc = false;
    this.dev = false;
    this.premium = {
      guild: false,
      user: false,
    };
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0]) {
        let em = this.client.utils
          .premiumEmbed(message.guildId)
          .setAuthor({
            name: `${this.client.user.username}`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setFooter({
            text: `Made with 🔥 By Avon Development`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${this.client.user.username}'s Help`)
          .setDescription(
            `Hey There It's ${this.client.user.username} True Definition of A best music bot. A music bot with all advanced features of reconnection and different search engines. Providing you the qulaity music for your server.\n\n•My default prefix for the server is: \`${prefix}\`\n•For More info over a command use: \`${prefix}help <command>\``
          )
          .addFields([
            {
              name: `Command Categories`,
              value: `> ${this.client.emoji.helpMenu.music} **: Music**\n> ${this.client.emoji.helpMenu.filters} **: Filters**\n> ${this.client.emoji.helpMenu.utility} **: Utilities**\n> ${this.client.emoji.helpMenu.info} **: Information**\n> ${this.client.emoji.helpMenu.allCommands} **: All Commands**\n\n•Select Category From Below Menu`,
            },
          ])
          .setThumbnail(this.client.user.displayAvatarURL());

        let menuOption = this.client.utils.menuOption(
          `Home`,
          `${this.client.emoji.helpMenu.home}`,
          `Returns you to the help menu page of Help Command`,
          `help-home`
        );

        let menuOption1 = this.client.utils.menuOption(
          `Music`,
          `${this.client.emoji.helpMenu.music}`,
          `Provides you the commands under Music Category`,
          `music-help`
        );
        let menuOption2 = this.client.utils.menuOption(
          `Filters`,
          `${this.client.emoji.helpMenu.filters}`,
          `Lists the commands under Filters catgory`,
          `filter-help`
        );
        let menuOption3 = this.client.utils.menuOption(
          `Utilities`,
          `${this.client.emoji.helpMenu.utility}`,
          `Lists the Utility commands of the bot`,
          `utility-help`
        );
        let menuOption4 = this.client.utils.menuOption(
          `Information`,
          `${this.client.emoji.helpMenu.info}`,
          `Provides with the informative commands of bot`,
          `info-help`
        );
        let menuOption5 = this.client.utils.menuOption(
          `All Commands`,
          `${this.client.emoji.helpMenu.allCommands}`,
          `Lists All of the Commands of the bot`,
          `all-help`
        );

        let menus = [
          menuOption,
          menuOption1,
          menuOption2,
          menuOption3,
          menuOption4,
          menuOption5,
        ];
        let menu = this.client.utils.menu(`Choose Category`, `oops`, menus);

        let msg = await message.reply({
          embeds: [em],
          components: [this.client.utils.actionRow([menu])],
        });

        let collector = await msg.createMessageComponentCollector({
          filter: (b: any) => {
            if (b.user.id === message.author.id) return true;
            else
              return b.reply({
                content: `${this.client.emoji.cross} You are not the help command requester`,
                ephemeral: true,
              });
          },
          time: 100000 * 7,
        });

        collector.on("collect", async (interaction: any) => {
          if (interaction.isSelectMenu()) {
            for (const value of interaction.values) {
              if (value === `music-help`) {
                return interaction
                  .update({
                    embeds: [
                      this.client.utils
                        .premiumEmbed(message.guildId)
                        .setTitle(`Music Commands`)
                        .addFields([
                          {
                            name: `Music [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "music"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "music")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                        ])
                        .setThumbnail(this.client.user.displayAvatarURL()),
                    ],
                  })
                  .catch(() => {});
              } else if (value === `filter-help`) {
                return interaction
                  .update({
                    embeds: [
                      this.client.utils
                        .premiumEmbed(message.guildId)
                        .setTitle(`Filter Commands`)
                        .addFields([
                          {
                            name: `Filters [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "filters"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "filters")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                        ])
                        .setThumbnail(this.client.user.displayAvatarURL()),
                    ],
                  })
                  .catch(() => {});
              } else if (value === `utility-help`) {
                return interaction
                  .update({
                    embeds: [
                      this.client.utils
                        .premiumEmbed(message.guildId)
                        .setTitle(`Utility Commands`)
                        .addFields([
                          {
                            name: `Utility [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "utility"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "utility")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                        ])
                        .setThumbnail(this.client.user.displayAvatarURL()),
                    ],
                  })
                  .catch(() => {});
              } else if (value === `info-help`) {
                return interaction
                  .update({
                    embeds: [
                      this.client.utils
                        .premiumEmbed(message.guildId)
                        .setTitle(`Informative Commands`)
                        .addFields([
                          {
                            name: `Information [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "info"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "info")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                        ])
                        .setThumbnail(this.client.user.displayAvatarURL()),
                    ],
                  })
                  .catch(() => {});
              } else if (value === `all-help`) {
                return interaction
                  .update({
                    embeds: [
                      this.client.utils
                        .premiumEmbed(message.guildId)
                        .setTitle(`All Commands`)
                        .setDescription(
                          `This is the all commands list of the bot ${this.client.user.username}`
                        )
                        .addFields([
                          {
                            name: `Music [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "music"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "music")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                          {
                            name: `Filters [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "filters"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "filters")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                          {
                            name: `Utility [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "utility"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "utility")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                          {
                            name: `Information [${
                              this.client.commands.messages.filter(
                                (x: any) => x.cat && x.cat === "info"
                              ).size
                            }]`,
                            value: `${this.client.commands.messages
                              .filter((x: any) => x.cat && x.cat === "info")
                              .map((x: any) => `\`${x.name}\``)
                              .sort()
                              .join(", ")}`,
                          },
                          {
                            name: `Links`,
                            value: `**[Support Server](${this.client.config.server})** | **[Invite Me](https://discord.com/api/oauth2/authorize?client_id=904317141866647592&permissions=8&scope=bot%20applications.commands)** | **[Premium](${this.client.config.server})** | **[Vote](${this.client.config.voteUrl})**`,
                          },
                        ])
                        .setFooter({
                          text: `Made with 🔥 By Avon Development`,
                          iconURL: message.guild.iconURL({ dynamic: true }),
                        })
                        .setThumbnail(this.client.user.displayAvatarURL()).setImage(`https://media.discordapp.net/attachments/1088387181665591346/1137284441568444476/AVON_BANNER_3.png?width=1440&height=360`)
                    ],
                  })
                  .catch(() => {});
              } else if (value === `help-home`) {
                return interaction.update({
                  embeds: [em],
                });
              }
            }
          }
        });

        collector.on("end", async () => {
          if (!msg) return;
          else
            return await msg
              .edit({
                components: [
                  this.client.utils.actionRow([menu.setDisabled(true)]),
                ],
              })
              .catch(() => {});
        });
        return;
      } else {
        let cmd =
          this.client.commands.messages.get(args[0]) ||
          this.client.commands.messages.find(
            (c: any) => c.aliases && c.aliases.includes(args[0])
          );

        if (args[0].toLowerCase() === "music")
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `__**Music Commands**__ **[${
                    this.client.commands.messages.filter(
                      (x: any) => x.cat && x.cat === "music"
                    ).size
                  }]**\n${this.client.commands.messages
                    .filter((x: any) => x.cat && x.cat === "music")
                    .map((y: any) => `\`${y.name}\``)
                    .sort()
                    .join(", ")}`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setFooter({
                  text: `Requested By: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
          });

        if (
          args[0].toLowerCase() === `filters` ||
          args[0].toLowerCase() === `filter`
        )
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `__**Filter Commands**__ **[${
                    this.client.commands.messages.filter(
                      (x: any) => x.cat && x.cat === "filters"
                    ).size
                  }]**\n${this.client.commands.messages
                    .filter((x: any) => x.cat && x.cat === "filters")
                    .map((y: any) => `\`${y.name}\``)
                    .sort()
                    .join(", ")}`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setFooter({
                  text: `Requested By: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
          });

        if (
          args[0].toLowerCase() === `info` ||
          args[0].toLowerCase() === `information`
        )
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `__**Informative Commands**__ **[${
                    this.client.commands.messages.filter(
                      (x: any) => x.cat && x.cat === "info"
                    ).size
                  }]**\n${this.client.commands.messages
                    .filter((x: any) => x.cat && x.cat === "info")
                    .map((y: any) => `\`${y.name}\``)
                    .sort()
                    .join(", ")}`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setFooter({
                  text: `Requested By: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
          });

        if (args[0].toLowerCase() === `utility`)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `__**Utility Commands**__ **[${
                    this.client.commands.messages.filter(
                      (x: any) => x.cat && x.cat === "utility"
                    ).size
                  }]**\n${this.client.commands.messages
                    .filter((x: any) => x.cat && x.cat === "utility")
                    .map((y: any) => `\`${y.name}\``)
                    .sort()
                    .join(", ")}`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setFooter({
                  text: `Requested By: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
          });

        if (
          args[0].toLowerCase() === `dev` ||
          args[0].toLowerCase() === `owner`
        )
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `__**Owner Commands**__ **[${
                    this.client.commands.messages.filter(
                      (x: any) => x.cat && x.cat === "dev"
                    ).size
                  }]**\n${this.client.commands.messages
                    .filter((x: any) => x.cat && x.cat === "dev")
                    .map((y: any) => `\`${y.name}\``)
                    .sort()
                    .join(", ")}`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setFooter({
                  text: `Requested By: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
          });

        if (
          !cmd &&
          ![
            "music",
            "filters",
            "filter",
            "info",
            "information",
            "utility",
            "dev",
            "owner",
          ].includes(args[0].toLowerCase())
        )
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${
                    this.client.emoji.cross
                  } There is no such command "${args.join(" ")}"`
                ),
            ],
          });

        let em = this.client.utils
          .premiumEmbed(message.guildId)
          .setDescription(
            `\`\`\`js\n<> = Required Arguments | [] = Optional Arguements\`\`\``
          );
        em.addFields([
          {
            name: `Description:`,
            value: `${cmd.desc ? cmd.desc : "No Description Provided"}`,
          },
          {
            name: `Usage`,
            value: `${cmd.usage ? cmd.usage : "No Usage Provided"}`,
            inline: true,
          },
          {
            name: `Aliases`,
            value: `${
              cmd.aliases.length
                ? cmd.aliases
                    .map((x: any) => `\`${x}\``)
                    .sort()
                    .join(", ")
                : "No Aliases"
            }`,
            inline: true,
          },
        ])
          .setFooter({
            text: `Requested By: ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setAuthor({
            name: `${this.client.user.username}`,
            iconURL: this.client.user.displayAvatarURL(),
          });

        return message.reply({
          embeds: [em],
        });
      }
    };
  }
}
