import AvonCommand from "../../base/AvonCommand.js";

export default class AvonSkip extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "skip";
    this.aliases = ["s"];
    this.cat = "music";
    this.dev = false;
    this.desc = "Skips the current track of the player";
    this.manage = false;
    this.vc = true;
    this.samevc = true;
    this.premium = {
      guild: false,
      user: false,
    };
    this.dispatcher = true;
    this.playing = true;
    this.vote = false;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      await dispatcher.player.stopTrack();
      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Skipped** the current track`
            ),
        ],
      });
    };
  }
}
