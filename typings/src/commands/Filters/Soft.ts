import AvonCommand from "../../base/AvonCommand.js";

export default class Soft extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "soft";
    this.aliases = [];
    this.cat = "filters";
    this.manage = false;
    this.vote = true;
    this.vc = true;
    this.desc = "Toggles soft filter to the player";
    this.usage = "soft";
    this.samevc = true;
    this.dispatcher = true;
    this.playing = true;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      await dispatcher.player.setFilters({ lowPass: { smoothing: 20.0 } });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Soft** filter to the player`
            ),
        ],
      });
    };
  }
}
