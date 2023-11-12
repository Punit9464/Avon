import AvonCommand from "../../base/AvonCommand.js";

export default class ClearQueue extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "clearqueue";
    this.aliases = ["clear"];
    this.desc = "Cleares the queue of the player";
    this.usage = "clearqueue";
    this.cat = "music";
    this.vc = true;
    this.samevc = true;
    this.vote = false;
    this.manage = false;
    this.dev = false;
    this.dispatcher = true;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      if (!dispatcher.queue.length)
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guild.id)
              .setDescription(
                `${this.client.emoji.cross} There are **No Songs** in the queue to **Cleared**`
              ),
          ],
        });
      else {
        await dispatcher.queue.splice(0);
        return message.reply({
          embeds: [
            this.client.utils
              .premiumEmbed(message.guildId)
              .setDescription(
                `${this.client.emoji.tick} Successfully **Cleared** the Player Queue`
              ),
          ],
        });
      }
    };
  }
}
