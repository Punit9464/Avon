import Avon from "./structures/Client.js";
import AvonConfig from "./config/Config.js";
const Config = new AvonConfig();
const client = new Avon();
client.start();

// import { AutoPoster } from "topgg-autoposter";

// const autoposter = AutoPoster(Config.voteApi, client);
// autoposter.on("posted", (stats) => {
//   client.logger.log(`Posted Stats to TopGG`);
// })

export default client;

["unhandledRejection", "uncaughtException"].forEach((x: string) => {
  process.on(x, (e: any) => console.error(e));
});
