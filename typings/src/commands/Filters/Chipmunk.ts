import AvonCommand from "../../base/AvonCommand.js";

export default class Chipmunk extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "chipmunk";
    this.aliases = [];
    this.cat = "filters";
    this.manage = false;
    this.vote = true;
    this.vc = true;
    this.desc = "Toggles Chipmunk filter to the player";
    this.usage = "chipmunk";
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
        timescale: {
          speed: 1.05,
          pitch: 1.35,
          rate: 1.25,
        },
      });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Chipmunk** filter to the player`
            ),
        ],
      });
    };
  }
}
