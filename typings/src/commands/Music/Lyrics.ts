import { Google } from "@flytri/lyrics-finder";
import AvonCommand from "../../base/AvonCommand.js";

export default class Lyrics extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "lyrics";
    this.aliases = ["ly"];
    this.cat = "music";
    this.vc = false;
    this.samevc = false;
    this.dispatcher = false;
    this.playing = false;
    this.vote = true;
    this.exec = async (message: any, args: any, prefix: any) => {
      if (!args[0])
        return message.reply({
          content: `${this.client.emoji.cross} Please provide me a Song Name to find Lyrics For!`,
        });
      await message.channel.sendTyping();
      let result = await Google(`${args.join(" ")}`, `en`).catch((e: any) => {
        return message.reply({
          embeds: [
            this.client.utils.premiumEmbed(message.guildId).setDescription(`${this.client.emoji.cross} Sorry I Couldn't find any Lyrics for that Query!`)
          ]
        })
      })

      if (result.lyrics) await message.reply({
        embeds: [
          this.client.utils.premiumEmbed(message.guildId)
            .setDescription(result.lyrics?.length < 4096 ? result?.lyrics : result.lyrics?.slice(0, 4080) + "\n..........").setTitle(`Lyrics for: ${args.join(" ")}`)
        ]
      }).catch((e: any) => {
        return message.reply({
          embeds: [
            this.client.utils.premiumEmbed(message.guildId).setDescription(`${this.client.emoji.cross} Sorry I Couldn't find any Lyrics for that Query!`)
          ]
        })
      });

      else return;
    };
  }
}
