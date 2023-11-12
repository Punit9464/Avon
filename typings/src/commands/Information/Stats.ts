import AvonCommand from "../../base/AvonCommand.js";
import { cpu } from "systeminformation";
import { cpus, totalmem } from "node:os";
export default class Stats extends AvonCommand {
  constructor(client: any) {
    super(client);
    this.name = "stats";
    this.aliases = ["st", "stat"];
    this.desc = "Informs you about the current statitics of the bot";
    this.usage = "stats";
    this.cat = "info";
    this.exec = async (message: any, args: any, prefix: any) => {
      let em = this.client.utils
        .premiumEmbed(message.guildId)
        .setTitle(`${this.client.user.username} Stats`)
        .addFields([
          {
            name: `__Avon Information__`,
            value: `Bot's Mention: ${this.client.user}\nBot's Tag: ${
              this.client.user.tag
            }\nBot's Version: 2.1.0\nTotal Servers: ${await this.client.cluster
              .broadcastEval((x: any) => x.guilds.cache.size)
              .then((result: any) =>
                result.reduce((a: any, b: any) => a + b, 0)
              )}\nTotal Users: ${await this.client.cluster
              .broadcastEval((c: any) =>
                c.guilds.cache
                  .filter((x: any) => x.available)
                  .reduce((a: any, g: any) => a + g.memberCount, 0)
              )
              .then((r: any) =>
                r.reduce((acc: any, memberCount: any) => acc + memberCount, 0)
              )}\nTotal Channels: ${await this.client.cluster
              .broadcastEval((x: any) => x.channels.cache.size)
              .then((r: any) =>
                r.reduce((a: any, b: any) => a + b, 0)
              )}\nLast Rebooted: <t:${Math.round(
              this.client.readyTimestamp / 1000
            )}:R>`,
          },
        ])
        .setThumbnail(this.client.user.displayAvatarURL());

      let cpuUsage: any;
      let cpuFree: any;
      const lol =
        Object.values(cpus()[0].times).reduce((a: any, b: any) => a + b, 0) *
        100;
      const lol2 = (process.cpuUsage().user + process.cpuUsage().system) * 1000;
      cpuUsage = (lol2 / lol).toFixed(2);
      cpuFree = (100 - cpuUsage).toFixed(2);
      let b1 = this.client.utils.button(`custom_id`, `Team Info`, 2, `team`);
      let b2 = this.client.utils.button(`custom_id`, `General Info`, 2, `gen`);
      let b3 = this.client.utils.button(`custom_id`, `System Info`, 2, `sys`);

      let row = this.client.utils.actionRow([b1, b2.setDisabled(true), b3]);

      let msg = await message.reply({
        embeds: [em],
        components: [row],
      });

      let guild = await this.client.guilds
        .fetch(this.client.config.supportId)
        .catch(() => {});
      let punit = await guild.members.fetch("765841266181144596");
      let rihan = await guild.members.fetch("785708354445508649");
      let rohit = await guild.members.fetch("735003878424313908");
      let sumit = await guild.members.fetch("259176352748404736");

      let collector = await msg.createMessageComponentCollector({
        filter: (b: any) => {
          if (b.user.id === message.author.id) return true;
          else
            return b.reply({
              content: `${this.client.emoji.cross} You are not the command requester`,
              ephemeral: true,
            });
        },
        time: 100000 * 7,
      });

      collector.on("collect", async (interaction: any) => {
        if (interaction.isButton()) {
          if (interaction.customId === `team`) {
            return interaction
              .update({
                embeds: [
                  this.client.utils
                    .premiumEmbed(message.guildId)
                    .setAuthor({
                      name: `${this.client.user.username}`,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setTitle(`${this.client.user.username} Stats`)
                    .addFields([
                      {
                        name: `__Developers__`,
                        value: `**1.** ${checkMemPresence(
                          punit
                        )} [Punit](https://discord.com/users/765841266181144596) [ID: 765841266181144596] \n**2.** ${checkMemPresence(
                          rihan
                        )} [Rihan.ly](https://discord.com/users/785708354445508649) [ID: 785708354445508649]`,
                      },
                      {
                        name: `__Owners__`,
                        value: `**1.** ${checkMemPresence(
                          sumit
                        )} [Sumit](https://discord.com/users/259176352748404736) [ID: 259176352748404736]\n**2.** ${checkMemPresence(
                          rohit
                        )} [Rohit](https://discord.com/users/735003878424313908) [ID: 735003878424313908]`,
                      },
                    ])
                    .setThumbnail(this.client.user.displayAvatarURL()),
                ],
                components: [
                  this.client.utils.actionRow([
                    this.client.utils
                      .button(`custom_id`, `Team Info`, 2, `team`)
                      .setDisabled(true),
                    this.client.utils.button(
                      `custom_id`,
                      `General Info`,
                      2,
                      `gen`
                    ),
                    this.client.utils.button(
                      `custom_id`,
                      `System Info`,
                      2,
                      `sys`
                    ),
                  ]),
                ],
              })
              .catch(() => {});
          } else if (interaction.customId === `gen`) {
            await interaction.deferUpdate();
            return await msg
              .edit({
                embeds: [em],
                components: [
                  this.client.utils.actionRow([
                    this.client.utils.button(
                      `custom_id`,
                      `Team Info`,
                      2,
                      `team`
                    ),
                    this.client.utils
                      .button(`custom_id`, `General Info`, 2, `gen`)
                      .setDisabled(true),
                    this.client.utils.button(
                      `custom_id`,
                      `System Info`,
                      2,
                      `sys`
                    ),
                  ]),
                ],
              })
              .catch(() => {});
          } else if (interaction.customId === `sys`) {
            await interaction.deferUpdate();
            return await msg
              .edit({
                embeds: [
                  this.client.utils
                    .premiumEmbed(message.guildId)
                    .setAuthor({
                      name: `${this.client.user.username}`,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setTitle(`${this.client.user.username} Stats`)
                    .addFields([
                      {
                        name: `Cpu Info`,
                        value: `Cores: ${(await cpu()).cores}\nModel: ${
                          cpus()[0].model
                        }\nSpeed: ${
                          cpus()[0].speed
                        }\nUsage: ${cpuUsage}%\nFree: ${cpuFree}%`,
                      },
                      {
                        name: `Memory Info`,
                        value: `Total: ${(totalmem() / 1024 / 1024).toFixed(
                          2
                        )}\nUsed: ${(
                          process.memoryUsage().heapUsed /
                          1024 /
                          1024
                        ).toFixed(2)}\nFree: ${(
                          totalmem() / 1024 / 1024 -
                          process.memoryUsage().heapUsed / 1024 / 1024
                        ).toFixed(2)}`,
                      },
                    ])
                    .setThumbnail(this.client.user.displayAvatarURL()),
                ],
                components: [
                  this.client.utils.actionRow([
                    this.client.utils.button(
                      `custom_id`,
                      `Team Info`,
                      2,
                      `team`
                    ),
                    this.client.utils.button(
                      `custom_id`,
                      `General Info`,
                      2,
                      `gen`
                    ),
                    this.client.utils
                      .button(`custom_id`, `System Info`, 2, `sys`)
                      .setDisabled(true),
                  ]),
                ],
              })
              .catch(() => {});
          }
        }
      });

      collector.on("end", async () => {
        if (!msg) return;
        else
          return await msg.edit({
            components: [
              this.client.utils.actionRow([
                b1.setDisabled(true),
                b2.setDisabled(true),
                b3.setDisabled(true),
              ]),
            ],
          });
      });
    };
  }
}

function checkMemPresence(member: any) {
  try {
    if (member.presence?.status === `online`)
      return "<:online:1123087833788330066>";
    else if (member.presence?.status === `idle`)
      return "<:idle:1123087869460885614>";
    else if (member.presence?.status === `offline`)
      return "<:Offline:1123088263503159327>";
    else if (member.presence?.status === `dnd`)
      return "<:dnd:1123087852834664468>";
    else return "<:Offline:1123088263503159327>";
  } catch (e) {
    console.log(e);
    return "<:Offline:1123088263503159327>";
  }
}
