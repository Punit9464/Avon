import { PermissionFlagsBits } from "discord.js";
import AvonDispatcher from "../../api/Dispatcher.js";
import AvonCommand from "../../base/AvonCommand.js";

export default class Connect extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "connect";
    this.aliases = ["join", "conn"];
    this.cat = "music";
    this.desc = "Connects the bot to a voice channel";
    this.dev = false;
    this.vc = true;
    this.samevc = false;
    this.premium = {
      guild: false,
      user: false,
    };
    this.exec = async (message: any, args: any, prefix: any) => {
      try{
      const dispatcher = this.client.api.get(message.guild.id);
      if (dispatcher && dispatcher.player) {
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
              .setDescription(
                `${this.client.emoji.cross} I am already Connected to ${message.guild.members.me.voice.channel.name}`
              ),
          ],
        });
      } else {
        let channel = message.member.voice.channel;
        if (
          !message.guild.members.me
            .permissionsIn(channel)
            .has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])
        )
          return message.reply({
            embeds: [
              this.client.utils
                .premiumEmbed(message.guild.id)
                .setDescription(
                  `${this.client.emoji.cross} I don't have required permissions to connect to that channel`
                )
                .setTitle(`Permissions Needed`),
            ],
          });
        if (this.client.api.get(message.guild.id)) {
          this.client.api.get(message.guild.id).destroy();
          this.client.api.delete(message.guild.id);
        }
        let node = this.client.shoukaku.getNode();
        let player = await node.joinChannel({
          guildId: message.guildId,
          channelId: message.member.voice.channelId,
          shardId: message.guild.shardId,
          deaf: true,
        });
        const dispatcher = new AvonDispatcher(
          this.client,
          message.guild,
          message.channel,
          player
        );
        this.client.api.set(message.guildId, dispatcher);

        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Connected** to Your voice channel.`
              )
              .setTitle(`Connected`),
          ],
        });
      }
    } catch(e) {return message.reply({content: `${this.client.emoji.cross} I couldn't Connect to that Voice Channel!`})}
    };
  }
}
