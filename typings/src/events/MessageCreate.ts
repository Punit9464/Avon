import { PermissionFlagsBits, WebhookClient } from "discord.js";
import { checkRihan, manageMent } from "../api/db/management.js";
import { getPrefix } from "../api/db/prefix.js";
import { removeUserPrem } from "../api/db/premium.js";
import AvonConfig from "../config/Config.js";
import Topgg from "@top-gg/sdk";
const Config = new AvonConfig();
let voteApi = new Topgg.Api(Config.voteApi);
import AvonEvent from "../base/AvonEvent.js";
export default class CommandHandler extends AvonEvent {
  run: any;
  constructor(client: any) {
    super(client);
    this.name = "messageCreate";
    this.run = async (message: any) => {
      if (message.channel.type === 1) return;
      if (message.author.bot === true) return;

      /**
       * Premium Stuff
       */

      let time = Math.round(Date.now() / 1000);
      if (this.client.utils.checkUserPrem(message.author.id) === true) {
        let premTime = this.client.utils.checkPremTime(message.author.id);
        if (premTime - time <= 0) {
          removeUserPrem(message.author.id);
          await message.author
            .send({
              embeds: [
                this.client.utils
                  .embed()
                  .setTitle(`Premium Expired`)
                  .setDescription(
                    `Your [Premium](${this.client.config.server}) has been **Expired** Please join Our [Support Server](${this.client.config.server}) to avail Premium.`
                  )
                  .setTimestamp(),
              ],
            })
            .catch(async (e: any) => {
              await message.channel
                .send({
                  embeds: [
                    this.client.utils
                      .embed()
                      .setTitle(`Premium Expired`)
                      .setDescription(
                        `Your [Premium](${this.client.config.server}) has been **Expired** Please join Our [Support Server](${this.client.config.server}) to avail Premium.`
                      )
                      .setTimestamp(),
                  ],
                  content: `${message.author}`,
                })
                .catch(() => { });
            });
        }
      }
      if (this.client.utils.checkServerPremStatus(message.guildId) === true) {
        let premTime = this.client.utils.checkServerPremTime(message.guildId);
        if (premTime - time <= 0) {
          this.client.utils.deleteServerPrem(message.guildId);
        }
      }

      let prefix;
      let data = getPrefix(message.guild.id);
      if (data.PREFIX !== null) prefix = data.PREFIX;
      else prefix = this.client.config.prefix;

      let mention = `<@${this.client.user.id}>`;
      if (message.content === mention) {
        return message
          .reply({
            content: `Hey I'm __**${this.client.user.username}**__\n\nTry Using \`${prefix}help\` to get a list of commands\n\nIf you continue to have problems, consider asking help on our discord server.`,
            components: [
              this.client.utils.actionRow([
                this.client.utils.button(
                  `link`,
                  `Invite Me`,
                  null,
                  null,
                  `https://discord.com/api/oauth2/authorize?client_id=904317141866647592&permissions=8&scope=applications.commands%20bot`,
                  this.client.emoji.invite
                ),
                this.client.utils.button(
                  `link`,
                  `Support Server`,
                  null,
                  null,
                  `${this.client.config.server}`,
                  this.client.emoji.support
                ),
                this.client.utils.button(
                  `link`,
                  `Premium`,
                  null,
                  null,
                  `${this.client.config.server}`,
                  this.client.emoji.premium
                ),
              ]),
            ],
          })
          .catch(async (e: any) => {
            await message.author
              .send({
                content: `Error : ${e.message}`,
              })
              .catch(() => { });
          });
      }

      let regex = new RegExp(`^<@!?${this.client.user.id}>`);
      let pre = message.content.match(regex)
        ? message.content.match(regex)[0]
        : prefix;

      let np: string[] = [];
      if (this.client.utils.checkGlobalNp(message.author.id) === true)
        np.push(message.author.id);
      if (
        this.client.utils.checkGuildNp(message.guildId, message.author.id) ===
        true
      )
        np.push(message.author.id);

      if (!np.includes(message.author.id)) {
        if (!message.content.startsWith(pre)) return;
      }

      const args =
        np.includes(message.author.id) === false
          ? message.content.slice(pre.length).trim().split(/ +/)
          : message.content.startsWith(pre)
            ? message.content.slice(pre.length).trim().split(/ +/)
            : message.content.trim().split(/ +/);
      const name = args.shift().toLowerCase();
      const cmd =
        this.client.commands.messages.get(name) ||
        this.client.commands.messages.find(
          (c: any) => c.aliases && c.aliases.includes(name)
        );
      if (!cmd) return;

      if (
        this.client.utils.getDj(message.guildId)?.CHANNEL === message.channel.id
      )
        return;

      if (
        !message.guild.members.me
          .permissionsIn(message.channel)
          .has(PermissionFlagsBits.ViewChannel)
      )
        return;

      if (
        !message.guild.members.me
          .permissionsIn(message.channel)
          .has(PermissionFlagsBits.SendMessages)
      )
        return message.author
          .send({
            embeds: [
              this.client.utils
                .embed()
                .setDescription(
                  `${this.client.emoji.cross} Missing **Send Messges** permissions in that channel`
                )
                .setTitle(`Missing Permissions`),
            ],
          })
          .catch(() => { });

      if (
        !message.guild.members.me
          .permissionsIn(message.channel)
          .has(PermissionFlagsBits.EmbedLinks)
      )
        return message.reply({
          content: `${this.client.emoji.cross} I am missing **Embed Links** permissions in this channel`,
        });

      if (
        !message.guild.members.me
          .permissionsIn(message.channel)
          .has(PermissionFlagsBits.ReadMessageHistory)
      )
        return message.reply({
          embeds: [
            this.client.utils
              .embed()
              .setDescription(
                `${this.client.emoji.cross} I don't have **Read Message History** permissions in this channel`
              )
              .setTitle(`Missing Permissions`),
          ],
        });

      if (
        !message.guild.members.me
          .permissionsIn(message.channel)
          .has(PermissionFlagsBits.UseExternalEmojis)
      )
        return message.reply({
          embeds: [
            this.client.utils
              .embed()
              .setDescription(
                `${this.client.emoji.cross} I don't have **Use External Emojis** permissions in this channel`
              )
              .setTitle(`Missing Permissions`),
          ],
        });
      if (
        this.client.utils.checkIgnore(message.guildId, message.channel.id) ===
        true &&
        message.author.id !== message.guild.ownerId &&
        !this.client.config.owners.includes(message.author.id)
      ) {
        let check = this.client.utils.checkBypassAdmins(message.guildId);
        let check2 = this.client.utils.checkBypassMods(message.guildId);
        if (
          check === true &&
          !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
          check2 === true &&
          !message.member.permissions.has(PermissionFlagsBits.ManageMessages)
        )
          return message
            .reply({
              content: `${this.client.emoji.exclamation} This Channel is in my Ignore List! You cannot Run any of my Commands Here!`,
            })
            .then((x: any) => {
              setTimeout(() => {
                x.delete().catch(() => { });
              }, 7000);
            });
        else if (
          check === true &&
          check2 === false &&
          !message.member.permissions.has(PermissionFlagsBits.Administrator)
        )
          return message
            .reply({
              content: `${this.client.emoji.exclamation} This Channel is in my Ignore List! You cannot Run any of my Commands Here!`,
            })
            .then((x: any) => {
              setTimeout(() => {
                x.delete().catch(() => { });
              }, 7000);
            });
        else if (
          check === false &&
          check2 === false &&
          !message.member.permissions.has(PermissionFlagsBits.ManageMessages)
        )
          return message
            .reply({
              content: `${this.client.emoji.exclamation} This Channel is in my Ignore List! You cannot Run any of my Commands Here!`,
            })
            .then((x: any) => {
              setTimeout(() => {
                x.delete().catch(() => { });
              }, 7000);
            });
        else if (check === false && check2 === false)
          return message
            .reply({
              content: `${this.client.emoji.exclamation} This Channel is in my Ignore List! You cannot Run any of my Commands Here!`,
            })
            .then((x: any) => {
              setTimeout(() => {
                x.delete().catch(() => { });
              }, 7000);
            });
      }

      let em = this.client.utils
        .premiumEmbed(message.guild.id)
        .setTitle(`Command Logs`)
        .setAuthor({
          name: `${this.client.user.username}`,
          iconURL: this.client.user.displayAvatarURL(),
        })
        .addFields([
          {
            name: `Information`,
            value: `Command Author: ${message.author.tag}\nCommand Name: \`${cmd.name}\`\nChannel Id: ${message.channel.id}\nChannel Name: ${message.channel.name}\nGuild Name: ${message.guild.name}\nGuild Id: ${message.guild.id}`,
          },
        ])
        .setThumbnail(message.guild.iconURL({ dynamic: true }));
      const web = new WebhookClient({ url: this.client.config.webhooks.Cmds });
      web.send({ embeds: [em] });

      const dispatcher = this.client.api.get(message.guild.id);
      if (cmd.vc) {
        if (dispatcher && dispatcher.player && !message.member.voice.channel) {
          return message.reply({
            content: `${this.client.emoji.cross} You must be connected to a voice channel!`,
          });
        }
      }

      if (cmd.samevc) {
        if (
          dispatcher &&
          dispatcher.player &&
          dispatcher.player.connection.channelId !==
          message.member.voice.channel.id
        )
          return message.reply({
            content: `${this.client.emoji.cross} You must be connected to ${message.guild.members.me.voice.channel} to use me!`,
          });
      }
      if (cmd.dev) {
        if (!this.client.config.owners.includes(message.author.id)) return;
      }
      if (cmd.manage) {
        if (
          manageMent(message.author.id).MANAGE === null &&
          !this.client.config.owners.includes(message.author.id)
        )
          return;
      }
      if (cmd.vote) {
        let voted = await voteApi.hasVoted(message.author.id);
        if (
          !voted &&
          !this.client.config.owners.includes(message.author.id) &&
          !this.client.utils.checkUserPrem(message.author.id)
        ) {
          return message.reply({
            content: `You need to Vote me to use this Command!`,
            components: [
              this.client.utils.actionRow([
                this.client.utils.button(
                  `link`,
                  `Vote Me`,
                  null,
                  null,
                  `${this.client.config.voteUrl}`,
                  this.client.emoji.vote
                ),
              ]),
            ],
          });
        }
      }
      if (cmd.premium?.guild) {
        if (
          this.client.utils.checkServerPremStatus(message.guildId) === false
        ) {
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setTitle(`Premium Required`)
                .setDescription(
                  `${this.client.emoji.cross} You Server needs to be a **[Premium Guild](${this.client.config.server})** to use this command.`
                )
                .setTimestamp(),
            ],
          });
        }
      }
      if (cmd.premium?.user) {
        if (
          message.author.id !==
          this.client.utils.checkActivator(message.guild.id)
        ) {
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setTitle(`Premium Required`)
                .setDescription(
                  `${this.client.emoji.cross} You need to be the **[Premium Activator](${this.client.config.server})** of this guild to use this command.`
                ),
            ],
          });
        }
      }
      if (cmd.dispatcher) {
        if (!dispatcher)
          return message.reply({
            content: `${this.client.emoji.cross} There is no player for this guild yet!`,
          });
      }
      if (cmd.playing) {
        if (dispatcher.player.track === null)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guildId)
                .setDescription(
                  `${this.client.emoji.cross} The Player seems to be empty! Try adding some songs in the queue`
                )
                .setTitle(`Player Empty`),
            ],
          });
      }

      if (cmd.cat === "rihan") {
        if (
          !this.client.config.owners.includes(message.author.id) &&
          checkRihan(message.author.id) === false
        )
          return;
      }

      cmd.exec(message, args, prefix, dispatcher).catch((e: any) => {
        console.log(e);
      });
    };
  }
}
