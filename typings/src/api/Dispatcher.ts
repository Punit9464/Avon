import { Collection } from "discord.js";
import { get247Set, getAutoplay } from "./db/settings.js";
import { times } from "lodash";
import { getDjChannel } from "./db/dj.js";
export default class AvonDispatcher {
  public client: any;
  public guild: any;
  public channel: any;
  public player: any;
  public repeat: string;
  public current: any;
  public stopped: boolean;
  public punit: boolean;
  public previous: any;
  public queue: any[];
  // public filters: object;
  public data: Collection<string, any>;
  constructor(client: any, guild: any, channel: any, player: any) {
    this.client = client;
    this.guild = guild;
    this.channel = channel;
    this.player = player;
    this.repeat = "off";
    this.queue = [];
    this.data = new Collection();
    this.current = null;
    this.previous = null;
    this.stopped = false;
    this.punit = false;
    // this.filters = {
    //   eightD: false,
    //   nightcore: false,
    //   bassboost: false,
    //   daycore: false,
    //   vaporwave: false,
    //   pop: false,
    //   soft: false,
    //   china: false,
    //   chipmunk: false,
    //   distortion: false,
    //   earrape: false,
    //   karaoke: false,
    //   treblebass: false,
    //   tremolo: false,
    //   vibrato: false,
    // };

    this.player.on("start", async () => {
      if (this.repeat === "one") {
        if (this.punit) return;
        else this.punit = true;
      }
      if (this.repeat === "all" || this.repeat === "off") {
        this.punit = false;
      }
      if (this.client.utils.checkDjSetup(this.guild.id) === true) {
        let setup = this.client.utils.getDj(this.guild.id);
        let ch = await this.guild.channels.fetch(setup.CHANNEL);
        if (ch) {
          this.updateQueue(this.guild, this.queue);
          ch.messages.fetch(setup.MESSAGE).then((x: any) => {
            x.edit({
              embeds: [
                this.client.utils
                  .embed()
                  .setTitle(
                    `${this.client.emoji.setup.nowPlaying
                    } ${this.current.info.title.substring(0, 40)}`
                  )
                  .setURL(`${this.client.config.voteUrl}`)
                  .addFields([
                    {
                      name: `${this.client.emoji.setup.requester} Requester`,
                      value: `${this.current.info.requester.tag}`,
                      inline: true,
                    },
                    {
                      name: `${this.client.emoji.setup.duration} Duration`,
                      value: `${this.client.utils.humanize(
                        this.current.info.length
                      )}`,
                      inline: true,
                    },
                    {
                      name: `${this.client.emoji.setup.author} Song Author`,
                      value: `[${this.current.info.author}](${this.client.config.voteUrl})`,
                      inline: true,
                    },
                  ])
                  .setImage(`${this.client.config.setupBgLink}`)
                  .setFooter({
                    text: `🔥 Thanks for choosing ${this.client.user.username}`,
                    iconURL: this.client.user.displayAvatarURL(),
                  })
                  .setAuthor({
                    name: `| Now Playing`,
                    iconURL: this.client.user.displayAvatarURL(),
                  }),
              ],
            });
          });
        }
      }
      let setting = this.client.utils.getPlayerMode(this.guild.id);
      if (setting === "avon-old") {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setDescription(
            `[${this.current.info.title}](${this.client.config.voteUrl}) By [${this.current.info.author
            }](${this.client.config.voteUrl})  [${this.client.utils.humanize(
              this.current.info.length
            )}]`
          )
          .setThumbnail(
            this.current.info.requester.displayAvatarURL({ dynamic: true })
          )
          .setAuthor({
            name: `| Now Playing`,
            iconURL: this.current.info.requester.displayAvatarURL({
              dynamic: true,
            }),
          });
        let b1 = this.client.utils.button(`custom_id`, `Stop`, 4, `avon_stop`);
        let b2 = this.client.utils.button(
          `custom_id`,
          `Pause`,
          3,
          `avon_pause`
        );
        let b3 = this.client.utils.button(`custom_id`, `Loop`, 1, `avon_loop`);
        let b4 = this.client.utils.button(
          `custom_id`,
          `Previous`,
          2,
          `avon_previous`
        );
        let b5 = this.client.utils.button(`custom_id`, `Skip`, 2, `avon_skip`);
        let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x: any) => {
              this.data.set("Avon", x);
            });
        return;
      }
      if (setting === `avon-classic`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
          )
          .setTitle(
            `${this.client.emoji.avonNew.nowPlaying
            } ${this.current.info.title.substring(0, 30)}`
          )
          .setURL(`${this.client.config.voteUrl}`)
          .setDescription(
            `${this.client.emoji.avonNew.requester} **Requester :** ${this.current.info.requester.tag
            }\n${this.client.emoji.avonNew.duration
            } **Duration :** ${this.client.utils.humanize(
              this.current.info.length
            )}`
          );
        let b1 = this.client.utils.button(`custom_id`, `Stop`, 4, `avon_stop`);
        let b2 = this.client.utils.button(
          `custom_id`,
          `Pause`,
          3,
          `avon_pause`
        );
        let b3 = this.client.utils.button(`custom_id`, `Loop`, 1, `avon_loop`);
        let b4 = this.client.utils.button(
          `custom_id`,
          `Previous`,
          2,
          `avon_previous`
        );
        let b5 = this.client.utils.button(`custom_id`, `Skip`, 2, `avon_skip`);
        let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      }
      if (setting === "avon-no") {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setThumbnail(
            this.current.info.requester.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            `${this.client.emoji.noButtons.emote
            } [${this.current.info.title.substring(0, 35)}](${this.client.config.voteUrl
            })`
          )
          .addFields([
            {
              name: `${this.client.emoji.noButtons.requester} Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.noButtons.duration} Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
          ]);

        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          this.client.emoji.noButtons.filters,
          `Resets all the filters of the player`,
          `avon_filter_reset`
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          this.client.emoji.noButtons.filters,
          `Sets Up 8d filter to the player`,
          `avon_filter_8d`
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          this.client.emoji.noButtons.filters,
          `Sets bassboost filter to the player`,
          `avon_filter_bassboost`
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          this.client.emoji.noButtons.filters,
          `Sets NightCore filter to the player`,
          `avon_filter_nightcore`
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          this.client.emoji.noButtons.filters,
          `Sets Vaporwave filter to the player`,
          `avon_filter_vibrato`
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(
          `Choose filters`,
          `no-buttons`,
          options
        );

        let row = this.client.utils.actionRow([menu]);

        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      }

      if (setting === `avon-special`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setTitle(`${this.current.info.title.substring(0, 35)}`)
          .setURL(`${this.client.config.voteUrl}`)
          .addFields([
            {
              name: `${this.client.emoji.special.requester} Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.special.duration} Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
            },
          ])
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
          );

        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_previous`,
          null,
          this.client.emoji.special.previous
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_shuffle`,
          null,
          this.client.emoji.special.shuffle
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_pause`,
          null,
          this.client.emoji.special.pause
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_loop`,
          null,
          this.client.emoji.special.loop
        );
        let b5 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_skip`,
          null,
          this.client.emoji.special.skip
        );
        let b6 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_volLow`,
          null,
          this.client.emoji.special.volLow
        );
        let b7 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_backward`,
          null,
          this.client.emoji.special.backward
        );
        let b8 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_stop`,
          null,
          this.client.emoji.special.stop
        );
        let b9 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_forward`,
          null,
          this.client.emoji.special.forward
        );
        let b10 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_volHigh`,
          null,
          this.client.emoji.special.volHigh
        );
        let row1 = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        let row2 = this.client.utils.actionRow([b6, b7, b8, b9, b10]);

        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row1, row2],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      }

      if (setting === `avon-simple`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setDescription(
            `[${this.current.info.title.substring(0, 35)}](${this.client.config.voteUrl
            })`
          )
          .addFields([
            {
              name: `${this.client.emoji.simple.requester} Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.simple.duration} Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.simple.author} Author`,
              value: `${this.current.info.author}`,
              inline: true,
            },
          ]);

        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          this.client.emoji.simple.filters,
          `Resets all the filters of the player`,
          `avon_filter_reset`
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          this.client.emoji.simple.filters,
          `Sets Up 8d filter to the player`,
          `avon_filter_8d`
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          this.client.emoji.simple.filters,
          `Sets bassboost filter to the player`,
          `avon_filter_bassboost`
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          this.client.emoji.simple.filters,
          `Sets NightCore filter to the player`,
          `avon_filter_nightcore`
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          this.client.emoji.simple.filters,
          `Sets Vaporwave filter to the player`,
          `avon_filter_vibrato`
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
        let row1 = this.client.utils.actionRow([menu]);

        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_pause`,
          null,
          this.client.emoji.simple.pause
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_skip`,
          null,
          this.client.emoji.simple.skip
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_loop`,
          null,
          this.client.emoji.simple.loop
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_stop`,
          null,
          this.client.emoji.simple.stop
        );
        let row2 = this.client.utils.actionRow([b1, b2, b3, b4]);

        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row1, row2],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      }
      if (setting === `avon-spotify`) {
        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          this.client.emoji.spotify.filters,
          `Resets all the filters of the player`,
          `avon_filter_reset`
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          this.client.emoji.spotify.filters,
          `Sets Up 8d filter to the player`,
          `avon_filter_8d`
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          this.client.emoji.spotify.filters,
          `Sets bassboost filter to the player`,
          `avon_filter_bassboost`
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          this.client.emoji.spotify.filters,
          `Sets NightCore filter to the player`,
          `avon_filter_nightcore`
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          this.client.emoji.spotify.filters,
          `Sets Vaporwave filter to the player`,
          `avon_filter_vibrato`
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
        let row1 = this.client.utils.actionRow([menu]);
        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_previous`,
          null,
          this.client.emoji.spotify.previous
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_shuffle`,
          null,
          this.client.emoji.spotify.shuffle
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_pause`,
          null,
          this.client.emoji.spotify.pause
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_loop`,
          null,
          this.client.emoji.spotify.loop
        );
        let b5 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_skip`,
          null,
          this.client.emoji.spotify.skip
        );
        let b6 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_volLow`,
          null,
          this.client.emoji.spotify.volLow
        );
        let b7 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_backward`,
          null,
          this.client.emoji.spotify.backward
        );
        let b8 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_stop`,
          null,
          this.client.emoji.spotify.stop
        );
        let b9 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_forward`,
          null,
          this.client.emoji.spotify.forward
        );
        let b10 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_volHigh`,
          null,
          this.client.emoji.spotify.volHigh
        );
        let row2 = this.client.utils.actionRow([b1, b2, b3, b4, b5]);
        let row3 = this.client.utils.actionRow([b6, b7, b8, b9, b10]);

        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setDescription(
            `${this.client.emoji.spotify.nowPlaying
            } [${this.current.info.title.substring(0, 40)}](${this.client.config.voteUrl
            })`
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
              ? `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
              : this.current.info.requester.displayAvatarURL({ dynamic: true })
          )
          .addFields([
            {
              name: `${this.client.emoji.spotify.requester} Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.spotify.duration} Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
          ]);

        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            .send({
              embeds: [em],
              components: [row1, row2, row3],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      }
      if (setting === `avon-new`) {
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setDescription(
            `${this.client.emoji.avonNew.nowPlaying
            } [\`${this.current.info.title.substring(0, 35)}\`](${this.client.config.voteUrl
            })\n${this.client.emoji.avonNew.requester} **Requester :** ${this.current.info.requester.tag
            }\n${this.client.emoji.avonNew.duration
            } ${this.client.utils.humanize(this.current.info.length)}`
          )
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.current.info.requester.displayAvatarURL({
              dynamic: true,
            }),
          });

        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          3,
          `avon_pause`,
          null,
          this.client.emoji.avonNew.pause
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_previous`,
          null,
          this.client.emoji.avonNew.previous
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          4,
          `avon_stop`,
          null,
          this.client.emoji.avonNew.stop
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_skip`,
          null,
          this.client.emoji.avonNew.skip
        );
        let b5 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_fav`,
          null,
          this.client.emoji.setup.fav
        );

        let row = this.client.utils.actionRow([b1, b2, b3, b4, b5]);

        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      } else {
        this.client.utils.updatePlayerMode(this.guild.id, "avon-simple");
        let em = this.client.utils
          .premiumEmbed(this.guild.id)
          .setAuthor({
            name: `Now Playing`,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setThumbnail(
            `https://img.youtube.com/vi/${this.current.info.identifier}/maxresdefault.jpg`
          )
          .setDescription(
            `[${this.current.info.title.substring(0, 35)}](${this.client.config.voteUrl
            })`
          )
          .addFields([
            {
              name: `${this.client.emoji.simple.requester} Requester`,
              value: `${this.current.info.requester.tag}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.simple.duration} Duration`,
              value: `${this.client.utils.humanize(this.current.info.length)}`,
              inline: true,
            },
            {
              name: `${this.client.emoji.simple.author} Author`,
              value: `${this.current.info.author}`,
              inline: true,
            },
          ]);

        let opt1 = this.client.utils.menuOption(
          `Reset Filters`,
          this.client.emoji.simple.filters,
          `Resets all the filters of the player`,
          `avon_filter_reset`
        );
        let opt2 = this.client.utils.menuOption(
          `8D`,
          this.client.emoji.simple.filters,
          `Sets Up 8d filter to the player`,
          `avon_filter_8d`
        );
        let opt3 = this.client.utils.menuOption(
          `BassBoost`,
          this.client.emoji.simple.filters,
          `Sets bassboost filter to the player`,
          `avon_filter_bassboost`
        );
        let opt4 = this.client.utils.menuOption(
          `NightCore`,
          this.client.emoji.simple.filters,
          `Sets NightCore filter to the player`,
          `avon_filter_nightcore`
        );
        let opt5 = this.client.utils.menuOption(
          `Vaporwave`,
          this.client.emoji.simple.filters,
          `Sets Vaporwave filter to the player`,
          `avon_filter_vibrato`
        );
        let options = [opt1, opt2, opt3, opt4, opt5];
        let menu = this.client.utils.menu(`Choose filters`, `help-op`, options);
        let row1 = this.client.utils.actionRow([menu]);

        let b1 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_pause`,
          null,
          this.client.emoji.simple.pause
        );
        let b2 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_skip`,
          null,
          this.client.emoji.simple.skip
        );
        let b3 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_loop`,
          null,
          this.client.emoji.simple.loop
        );
        let b4 = this.client.utils.button(
          `custom_id`,
          null,
          2,
          `avon_stop`,
          null,
          this.client.emoji.simple.stop
        );
        let row2 = this.client.utils.actionRow([b1, b2, b3, b4]);

        if (this.client.utils.getDj(this.guild.id)?.CHANNEL !== this.channel.id)
          this.channel
            ?.send({
              embeds: [em],
              components: [row1, row2],
            })
            .then((x: any) => this.data.set("Avon", x));
        return;
      }
    });

    this.player.on("end", async () => {
      if (this.client.utils.checkDjSetup(this.guild.id) === true) {
        this.updateQueue(this.guild, this.queue);
        let set = this.client.utils.getDj(this.guild.id);
        let ch = await this.guild.channels.fetch(set.CHANNEL);
        ch.messages.fetch(set.MESSAGE).then((msg: any) =>
          msg.edit({
            embeds: [
              this.client.utils
                .embed()
                .setTitle(`Nothing Playing Right Now`)
                .setURL(`${this.client.config.voteUrl}`)
                .setImage(`${this.client.config.setupBgLink}`)
                .setAuthor({
                  name: `| Now Playing`,
                  iconURL: this.guild.iconURL({ dynamic: true }),
                })
                .setFooter({
                  text: `🔥 Thanks for choosing ${this.client.user.username}`,
                  iconURL: this.client.user.displayAvatarURL(),
                }),
            ],
          })
        );
      }
      try {
        this.data.get("Avon")?.delete();
      } catch (e) {
        /** */
      }
      this.data.delete("Avon");
      if (this.repeat === "one") {
        this.queue.unshift(this.current);
      }
      if (this.repeat === "all") {
        this.queue.push(this.current);
      }
      this.previous = this.current;
      this.current = null;
      if (getAutoplay(this.guild.id).SETTING === 1) return this.autoplay();
      else this.play();
    });
    this.player.on("closed", () => this.destroy());
  }

  get avon() {
    return this.client.api.has(this.guild.id);
  }
  public play() {
    if (!this.avon) return this.destroy();
    if (!this.queue.length) return;
    this.current = this.queue.shift();
    this.player.playTrack({ track: this.current.track });
  }
  public async destroy() {
    this.queue.length = 0;
    this.previous = null;
    this.current = null;
    this.data
      .get("Avon")
      ?.delete()
      .catch(() => { });
    if (this.client.utils.checkDjSetup(this.guild.id) === true) {
      this.updateQueue(this.guild, this.queue);
      let set = this.client.utils.getDj(this.guild.id);
      let ch = await this.guild.channels.fetch(set.CHANNEL);
      ch.messages.fetch(set.MESSAGE).then((msg: any) =>
        msg.edit({
          embeds: [
            this.client.utils
              .embed()
              .setTitle(`Nothing Playing Right Now`)
              .setURL(`${this.client.config.voteUrl}`)
              .setImage(`${this.client.config.setupBgLink}`)
              .setAuthor({
                name: `| Now Playing`,
                iconURL: this.guild.iconURL({ dynamic: true }),
              })
              .setFooter({
                text: `🔥 Thanks for choosing ${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
              }),
          ],
        })
      );
    }
    this.player.connection.disconnect();
    this.client.api.delete(this.guild.id);
    if (this.client.utils.get247(this.guild.id) === true) {
      let node = this.client.shoukaku.getNode();
      return this.client.api.reconnect(
        this.guild,
        this.guild.channels.cache.get(get247Set(this.guild.id).CHANNELID),
        this.guild.channels.cache.get(get247Set(this.guild.id).TEXTID),
        node
      );
    }
    if (this.stopped) return;
  }
  public async updateQueue(guild: any, queue: any[]) {
    let setup = this.client.utils.checkDjSetup(guild?.id);
    if (setup) {
      let set = this.client.utils.getDj(guild?.id);
      let ch = await this.guild.channels.fetch(set.CHANNEL);
      if (ch) {
        let q: any;
        if (queue.length === 0 || !queue.length)
          q = `Join a Voice Channel and type in your Search Query or a Url`;
        else if (queue.length < 11)
          q = queue
            .map(
              (x: any, i: number) =>
                `**${i + 1}.** ${x.info.title.substring(
                  0,
                  35
                )} .... *${this.client.utils.humanize(x.info.length)}*`
            )
            .sort()
            .join("\n");
        else
          q =
            queue
              .slice(0, 9)
              .map(
                (x: any, i: number) =>
                  `**${i + 1}.** ${x.info.title.substring(
                    0,
                    35
                  )} .... *${this.client.utils.humanize(x.info.length)}*`
              )
              .sort()
              .join("\n") +
            `\n**${this.queue.length - 10}** Songs are upcoming in the queue`;
        ch.messages.fetch(set.MESSAGE).then((x: any) => {
          x.edit({
            content: `__**Queue List**__\n\n${q}`,
          });
        });
      }
    } else return;
  }

  private async autoplay() {
    if (this.queue.length) return this.play();
    let identifier: string | undefined;
    if (this.previous === null) identifier = "_XBVWlI8TsQ";
    else
      identifier =
        this.previous.info.identifier || this.current.info.identifier;
    let url = `https://youtube.com/watch?v=${identifier}&list=RD${identifier}`;
    let node = this.client.shoukaku.getNode();
    let result = await node.rest.resolve(`${url}`);
    if (!result.tracks.length) return this.player.stopTrack();
    try {
      let track =
        result.tracks[
        Math.floor(Math.random() * Math.floor(result.tracks.length))
        ];
      track.info.requester = this.client.user;
      this.current = this.client.utils.track(track);
      this.player.playTrack({ track: this.current.track });
    } catch (e) {
      this.player.stopTrack();
    }
  }
}
