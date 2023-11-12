import { Client, Partials } from "discord.js";
import AvonConfig from "../config/Config.js";
import AvonEmoji from "../config/Emoji.js";
import AvonShoukaku from "../api/Shoukaku.js";
import AvonApi from "../api/Api.js";
import AvonEvents from "./Events.js";
import AvonCommands from "./Commands.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import AvonUtils from "./Utils.js";
import AvonLogger from "./Logger.js";
import AvonSpotify from "../api/Spotify.js";
import AvonKazagumo from "../api/Kazagumo.js";

export default class Avon extends Client {
  [x: string]: any;
  constructor() {
    super({
      intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "GuildInvites",
        "GuildVoiceStates",
        "MessageContent",
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
        Partials.Reaction,
      ],
      allowedMentions: {
        repliedUser: false,
        parse: ["everyone", "roles", "users"],
      },
      failIfNotExists: true,
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });
    this.config = new AvonConfig();
    this.emoji = new AvonEmoji(this);
    this.shoukaku = new AvonShoukaku(this);
    this.kazagumo = new AvonKazagumo(this);
    this.spotify = new AvonSpotify(this);
    this.cluster = new ClusterClient(this);
    this.logger = new AvonLogger(this);
    this.utils = new AvonUtils(this);
    this.api = new AvonApi(this);
    this.events = new AvonEvents(this).loadEvents();
    this.commands = new AvonCommands(this).loadCommands();
  }
  start() {
    return super.login(this.config.token);
  }
}
