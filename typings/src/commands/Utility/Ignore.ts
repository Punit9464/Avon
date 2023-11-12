import { MessageManager } from "discord.js";
import AvonCommand from "../../base/AvonCommand.js";

export default class Ignore extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "ignore";
    this.aliases = ["ign"];
    this.desc = "Configures Ignore module for command or bypass of the bot";
    this.usage = "ignore <command> [channel]";
    this.cat = "utility";
    this.dev = false;
    this.manage = false;
    this.premium = {
      guild: false,
      user: false,
    };
    this.exec = async (message: any, args: any, prefix: any) => {
      if (
        !message.member.permissions.has("ManageGuild") &&
        !client.config.owners.includes(message.author.id) &&
        this.client.utils.checkActivator(message.guild.id) !== message.author.id
      )
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.cross} You don't have **Manage Guild** permissions to use this command`
              )
              .setTitle(`Required Permissions`),
          ],
        });

      if (!args[0])
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setTitle(`Ignore Subcommands`)
              .setDescription(
                `\`${prefix}ignore add <channel>\`\nAdds a channel to the ignore list\n\n\`${prefix}ignore remove <channel>\`\nRemoves a channel from ignore list\n\n\`${prefix}ignore config\`\nShows the config for the ignore list\n\n\`${prefix}ignore bypass <mods/admins>\`\nAdds mods or admins to ignore bypass\n\n\`${prefix}ignore reset\`\nResets the ignore settings for the guild`
              )
              .setTimestamp(),
          ],
        });

      if (args[0].toLowerCase() === `add`) {
        let channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[1]);

        if (!channel)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} Please provide me a valid channel`
                ),
            ],
          });

        if (this.client.utils.checkIgnore(message.guildId, channel.id))
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} This Channel ${channel} is Already in my Ignore List!`
                ),
            ],
          });

        let list = this.client.utils.getIgnoreList(message.guildId);
        if (
          list.length >= 5 &&
          !this.client.utils.checkServerPrem(message.guild.id) &&
          !this.client.utils.checkServerPremStatus(message.guldId)
        )
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} This guilds need to be a **[Premium Guild](${this.client.config.server})** in order to add more than **5 Channels in Ignore List**`
                )
                .setTitle(
                  `${this.client.emoji.premium} Found A Premium Feature`
                ),
            ],
          });

        this.client.utils.addIgnore(message.guildId, channel.id);

        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Added** ${channel} to the Ignore List! Now I will Ignoring all of my Commands There!`
              )
              .setTitle(`Successful Addition`),
          ],
        });
      }

      if (args[0].toLowerCase() === `remove`) {
        let channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[1]);

        if (!channel)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} Please provide me a valid channel!`
                ),
            ],
          });

        if (!this.client.utils.checkIgnore(message.guildId, channel.id))
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} This Channel ${channel} is not present in my Ignore List!`
                ),
            ],
          });

        this.client.utils.removeIgnore(message.guildId, channel.id);

        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Removed** ${channel} from my Ignore List!`
              )
              .setTitle(`Successful Removal`),
          ],
        });
      }

      if (args[0].toLowerCase() === `config`) {
        let stats: any[] = [];
        let list = this.client.utils.getIgnoreList(message.guildId);

        let em = this.client.utils
          .premiumEmbed(message.guildId)
          .setTitle(`Guild's Ignore Config`)
          .setFooter({
            text: `Requested By: ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });
        let ch: any;
        for (let i = 0; i < list.length; i++) {
          try {
            ch = await message.guild.channels.fetch(list[i]);
            stats.push(
              `**${i + 1}.** [${ch.name}](${this.client.config.voteUrl}) [ID: ${ch.id
              }]`
            );
          } catch (e) {
            this.client.utils.removeIgnore(message.guild.id, list[i]);
          }
        }

        em.setDescription(
          stats.length
            ? stats.sort().join("\n")
            : "None of the Channels have been Ignored"
        )
          .addFields([
            {
              name: `Bypass Admins?`,
              value: `${this.client.utils.checkBypassAdmins === true
                ? `${this.client.emoji.tick} True`
                : `${this.client.emoji.cross} False`
                }`,
              inline: true,
            },
            {
              name: `Bypass Mods?`,
              value: `${this.client.utils.checkBypassMods === true
                ? `${this.client.emoji.tick} True`
                : `${this.client.emoji.cross} False`
                }`,
              inline: true,
            },
          ])
          .setThumbnail(message.guild.iconURL({ dynamic: true }));

        return message.reply({
          embeds: [em],
        });
      }

      if (args[0].toLowerCase() === `bypass`) {
        if (!args[1]) {
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `\`${prefix}ignore bypass admins\`\nToggles Bypass for the server admins\n\n\`${prefix}ignore bypass mods\`\nToggles Bypass for the server mods`
                )
                .setTitle(`\`${prefix}ignore bypass\``)
                .setThumbnail(this.client.user.displayAvatarURL()),
            ],
          });
        }

        if (args[1].toLowerCase() === `admins`) {
          let check = this.client.utils.checkBypassAdmins(message.guildId);
          if (check === true) {
            this.client.utils.removeBypassAdmins(message.guildId);
            return message.reply({
              embeds: [
                this.client.utils
                  .premiumEmbed(message.guildId)
                  .setDescription(
                    `${this.client.emoji.cross} **Removed** Admins from my **Ignore Bypass**`
                  ),
              ],
            });
          } else {
            this.client.utils.addBypassAdmins(message.guildId);
            return message.reply({
              embeds: [
                this.client.utils
                  .premiumEmbed(message.guildId)
                  .setDescription(
                    `${this.client.emoji.tick} **Added** Admins to **Ignore Bypass**`
                  ),
              ],
            });
          }
        }

        if (args[1].toLowerCase() === `mods`) {
          let check = this.client.utils.checkBypassMods(message.guildId);
          if (check === true) {
            this.client.utils.removeBypassMods(message.guildId);
            return message.reply({
              embeds: [
                this.client.utils
                  .premiumEmbed(message.guildId)
                  .setDescription(
                    `${this.client.emoji.cross} **Removed** Mods from my **Ignore Bypass**`
                  ),
              ],
            });
          } else {
            this.client.utils.addBypassMods(message.guildId);
            return message.reply({
              embeds: [
                this.client.utils
                  .premiumEmbed(message.guildId)
                  .setDescription(
                    `${this.client.emoji.tick} **Added** Mods to my **Ignore Bypass**`
                  ),
              ],
            });
          }
        }
      }

      if (args[0].toLowerCase() === `reset`) {
        this.client.utils.resetIgnore(message.guildId);
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Resetted** the Ignore Module!`
              ),
          ],
        });
      }
    };
  }
}
