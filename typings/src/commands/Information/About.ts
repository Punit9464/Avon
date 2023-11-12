import AvonCommand from "../../base/AvonCommand.js";

export default class About extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "about";
    this.desc = "Provides you with the information of the bot";
    this.usage = "about";
    this.aliases = ["botinfo", "bi"];
    this.cat = "info";
    this.exec = async (message: any, args: any, prefix: any) => {
      //   return message.reply({
      //     embeds: [
      //       this.client.utils.premiumEmbed(message.guildId).setDescription(),
      //     ],
      //   });
      return;
    };
  }
}
