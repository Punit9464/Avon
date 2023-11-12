import {
  addRihan,
  checkRihan,
  listRihan,
  removeRihan,
} from "../../api/db/management.js";
import AvonCommand from "../../base/AvonCommand.js";

export default class Rihan extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "rihan";
    this.aliases = [];
    this.cat = "rihan";
    this.dev = true;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0])
        return message.reply({
          embeds: [
            this.client.utils
              .embed()
              .setTitle(`Rihan Subcommands`)
              .setDescription(
                `\`${prefix}rihan add\`
                Adds a user to rihan commands
                    
                \`${prefix}rihan remove\`
                Removes a user from rihan commands
                
                \`${prefix}rihan list\`
                Shows the list of the rihan command users`
              )
              .setTimestamp()
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true })),
          ],
        });
      if (args[0].toLowerCase() === `add`) {
        let user;
        if (
          message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first()
        )
          user = message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first();
        else if (args[1]) user = await this.client.users.fetch(args[1]);
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

        if (checkRihan(user.id) === true)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} This User is already present in Rihan's List`
                ),
            ],
          });
        else {
          addRihan(user.id);
          return message.reply({
            embeds: [
              this.client.utils
                .successEmbed()
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Added** ${user.tag} to my **Rihan's List**`
                ),
            ],
          });
        }
      } else if (args[0].toLowerCase() === `remove`) {
        let user;
        if (
          message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first()
        )
          user = message.mentions.users
            .filter((x: any) => x !== this.client.user)
            .first();
        else if (args[1]) user = await this.client.users.fetch(args[1]);
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

        if (checkRihan(user.id) === false)
          return message.reply({
            embeds: [
              this.client.utils
                .errorEmbed()
                .setDescription(
                  `${this.client.emoji.cross} This User is not present in Rihan's List`
                ),
            ],
          });
        else {
          removeRihan(user.id);
          return message.reply({
            embeds: [
              this.client.utils
                .successEmbed()
                .setDescription(
                  `${this.client.emoji.tick} Successfully **Removed** ${user.tag} from my Rihan's List`
                ),
            ],
          });
        }
      } else if (args[0].toLowerCase() === `list`) {
        let lol = [];
        let list = listRihan();
        let us: undefined | any;
        for (let i = 0; i < list.length; i++) {
          us = await this.client.users.fetch(list[i]);
          lol.push(
            `**(${i + 1})** [${us.tag}](${this.client.config.server}) [ID: ${
              us.id
            }]`
          );
        }

        return message.reply({
          embeds: [
            this.client.utils
              .embed()
              .setDescription(list.length ? lol.sort().join("\n") : "No Users")
              .setTitle(`Rihan List`),
          ],
        });
      }
    };
  }
}
