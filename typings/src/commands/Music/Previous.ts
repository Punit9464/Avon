import AvonCommand from "../../base/AvonCommand.js";

export default class Previous extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "previous";
    this.aliases = [];
    this.cat = "music";
    this.vc = true;
    this.samevc = true;
    this.vote = false;
    this.desc = "Plays the previous track of the queue and skips the current";
    this.usage = "previous";
    this.dispatcher = true;
    this.premium = {
      guild: false,
      user: false,
    };
    this.playing = true;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      if (dispatcher.previous === null)
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
              .setDescription(
                `${this.client.emoji.cross} There is no **[Previous Song](${this.client.config.voteUrl})** in the queue!`
              ),
          ],
        });
      else {
        dispatcher.queue.unshift(dispatcher.previous);
        dispatcher.player.stopTrack();
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Started** playing [Previous Track](${this.client.config.voteUrl})`
              ),
          ],
        });
      }
    };
  }
}
