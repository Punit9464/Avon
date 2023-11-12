import AvonCommand from "../../base/AvonCommand.js";

export default class Vote extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "vote";
    this.aliases = [];
    this.desc = "Gives you the vote link for the bot";
    this.usage = "vote";
    this.cat = "info";
    this.exec = async (message: any, args: any, prefix: any) => {
      return message.reply({
        content: `Here You Go!`,
        components: [
          this.client.utils.actionRow([
            this.client.utils.button(
              `link`,
              `Vote Me`,
              null,
              null,
              `${this.client.config.voteUrl}`,
              this.client.emoji.vote
            ),
          ]),
        ],
      });
    };
  }
}
