import { EmbedBuilder } from "discord.js";
import {
  addServerPrem,
  decretCount,
  getActivator,
  getCount,
  getPremServerList,
  getPremTime,
  getServerPremiumStatus,
  getUserCode,
  getUserPremStatus,
  getUserPremtier,
  incrementCount,
  removeServerPrem,
} from "../../api/db/premium.js";
import AvonCommand from "../../base/AvonCommand.js";
import { manageMent } from "../../api/db/management.js";

export default class Premium extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "premium";
    this.aliases = ["prem"];
    this.cat = "utility";
    this.desc = "Toggles premium cateogry for the bot";
    this.usage = "premium <activate/revoke/status>";
    this.dev = false;
    this.manage = false;
    this.vc = false;
    this.samevc = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (
        !args[0] ||
        !["status", "activate", "stats", "revoke"].includes(
          args[0].toLowerCase()
        )
      )
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setTitle(`Premium Subcommands`)
              .setAuthor({
                name: `${this.client.user?.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              })
              .setDescription(
                `\`${prefix}premium activate\`
                Activates the premium for a server
                
                \`${prefix}premium status\`
                Shows the premium statistics for a user
                
                \`${prefix}premium revoke\`
                Revokes the premium of the user`
              ),
          ],
        });

      if (args[0].toLowerCase() === `activate`) {
        let check = getUserPremStatus(message.author.id);
        if (check.USER === null)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} You don't have any kind of **[Premium](${this.client.config.server})** to be activated!`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setTitle(`Premium Not Found`),
            ],
          });
        let cnt = getCount(message.author.id);
        if (cnt.COUNT === 0)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} You don't have any **[Premiums](${this.client.config.server})** left to be activated`
                )
                .setTimestamp()
                .setTitle(`Premiums Not Avaialable`),
            ],
          });
        let time = getPremTime(message.author.id);
        if (time.TIME === 0) {
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTimestamp()
                .setTitle(`Premium Expired`)
                .setDescription(
                  `${this.client.emoji.cross} Your [Premium](${this.client.config.server}) has been **Expired**`
                ),
            ],
          });
        }

        let status = getServerPremiumStatus(message.guildId);
        if (status.STATUS === 1) {
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTimestamp()
                .setTitle(`Premium Server`)
                .setDescription(
                  `${this.client.emoji.cross} This Server is already in my Premium`
                ),
            ],
          });
        }

        let guild = message.guild;
        let code = getUserCode(message.author.id);
        if (code.CODE === null)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTimestamp()
                .setTitle(`Premium Code Unavailable`)
                .setDescription(
                  `${this.client.emoji.cross} You premium Code seems not to be working! Please contact the support`
                ),
            ],
          });

        let premTime = time.TIME ? time.TIME : 0;
        let cd = this.client.utils.genPremId();
        let add = addServerPrem(message.author.id, premTime, guild.id, cd);
        if (add === true) {
          decretCount(message.author.id);
          return message.reply({
            embeds: [
              this.client.utils
                .successEmbed()
                .setTimestamp()
                .setTitle(`Premium Added`)
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Added** [Premium](${this.client.config.server}) to ${guild.name} by **${message.author.tag}**\nExpires On: <t:${premTime}> (<t:${premTime}:R>)\nExecutive Code: \`${code.CODE}\``
                ),
            ],
          });
        }
      }

      if (
        args[0].toLowerCase() === `status` ||
        args[0].toLowerCase() === `stats`
      ) {
        let user: any | undefined;
        if (
          message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first()
        )
          user = message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first();
        else if (args[1]) user = await this.client.users.fetch(args[1]);
        else if (!args[1]) user = message.author;
        if (!user)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} Please provide me a valid User!`
                ),
            ],
          });
        let sel = this.client.utils.checkUserPrem(user.id);
        if (sel === false)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTitle(`Premium Not Found`)
                .setDescription(
                  `${this.client.emoji.cross} User ${user.tag} don't have any kind of [Premium](${this.client.config.server}).Please visit our [Support Server](${this.client.config.server}) to avail your Premium today!`
                )
                .setTimestamp()
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                }),
            ],
          });
        let stats: any[] = [];
        let um;
        let g;
        let list = getPremServerList(user.id);
        let cnt = getCount(user.id);
        let upgrades = list.length;
        let upgradesLeft = cnt.COUNT;
        let Tier: string | undefined;
        let tier = getUserPremtier(user.id);
        if (tier.TIER === "none" || tier.TIER === "unknown")
          Tier = "Info Not Available";
        else if (tier.TIER === "bronze") Tier = "Bronze Tier";
        else if (tier.TIER === "silver") Tier = "Silver Tier";
        else if (tier.TIER === "gold") Tier = "Gold Tier";
        else if (tier.TIER === "diamond") Tier = "Diamond Tier";
        else if (tier.TIER === "special") Tier = "Special Tier";
        else Tier = "Info Not Available";

        for (let i = 0; i < list.length; i++) {
          try {
            g = await this.client.guilds.fetch(list[i]).catch(() => { });
            um = this.client.utils.checkServerPremTime(list[i]);
            stats.push(
              `**(No ${i + 1})** \nServer Name: \`${g.name
              }\`\nExpires On: <t:${this.client.utils.checkServerPremTime(
                list[i]
              )}> (<t:${this.client.utils.checkServerPremTime(list[i])}:R>)`
            );
          } catch (e) {
            this.client.utils.deleteServerPrem(list[i]);
          }
        }

        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setTitle(`Premium Stats`)
              .setAuthor({
                name: `${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              })
              .setDescription(
                `Premium Tier: \`${Tier}\`\nUsing Premium In: \`${upgrades}\` Servers\nUpgrades Left: \`${upgradesLeft}\`\n\n__Upgraded Servers:__\n${stats.length
                  ? stats.sort().join("\n\n")
                  : "No Premium Servers"
                }`
              ),
          ],
        });
      }

      if (args[0].toLowerCase() === `revoke`) {
        let check = this.client.utils.checkUserPrem(message.author.id);
        if (check === false) {
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTitle(`Premium Not Found`)
                .setDescription(
                  `${this.client.emoji.cross} You don't have any kind of [Premium](${this.client.config.server}).Please visit our [Support Server](${this.client.config.server}) to avail your Premium today!`
                )
                .setTimestamp()
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                }),
            ],
          });
        }
        let guild = message.guild;
        if (
          this.client.utils.checkServerPrem(guild.id) === false &&
          this.client.utils.checkServerPremStatus(guild.id) === false
        ) {
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTitle(`No Premium Found`)
                .setDescription(
                  `${this.client.emoji.cross} This guild: \`${guild.name}\` is not in my **[Premium](${this.client.config.server})** Guilds!`
                )
                .setTimestamp(),
            ],
          });
        }
        if (this.client.utils.checkActivator(guild.id) !== message.author.id) {
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setTitle(`Not Activator`)
                .setDescription(
                  `${this.client.emoji.cross} You are not the activator for this guild's Premium`
                )
                .setAuthor({
                  name: `${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setTimestamp(),
            ],
          });
        }

        let rem = removeServerPrem(message.author.id, message.guildId);
        if (rem === true) {
          incrementCount(message.author.id);
          return message.reply({
            embeds: [
              this.client.utils
                .successEmbed()
                .setTitle(`Premium Revoked`)
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Revoked** [Premium](${this.client.config.server}) for the guild by **${message.author.tag}**`
                )
                .setTimestamp(),
            ],
          });
        } else
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} Please contact devs!`
                ),
            ],
          });
      }

      if (args[0].toLowerCase() === 'activator') {
        if (manageMent(message.author.id).MANAGE === null && !this.client.config.owners.includes(message.author.id)) return;

        let guild: any;
        if (!args[1]) guild = message.guild;
        else if (args[1]) guild = await this.client.guilds.fetch(args[1]);
        if (!guild) {
          return message.reply({
            content: `${this.client.emoji.cross} Please provide me a valid Guild Id!`
          })
        }

        let prem = this.client.utils.getServerPremiumStatus(guild.id);
        if (!prem) return message.reply({
          content: `${this.client.emoji.cross} That Guild is not a Premium Guild!`
        });

        let get = getActivator(guild.id);

        if (get.USER !== null) {
          let user = await this.client.users.fetch(get.USER);
          return message.reply({
            embeds: [
              this.client.utils.premiumEmbed(guild.id)
                .setDescription(`Activator of ${guild.name}: ${user}`)
            ]
          })
        }
        else {
          return message.reply({
            content: `${this.client.emoji.cross} Couldn't Get the Activator!`
          })
        }
      }
    };
  }
}
