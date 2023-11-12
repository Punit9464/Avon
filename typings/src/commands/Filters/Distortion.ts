import AvonCommand from "../../base/AvonCommand.js";

export default class Distortion extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "distortion";
    this.aliases = [];
    this.cat = "filters";
    this.manage = false;
    this.vote = true;
    this.desc = "Toggles distortion filter to the player";
    this.usage = "distortion";
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
      await dispatcher.player.setFilters({
        distortion: {
          sinOffset: 0,
          sinScale: 1,
          cosOffset: 0,
          cosScale: 1,
          tanOffset: 0,
          tanScale: 1,
          offset: 0,
          scale: 1,
        },
      });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Distortion** filter to the player`
            ),
        ],
      });
    };
  }
}
