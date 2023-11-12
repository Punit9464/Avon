import AvonCommand from "../../base/AvonCommand.js";

export default class Earrape extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "earrape";
    this.aliases = [];
    this.cat = "filters";
    this.manage = false;
    this.vote = true;
    this.desc = "Toggles earrape filter to the player";
    this.usage = "earrape";
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
        equalizer: [
          ...Array(6)
            .fill(0)
            .map((n, i) => ({ band: i, gain: 0.5 })),
        ],
        volume: 5.0,
      });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Earrape** filter to the player`
            ),
        ],
      });
    };
  }
}
