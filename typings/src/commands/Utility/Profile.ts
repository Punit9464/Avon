import AvonCommand from "../../base/AvonCommand.js";
import {
  getCount,
  getPremServerList,
  getUserPremtier,
} from "../../api/db/premium.js";
import Badges from "./Badges.js";
import axios from "axios";
const badge = new Badges();
export default class Profile extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "profile";
    this.aliases = ["pr", "badges", "badge"];
    this.cat = "utility";
    this.vc = false;
    this.samevc = false;
    this.desc = "Shows the profile for a user";
    this.usage = "profile [user]";
    this.premium = {
      guild: false,
      user: false,
    };
    this.dev = false;
    this.dispatcher = false;
    this.playing = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      let user: any;
      let badges: string | undefined = "";
      if (
        message.mentions.users
          .filter((x: any) => x !== this.client.user)
          .first()
      )
        user = message.mentions.users
          .filter((x: any) => x !== this.client.user)
          .first();
      else if (args[0]) user = await this.client.users.fetch(args[0]);
      else if (!args[0]) user = message.author;

      if (!user)
        return message.reply({
          embeds: [
            this.client.utils
              .errorEmbed()
              .setDescription(
                `${this.client.emoji.cross} Please provide me a valid user`
              ),
          ],
        });
      let check: boolean = this.client.utils.checkUserPrem(user.id);
      let guild: any = await this.client.guilds.fetch(this.client.config.supportId);

      if (!guild) return;

      let mem = await axios({
        url: `https://discord.com/api/v10/guilds/${guild.id}/members/${user.id}`,
        method: `GET`,
        headers: {
          Authorization: `Bot ${this.client.config.token}`
        }
      }).catch((e: any) => {
        let premiumInfo: any;
        let check = this.client.utils.checkUserPrem(user.id);
        if (check === false) premiumInfo = "Not A Premium User";
        else {
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
          premiumInfo = `Premium Tier: \`${Tier}\`\nUsing Premium In: \`${upgrades}\` Servers\nUpgrades Left: \`${upgradesLeft}\`\nExpires On: <t:${this.client.utils.checkPremTime(
            user.id
          )}:R>`;
        }

        let em = this.client.utils
          .premiumEmbed(message.guildId)
          .setDescription(
            `__**Avon Achievements**__\n[\`No Badges Available\`](${this.client.config.voteUrl})\nKindly Join Our **[Support Server](${this.client.config.server})** to get some **[Badges](${this.client.config.server})** on your Profile!\n\n__**Premium Info**__\n${premiumInfo}`
          )
          .setAuthor({
            name: `${this.client.user.username}`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setTitle(`${user.username}'s Profile`)
          .setURL(`${this.client.config.voteUrl}`)
          .setFooter({
            text: `Requested By: ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(user.displayAvatarURL({ dynamic: true }));

        let b1 = this.client.utils.button(
          `link`,
          `Support`,
          null,
          null,
          this.client.config.server,
          this.client.emoji.support
        );
        let b2 = this.client.utils.button(
          `link`,
          `Premium`,
          null,
          null,
          this.client.config.server,
          this.client.emoji.premium
        );
        let row = this.client.utils.actionRow([b1, b2]);

        return message.reply({
          embeds: [em],
          components: [row],
        });
      });

      if (!mem) badges = "";

      mem = mem.data;

      let punit = mem?.roles;

      if (user.id === "765841266181144596")
        badges += `\n<:owner:1073672248885518597> **[Punit](https://discord.com/users/765841266181144596)**`;
      if (user.id === "785708354445508649")
        badges += `\n<:owner:1073672248885518597> **[Rihan](https://discord.com/users/785708354445508649)**`;
      if (user.id === "259176352748404736")
        badges += `\n<:owner:1073672248885518597> **[Sumit](https://discord.com/users/259176352748404736)**`;
      if (user.id === "735003878424313908")
        badges += `\n<:owner:1073672248885518597> **[Rohit](https://discord.com/users/735003878424313908)**`;
      if (user.id === "323429313032486922")
        badges += `\n<:owner:1073672248885518597> **[Alone](https://discord.com/users/323429313032486922)**`;
      if (user.id === "218151216650256384")
        badges += `\n<:owner:1073672248885518597> **[Invisible](https://discord.com/users/218151216650256384)**`;
      if (user.id === "1043843871701999626")
        badges += `\n<:owner:1073672248885518597> **[Cotu](https://discord.com/users/1043843871701999626)**`;
      if (user.id === "1086577604947103764")
        badges += `\n<:owner:1073672248885518597> **[Leon](https://discord.com/users/1086577604947103764)**`;

      if (punit?.includes(badge.developer))
        badges += `\n${this.client.emoji.badges.dev} **Developer**`;
      if (punit?.includes(badge.owner))
        badges += `\n${this.client.emoji.badges.owner} **Owner**`;
      if (punit?.includes(badge.codev))
        badges += `\n${this.client.emoji.badges.codev} **Co-Developer**`;
      if (punit?.includes(badge.admin))
        badges += `\n${this.client.emoji.badges.admin} **Admin**`;
      if (check === true)
        badges += `\n${this.client.emoji.badges.premiumUser} **Premium User**`;
      if (punit?.includes(badge.vip))
        badges += `\n${this.client.emoji.badges.vip} **Vip**`;
      if (punit?.includes(badge.communityManager))
        badges += `\n${this.client.emoji.admin} **Comunity Manager**`;
      if (punit?.includes(badge.friend))
        badges += `\n${this.client.emoji.badges.friend} **Friend**`;
      if (punit?.includes(badge.supporter))
        badges += `\n${this.client.emoji.badges.supporter} **Supporter**`;
      if (punit?.includes(badge.staff))
        badges += `\n${this.client.emoji.badges.staff} **Support Team**`;
      if (punit?.includes(badge.mod))
        badges += `\n${this.client.emoji.badges.mod} **Moderator**`;
      if (punit?.includes(badge.user))
        badges += `\n${this.client.emoji.badges.user} **${this.client.user.username} User**`;
      else badges = "";
      if (badges === "")
        badges = `[\`No Badges Available\`](${this.client.config.voteUrl})\nKindly Join Our **[Support Server](${this.client.config.server})** to get some **[Badges](${this.client.config.server})** on your Profile!`;

      let premiumInfo: string | undefined;
      if (check === false) premiumInfo = "Not A Premium User";

      if (check === true) {
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
        premiumInfo = `Premium Tier: \`${Tier}\`\nUsing Premium In: \`${upgrades}\` Servers\nUpgrades Left: \`${upgradesLeft}\`\nExpires On: <t:${this.client.utils.checkPremTime(
          user.id
        )}:R>`;
      }

      let em = this.client.utils
        .premiumEmbed(message.guildId)
        .setAuthor({
          name: `${this.client.user.username}`,
          iconURL: this.client.user.displayAvatarURL(),
        })
        .setTitle(`${user.username}'s Profile`)
        .setURL(`https://discord.com/users/${user.id}`)
        .setDescription(
          `__**Avon Achievements**__\n${badges}\n\n__**Premium Info**__\n${premiumInfo}`
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true }));

      let b1 = this.client.utils.button(
        `link`,
        `Premium`,
        null,
        null,
        `${this.client.config.server}`,
        this.client.emoji.premium
      );
      let b2 = this.client.utils.button(
        `link`,
        `Support`,
        null,
        null,
        `${this.client.config.server}`,
        this.client.emoji.support
      );
      let row = this.client.utils.actionRow([b1, b2]);

      return message.reply({
        embeds: [em],
        components: [row],
      });
    };
  }
}
