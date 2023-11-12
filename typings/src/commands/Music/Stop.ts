import AvonCommand from "../../base/AvonCommand.js";

export default class Stop extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "stop";
    this.aliases = ["stop"];
    this.cat = "music";
    this.vc = true;
    this.desc = "Stops the player and resetts the queue";
    this.samevc = true;
    this.dispatcher = true;
    this.playing = true;
    this.exec = async (
      message: any,
      args: any,
      prefix: any,
      dispatcher: any
    ) => {
      dispatcher.queue.length = 0;
      dispatcher.previous = null;
      dispatcher.current = null;

      if (this.client.utils.checkDjSetup(message.guild.id) === true) {
        dispatcher.updateQueue(message.guild, dispatcher.queue);
        let set = this.client.utils.getDj(message.guild.id);
        let ch = await message.guild.channels.fetch(set.CHANNEL);
        ch.messages.fetch(set.MESSAGE).then((msg: any) =>
          msg.edit({
            embeds: [
              this.client.utils
                .embed()
                .setTitle(`Nothing Playing Right Now`)
                .setURL(`${this.client.config.voteUrl}`)
                .setImage(`${this.client.config.setupBgLink}`)
                .setAuthor({
                  name: `| Now Playing`,
                  iconURL: message.guild.iconURL({ dynamic: true }),
                })
                .setFooter({
                  text: `🔥 Thanks for choosing ${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                }),
            ],
          })
        );
      }

      dispatcher.data
        .get("Avon")
        ?.delete()
        .catch(() => {});
      dispatcher.data.delete("Avon");

      dispatcher.player.stopTrack();

      return message.reply({
        embeds: [
          this.client.utils
            .premiumEmbed(message.guildId)
            .setDescription(
              `${this.client.emoji.tick} Successfully **Stopped** the Player`
            ),
        ],
      });
    };
  }
}
