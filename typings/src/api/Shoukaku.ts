import { Connectors, Shoukaku } from "shoukaku";
import reconnection from "./Reconnection.js";
export default class AvonShoukaku extends Shoukaku {
  constructor(client: any) {
    super(new Connectors.DiscordJS(client), client.config.nodes, {
      reconnectTries: 2,
      resumeKey: "Punit",
      resumeTimeout: 30,
      restTimeout: 10000,
      moveOnDisconnect: true,
      resume: false,
    });
    this.on("ready", (name) => {
      client.logger.ready(`${name} Node got connected`);
      reconnection(client);
      client.logger.log(
        `Client has been reconnected to all of the 24/7 Connections`
      );
    });
    this.on("error", (error) =>
      client.logger.error(`Node got some errors: ${error}`)
    );
    this.on("disconnect", (name) =>
      client.logger.warn(`${name} Node got disconnected!`)
    );
    this.on("reconnecting", (name) =>
      client.logger.warn(`${name} Node is reconnecting`)
    );
    this.on("close", (name, code, reason) =>
      client.logger.warn(
        `${name} Node got Closed due to reason: ${reason}, Code: ${code}`
      )
    );
  }
}
