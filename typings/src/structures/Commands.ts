import { Collection } from "discord.js";
import * as fs from "fs";
export default class AvonCommands {
  client: any;
  loaded: boolean;
  messages: Collection<unknown, unknown>;
  constructor(client: any) {
    this.client = client;
    this.loaded = false;
    this.messages = new Collection();
  }
  public loadCommands() {
    if (this.loaded) return this;
    fs.readdirSync(`./build/src/commands/`).forEach((dir) => {
      fs.readdirSync(`./build/src/commands/${dir}`)
        .filter((x) => x.endsWith(".js"))
        .forEach(async (file) => {
          let command = (await import(`../commands/${dir}/${file}`)).default;
          let AvonCommand = new command(this.client);
          this.messages.set(AvonCommand.name, AvonCommand);
          this.client.logger.debug(
            `Command Loaded: ${AvonCommand.name} loaded!`
          );
        });
    });
    this.client.logger.log(`Loaded Client Commands Successfully!`);
    this.loaded = true;
    return this;
  }
}
