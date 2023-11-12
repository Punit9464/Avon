import { PermissionFlagsBits } from "discord.js";
import { disable247, get247Set } from "./db/settings.js";

export default function reconnection(client: any) {
  client.guilds.cache.forEach(async (x: any) => {
    if (client.utils.get247(x.id)) {
      let set = get247Set(x.id);
      if (x.channels.cache.get(set.CHANNELID)) {
        let node = client.shoukaku.getNode();
        if (
          x.members.me
            .permissionsIn(x.channels.cache.get(set.CHANNELID))
            .has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])
        ) {
          await client.api.reconnect(
            x,
            x.channels.cache.get(set.CHANNELID),
            x.channels.cache.get(set.TEXTID),
            node
          );
        } else disable247(x.id);
      } else disable247(x.id);
    }
  });
}
