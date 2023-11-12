import AvonCommand from "../../base/AvonCommand.js";

export default class Say extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "say";
    this.aliases = [];
    this.cat = "rihan";
    this.dev = false;
    this.premium = {
      guild: false,
      user: false,
    };
    this.manage = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      let msg = args.join(" ");
      if (!msg)
        return message.reply({
          content: `${this.client.emoji.cross} Provide me some message to say!`,
        });

      await message.delete().catch((e: any) => {});

      await message.channel.send({
        content: `${msg}`,
        allowedMentions: { repliedUser: false, parse: ["users"] },
      });

      return;
    };
  }
}
