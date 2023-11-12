import { Player } from "shoukaku";
import AvonDispatcher from "./Dispatcher.js";

export default class AvonApi extends Map {
  client: any;
  constructor(client: any) {
    super();
    this.client = client;
  }
  public async handle(
    guild: any,
    member: any,
    channel: any,
    node: any,
    track: any
  ) {
    const present = this.get(guild?.id);
    if (!present) {
      const player = await node.joinChannel({
        guildId: guild.id,
        channelId: member.voice.channel.id,
        shardId: guild.shardId,
        deaf: true,
      });
      const dispatcher = new AvonDispatcher(
        this.client,
        guild,
        channel,
        player
      );
      dispatcher.queue.push(track);
      dispatcher.updateQueue(guild, dispatcher.queue);
      this.set(guild.id, dispatcher);
      return dispatcher;
    }
    present.channel = channel;
    present.queue.push(track);
    present.updateQueue(guild, present.queue);
    if (!present.current) present.play();
    return null;
  }
  public async reconnect(guild: any, vc: any, txt: any, node: any) {
    const present = this.get(guild.id);
    if (present) return;
    const player = await node.joinChannel({
      guildId: guild.id,
      channelId: vc.id,
      shardId: guild.shardId,
      deaf: true,
    });
    const dispatcher = new AvonDispatcher(this.client, guild, txt, player);
    this.set(guild.id, dispatcher);
    return dispatcher;
  }
}
