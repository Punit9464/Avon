import AvonCommand from "../../base/AvonCommand.js";
import AvonPlayer from "../../base/AvonPlayer.js";

export default class NowPlaying extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "nowplaying";
    this.aliases = ["np"];
    this.cat = "music";
    this.vote = true;
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
      if (!dispatcher) return message.reply({
        embeds: [
          this.client.utils.premiumEmbed(message.guildId).setDescription(`${this.client.emoji.cross} I am not Playing anything currently`)
        ]
      })
      let current = dispatcher.current;
      let player = dispatcher.player;
      await message.channel.sendTyping();

      let vani = new AvonPlayer(this.client);
      vani.build(current, player).then((result) => {
        let em = this.client.utils.premiumEmbed(message.guildId);
        let png = this.client.utils.attachment(result);

        return message.reply({
          // embeds: [em.setDescription(`[${dispatcher.current.info.title.substring(0, 35)}](${this.client.config.voteUrl}) **:** [${dispatcher.current.info.requester}]`).setImage("attachment://AvonNowPlaying.png").setTitle(`Now Playing`)],
          files: [png]
        })
      })
    };
  }
}
