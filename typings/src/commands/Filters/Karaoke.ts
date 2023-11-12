import AvonCommand from "../../base/AvonCommand.js";

export default class Karaoke extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "karaoke";
    this.aliases = [];
    this.cat = "filters";
    this.manage = false;
    this.vote = true;
    this.usage = "karaoke";
    this.desc = "Toggles karaoke filter to the player";
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
        karaoke: {
          level: 1.0,
          monoLevel: 1.0,
          filterBand: 220.0,
          filterWidth: 100.0,
        },
      });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Karaoke** filter to the player`
            ),
        ],
      });
    };
  }
}
