import AvonCommand from "../../base/AvonCommand.js";

export default class Daycore extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "daycore";
    this.aliases = [];
    this.cat = "filters";
    this.manage = false;
    this.desc = "Toggles Daycore filter to the player";
    this.usage = "daycore";
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
      await dispatcher.player.setFilters({
        timscale: { speed: 1, rate: 1, pitch: 0.9 },
      });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Daycore** filter to the player`
            ),
        ],
      });
    };
  }
}
