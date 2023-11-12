import * as fs from "fs";

export default class AvonEvents {
  client: any;
  load: boolean;
  constructor(client: any) {
    this.client = client;
    this.load = false;
  }
  public loadEvents() {
    if (this.load) return this;
    fs.readdirSync(`./build/src/events/`)
      .filter((x) => x.endsWith(".js"))
      .forEach(async (file) => {
        let vani = (await import(`../events/${file}`)).default;
        let punit = new vani(this.client);
        let run = punit?.run.bind(punit);
        this.client.on(punit?.name, run);
        this.client.logger.debug(`[Event] Loaded Client Event: ${punit?.name}`);
      });
    this.client.logger.log(`Loaded Client Events Successfully!`);
    this.load = true;
    return this;
  }
}
