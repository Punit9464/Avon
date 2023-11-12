import AvonCommand from "../../base/AvonCommand.js";

export default class AvonAll extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "247";
    this.aliases = ["247-7", "24/7"];
    this.cat = "utility";
    this.premium = {
      guild: false,
      user: false,
    };
    this.vc = true;
    this.samevc = true;
    this.usage = "24/7 [on/enable | off/disable]";
    this.desc = "Toggles 24/7 mode of the player";
    this.vote = true;
    this.dispatcher = true;
    this.playing = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (
        !message.member.permissions.has("ManageGuild") &&
        !client.config.owners.includes(message.author.id)
      )
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
              .setDescription(
                `${this.client.emoji.cross} You need **Manage Guild** permissions to use this command`
              )
              .setTitle(`Need Permissions`)
              .setTimestamp(),
          ],
        });
      let data = this.client.utils.get247(message.guild.id);
      if (!args[0]) {
        if (data === true) {
          this.client.utils.disable247(message.guildId);
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.cross} Successfully **Disabled 24/7 Mode** of ${this.client.user.username} I will not stay in the Voice Channel`
                )
                .setTitle(`24/7 Toggled`)
                .setTimestamp(),
            ],
          });
        } else if (data === false) {
          this.client.utils.enable247(
            message.guildId,
            message.member.voice.channelId,
            message.channel.id
          );

          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Enabled 24/7 Mode** of ${this.client.user.username} Now I will Stay in the Voice Channel`
                )
                .setTitle(`24/7 Toggled`)
                .setTimestamp(),
            ],
          });
        }
      } else if (["enable", "on"].includes(args[0].toLowerCase())) {
        if (data === true)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.exclamation} **24/7 Mode** of ${this.client.user.username} is Already **Enabled**`
                )
                .setTitle(`Already Enabled`),
            ],
          });
        else {
          this.client.utils.enable247(
            message.guild.id,
            message.member.voice.channel.id,
            message.channel.id
          );

          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Enabled 24/7 Mode** of ${this.client.user.username} Now I will Stay in the Voice Channel`
                )
                .setTitle(`24/7 Toggled`)
                .setTimestamp(),
            ],
          });
        }
      } else if (["off", "disable"].includes(args[0].toLowerCase())) {
        if (data === false)
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.exclamation} **24/7 Mode** of ${this.client.user.username} is Already **Disabled**`
                )
                .setTitle(`Already Disabled`),
            ],
          });
        else {
          this.client.utils.disable247(message.guild.id);

          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Disabled 24/7 Mode** of ${this.client.user.username} Now I will not Stay in the Voice Channel`
                )
                .setTitle(`24/7 Toggled`)
                .setTimestamp(),
            ],
          });
        }
      }
    };
  }
}
