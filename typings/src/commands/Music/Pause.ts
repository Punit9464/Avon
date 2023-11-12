import AvonCommand from "../../base/AvonCommand.js";

export default class Pause extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "pause";
    this.aliases = [];
    this.desc = "Pauses the current track";
    this.cat = "music";
    this.vc = true;
    this.samevc = true;
    this.dev = false;
    this.manage = false;
    this.dispatcher = true;
    this.playing = true;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      if (dispatcher.player.paused)
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.cross} Player is Already **Paused** right now!`
              ),
          ],
        });

      await dispatcher.player.setPaused(true);
      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Paused** the Player!`
            )
            .setTitle(`Paused`),
        ],
      });
    };
  }
}
