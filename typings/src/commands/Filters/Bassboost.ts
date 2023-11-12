import AvonCommand from "../../base/AvonCommand.js";

export default class Bassboost extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "bassboost";
    this.aliases = [];
    this.cat = "filters";
    this.usage = "bassboost";
    this.desc = "Toggles BassBoost filter to the player";
    this.manage = false;
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
        equalizer: [
          { band: 0, gain: 0.1875 },
          { band: 1, gain: 0.375 },
          { band: 2, gain: -0.375 },
          { band: 3, gain: -0.1875 },
          { band: 4, gain: 0 },
          { band: 5, gain: -0.0125 },
          { band: 6, gain: -0.025 },
          { band: 7, gain: -0.0175 },
          { band: 8, gain: 0 },
          { band: 9, gain: 0 },
          { band: 10, gain: 0.0125 },
          { band: 11, gain: 0.025 },
          { band: 12, gain: 0.375 },
          { band: 13, gain: 0.125 },
          { band: 14, gain: 0.125 },
        ],
      });

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Applied Bassboost** filter to the player`
            ),
        ],
      });
    };
  }
}
