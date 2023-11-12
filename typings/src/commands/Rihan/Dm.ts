import AvonCommand from "../../base/AvonCommand.js";
export default class Dm extends AvonCommand {
  constructor(client: object) {
    super(client);
    this.name = "dm";
    this.aliases = [];
    this.cat = "rihan";
    this.manage = false;
    this.premium = {
      guild: false,
      user: false,
    };
    this.dev = false;
    this.vote = false;
    this.exec = async (message: any, args: any, prefix: any) => {
      let user: undefined | any;
      if (
        message.mentions.users
          .filter((x: any) => x !== this.client.user)
          .first()
      )
        user = message.mentions.users
          .filter((x: any) => x !== this.client.user)
          .first();
      else if (args[0]) user = await this.client.users.fetch(args[0]);

      if (!user)
        return message.reply({
          embeds: [
            this.client.utils
              .errorEmbed()
              .setDescription(
                `${this.client.emoji.cross} Please provide me a valid user!`
              ),
          ],
        });

      let msg = args.slice(1).join(" ");
      if (!msg)
        return message.reply({
          embeds: [
            this.client.utils
              .errorEmbed()
              .setDescription(
                `${this.client.emoji.cross} Please provide me some message to be sent!`
              ),
          ],
        });

      try {
        await message.delete().catch(() => {});
        await user.send({
          content: `${msg}`,
        });
        return message
          .reply({
            embeds: [
              this.client.utils
                .successEmbed()
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Sent** Dm Message to **${user.tag}**`
                ),
            ],
          })
          .then((x: any) => {
            setTimeout(() => {
              x.delete().catch(() => {});
            }, 3000);
          });
      } catch (e) {
        return message
          .reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} Unable to send any Dm Message to **${user.tag}**`
                ),
            ],
          })
          .then((x: any) => {
            setTimeout(() => {
              x.delete().catch(() => {});
            }, 3000);
          });
      }
    };
  }
}
