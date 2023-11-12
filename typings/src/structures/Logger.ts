import chalk from "chalk";
import moment from "moment";
const time = `[${moment().utcOffset("+5:30").format(`DD-MM-YYYY | hh:mm:ss`)}]`;
export default class AvonLogger {
  client: any;
  constructor(client: any) {
    this.client = client;
  }
  public log(x: any) {
    return console.log(
      chalk.bgHex("#1c1a1b").hex("#ff3436").bold(time) +
        " | " +
        chalk.bold("[") +
        chalk.bgHex("#ff3436").hex("#1c1a1b").bold("LOG") +
        chalk.bold("]") +
        " | " +
        x
    );
  }
  public debug(x: any) {
    return console.debug(
      chalk.bgHex("#1c1a1b").hex("#ff3436").bold(time) +
        " | " +
        chalk.bold("[") +
        chalk.bgHex("#ff3436").hex("#1c1a1b").bold("DEBUG") +
        chalk.bold("]") +
        " | " +
        x
    );
  }
  public ready(x: any) {
    return console.log(
      chalk.bgHex("#1c1a1b").hex("#ff3436").bold(time) +
        " | " +
        chalk.bold("[") +
        chalk.bgHex("#ff3436").hex("#1c1a1b").bold("READY") +
        chalk.bold("]") +
        " | " +
        x
    );
  }

  public warn(x: any) {
    return console.warn(
      chalk.bgHex("#1c1a1b").hex("#ff3436").bold(time) +
        " | " +
        chalk.bold("[") +
        chalk.bgHex("#ff3436").hex("#1c1a1b").bold("WARN") +
        chalk.bold("]") +
        " | " +
        x
    );
  }

  public error(x: any) {
    return console.warn(
      chalk.bgHex("#1c1a1b").hex("#ff3436").bold(time) +
        " | " +
        chalk.bold("[") +
        chalk.bgHex("#ff3436").hex("#1c1a1b").bold("ERROR") +
        chalk.bold("]") +
        " | " +
        x
    );
  }
}
