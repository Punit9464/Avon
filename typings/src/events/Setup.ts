import AvonDispatcher from "../api/Dispatcher.js";
import { getPrefix } from "../api/db/prefix.js";
import AvonEvent from "../base/AvonEvent.js";

export default class AvonSetup extends AvonEvent {
  [x: string]: any;
  constructor(client: any) {
    super(client);
    this.name = "messageCreate";
    this.run = async (message: any) => {
      if (this.client.utils.checkDjSetup(message.guild.id) === true) {
        let set = this.client.utils.getDj(message.guildId);
        if (set.CHANNEL === message.channel.id) {
          if (message.author.bot && message.author.id !== this.client.user.id)
            return await message.delete().catch(() => {});
          if (message.author.id === this.client.user.id) return;
          if (!message.member.voice.channel) {
            await message.delete().catch(() => {});
            return message.channel
              .send({
                content: `${message.author} ${this.client.emoji.cross} | You must be connected to a voice channel`,
              })
              .then((x: any) => {
                setTimeout(() => {
                  x.delete().catch(() => {});
                }, 5000);
              });
          }
          if (
            message.guild.members.me.voice.channel &&
            message.guild.members.me.voice.channel.id !==
              message.member.voice.channel.id
          ) {
            await message.delete().catch(() => {});
            return message.channel
              .send({
                content: `${message.author} ${this.client.emoji.cross} | You must be connected to the same voice channel ${message.guild.members.me.voice.channel}`,
              })
              .then((x: any) => {
                setTimeout(() => {
                  x.delete().catch(() => {});
                }, 5000);
              });
          }

          let prefix = getPrefix(message.guildId);
          if (prefix.PREFIX === null) prefix = this.client.config.prefix;
          let regex = new RegExp(`^<@!?${this.client.user.id}>`);
          let pre = message.content.match(regex)
            ? message.content.match(regex)[0]
            : prefix;
          if (
            client.commands.messages.get(
              message.content.trim().split(/ +/).shift().toLowerCase()
            ) ||
            client.commands.messages.find(
              (c: any) =>
                c.aliases &&
                c.aliases.includes(
                  message.content.trim().split(/ +/).shift().toLowerCase()
                )
            ) ||
            (message.content.startsWith(pre) &&
              client.commands.messages.get(
                message.content
                  .slice(pre.length)
                  .trim()
                  .split(/ +/)
                  .shift()
                  .toLowerCase()
              )) ||
            (message.content.startsWith(pre) &&
              client.commands.messages.find(
                (c: any) =>
                  c.aliases &&
                  c.aliases.includes(
                    message.content
                      .slice(pre.length)
                      .trim()
                      .split(/ +/)
                      .shift()
                      .toLowerCase()
                  )
              ))
          ) {
            await message.delete().catch((e: any) => {});
            return message.channel
              .send({
                content: `${this.client.emoji.cross} | Don't use my any of the commands here ${this.client.emoji.exclamation}`,
              })
              .then((x: any) => {
                setTimeout(() => {
                  x.delete().catch(() => {});
                }, 7000);
              });
          } else {
            let node = this.client.shoukaku.getNode();

            if (message.content.match(this.client.spotify.spotifyPattern)) {
              await this.client.spotify.requestToken();
              let spoti = this.client.spotify.nodes.get("Avon");
              let res = await spoti.load(message.content);
              if (res.loadType === `PLAYLIST_LOADED`) {
                let dispatcher = this.client.api.get(message.guild.id);
                if (!dispatcher) {
                  let node = this.client.shoukaku.getNode();
                  let player = await node.joinChannel({
                    guildId: message.guildId,
                    channelId: message.member.voice.channel.id,
                    shardId: message.guild.shardId,
                    deaf: true,
                  });

                  dispatcher = new AvonDispatcher(
                    this.client,
                    message.guild,
                    message.channel,
                    player
                  );
                  this.client.api.set(message.guild.id, dispatcher);
                }

                let tracks: any[] = [];
                for (let i = 0; i < res.tracks.length; i++) {
                  let track = res.tracks[i];
                  track.info.requester = message.author;
                  track = this.client.utils.track(track);
                  tracks.push(track);
                }
                tracks.forEach((x: any) => dispatcher.queue.push(x));
                if (!dispatcher.current) dispatcher.play();
                dispatcher.channel = message.channel;
                await message.delete().catch(() => {});
                return;
              } else if (
                res.loadType === `LOAD_FAILED` ||
                res.loadType === `NO_RESULTS`
              ) {
                await message.delete().catch(() => {});
                return message.channel
                  .send({
                    content: `${this.client.emoji.cross} **No Results** found for the given query!`,
                  })
                  .then((x: any) => {
                    setTimeout(() => {
                      x.delete().catch(() => {});
                    }, 5000);
                  });
              } else {
                await message.delete().catch(() => {});
                let track = res.tracks[0];
                track.info.requester = message.author;
                track = this.client.utils.track(track);
                const dispatcher = await this.client.api.handle(
                  message.guild,
                  message.member,
                  message.channel,
                  node,
                  track
                );
                dispatcher?.play();
                return;
              }
            } else {
              let result = await node.rest.resolve(
                this.client.utils.checkUrl(message.content)
                  ? message.content
                  : `ytsearch:${message.content}`
              );
              if (!result.tracks.length) {
                message.channel
                  .send({
                    content: `${this.client.emoji.cross} **No Results** found for the given query!`,
                  })
                  .then((x: any) => {
                    setTimeout(() => {
                      x.delete().catch(() => {});
                    }, 5000);
                  });
                await message.delete().catch(() => {});
                return;
              }
              if (result.loadType === `PLAYLIST_LOADED`) {
                const trs: any[] = [];
                for (let i = 0; i < result.tracks.length; i++) {
                  let track = result.tracks[i];
                  track.info.requester = message.author;
                  track = this.client.utils.track(track);
                  trs.push(track);
                }
                let dispatcher = this.client.api.get(message.guild.id);
                if (!dispatcher) {
                  let node = this.client.shoukaku.getNode();
                  let player = await node.joinChannel({
                    guildId: message.guildId,
                    channelId: message.member.voice.channel.id,
                    shardId: message.guild.shardId,
                    deaf: true,
                  });

                  dispatcher = new AvonDispatcher(
                    this.client,
                    message.guild,
                    message.channel,
                    player
                  );
                  this.client.api.set(message.guild.id, dispatcher);
                }
                trs.forEach((x: any) => dispatcher.queue.push(x));
                if (!dispatcher.current) dispatcher.play();
                await message.delete().catch(() => {});
                return;
              } else {
                let tr = result.tracks[0];
                tr.info.requester = message.author;
                tr = this.client.utils.track(tr);
                const dispatcher = await this.client.api.handle(
                  message.guild,
                  message.member,
                  message.channel,
                  node,
                  tr
                );
                dispatcher?.play();
                await message.delete().catch(() => {});
                return;
              }
            }
          }
        }
      }
    };
  }
}
