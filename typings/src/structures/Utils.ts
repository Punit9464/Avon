import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  resolvePartialEmoji,
} from "discord.js";
import createId from "create-id";
import {
  getServerPremiumStatus,
  getUserPremStatus,
  getPremTime,
  getServerPremTime,
  getServerPrem,
  getActivator,
  deleteServerPrem,
  listfavs,
} from "../api/db/premium.js";
import { getHex, removeHex } from "../api/db/embeds.js";
import {
  addDjRole,
  checkDj,
  createDjChannel,
  deleteDjChannel,
  getDjChannel,
  getDjRole,
  getDjSetup,
  getPlayerMode,
  playType,
  removeDjRole,
  updatePlayType,
  updatePlayerMode,
} from "../api/db/dj.js";
import {
  AddGlobalNp,
  RemoveGlobalNp,
  addServerNp,
  globalNpSelection,
  removeServerNp,
  resetNp,
  serverNpSelection,
  updatePrefix,
} from "../api/db/prefix.js";
import AvonTrack from "../base/AvonTrack.js";
import {
  addBypassAdmins,
  addBypassMods,
  addIgnore,
  checkBypassAdmins,
  checkBypassMods,
  checkIgnore,
  disable247,
  disableAutoplay,
  enable247,
  enableAutoplay,
  get247,
  getAutoplay,
  listIgnores,
  removeAdminBypass,
  removeBypassMods,
  removeIgnore,
  resetIgnore,
} from "../api/db/settings.js";
import prettyMilliseconds from "pretty-ms";
export default class AvonUtils {
  client: any;
  constructor(client: any) {
    this.client = client;
  }
  public embed() {
    return new EmbedBuilder().setColor(this.client.config.color);
  }
  public successEmbed() {
    return new EmbedBuilder().setColor("#33ff00");
  }
  public errorEmbed() {
    return new EmbedBuilder().setColor("#ff0e00");
  }
  public premiumEmbed(guildID: string) {
    if (
      this.checkServerPrem(guildID) === false &&
      this.checkServerPremStatus(guildID) === false
    ) {
      removeHex(guildID);
      return new EmbedBuilder().setColor(this.client.config.color);
    } else {
      try {
        let hex = getHex(guildID);
        if (hex.HEXCODE === null)
          return new EmbedBuilder().setColor(this.client.config.color);
        else
          return new EmbedBuilder().setColor(
            hex.HEXCODE ? hex.HEXCODE : this.client.config.color
          );
      } catch (e) {
        removeHex(guildID);
        return new EmbedBuilder().setColor(this.client.config.color);
      }
    }
  }
  public genPremId() {
    let prefix = "avon_";
    let suffix = "_op";
    let length = 10;
    return createId(prefix, suffix, length);
  }
  public checkUserPrem(id: string): boolean {
    let stat = getUserPremStatus(id);
    if (stat.USER === null) return false;
    else return true;
  }
  public checkServerPremStatus(id: string) {
    let stat = getServerPremiumStatus(id);
    if (stat.STATUS === 1) return true;
    else return false;
  }
  public checkPremTime(id: string) {
    let stat = getPremTime(id);
    if (stat.TIME === 0) return 0;
    else return stat.TIME;
  }
  public checkServerPremTime(id: string) {
    let stat = getServerPremTime(id);
    if (stat.TIME === null) return 0;
    else return stat.TIME;
  }
  public checkServerPrem(id: string) {
    let check = getServerPrem(id);
    if (check.SERVER !== null) return true;
    else return false;
  }
  public checkActivator(id: string) {
    let check = getActivator(id);
    if (check.USER !== null) return check.USER;
    else return null;
  }
  public deleteServerPrem(id: string) {
    deleteServerPrem(id);
    return true;
  }
  public actionRow(components: any[]) {
    return new ActionRowBuilder().addComponents(components);
  }
  public button(
    base: string,
    label: string,
    style: number,
    customId: string,
    url: string,
    emoji?: any
  ) {
    if (base === "custom_id") {
      let button = new ButtonBuilder().setCustomId(customId).setStyle(style);
      if (emoji !== undefined && emoji !== null && resolvePartialEmoji(emoji))
        button.setEmoji(emoji);
      if (label !== null && label !== undefined) button.setLabel(label);
      return button;
    } else if (base === "link") {
      let button = new ButtonBuilder().setLabel(label).setURL(url).setStyle(5);
      if (emoji !== undefined && emoji !== null && resolvePartialEmoji(emoji))
        button.setEmoji(emoji);
      return button;
    }
  }
  public menuOption(
    label: string,
    emoji: string,
    description: string,
    value: string
  ) {
    const ob: {
      label: string;
      description: string;
      value: string;
      emoji?: string;
    } = {
      label: label,
      description: description,
      value: value,
    };
    if (emoji !== null && emoji !== undefined && resolvePartialEmoji(emoji))
      ob.emoji = emoji;
    return ob;
  }
  public menu(placeholder: string, customId: string, options: any) {
    return new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .setOptions(options);
  }
  public getPlayerMode(id: string) {
    let get = getPlayerMode(id);
    return get.MODE;
  }
  public updatePlayerMode(id: string, mode: string) {
    updatePlayerMode(id, mode);
    return true;
  }
  public checkDjSetup(id: string) {
    let get = checkDj(id);
    if (get === true) return true;
    else return false;
  }
  public djSetupChannel(id: string) {
    let get = getDjChannel(id);
    return get.CHANNEL;
  }
  public addGlobalNp(id: string, res: string) {
    AddGlobalNp(id, res);
    return true;
  }
  public removeGlobalNp(id: string) {
    RemoveGlobalNp(id);
    return true;
  }
  public checkGlobalNp(id: string) {
    if (globalNpSelection(id) === true) return true;
    else return false;
  }
  public checkGuildNp(guildId: string, user: string) {
    let check = serverNpSelection(user, guildId);
    if (check === true) return true;
    else return false;
  }
  public addGuildNp(guild: string, user: string, reason: string) {
    addServerNp(user, guild, reason);
    return true;
  }
  public removeGuildNp(user: string, guild: string) {
    removeServerNp(user, guild);
    return true;
  }
  public createDj(guildId: string, channelId: string, messageId: string) {
    createDjChannel(guildId, channelId, messageId);
    return true;
  }
  public deleteDj(guildId: string) {
    deleteDjChannel(guildId);
    return true;
  }
  public getDj(guildId: string) {
    let get = getDjSetup(guildId);
    if (get.CHANNEL !== null && get.MESSAGE !== null) return get;
    else return null;
  }
  public getdjrole(guildId: string) {
    let get = getDjRole(guildId);
    if (get.ROLE !== null) return get.ROLE;
    else return null;
  }
  public addDjRole(guild: string, role: string) {
    addDjRole(guild, role);
    return true;
  }
  public deleteDjRole(guild: string) {
    removeDjRole(guild);
    return true;
  }
  public getPlay(guild: string) {
    let get = playType(guild);
    if (get.TYPE === null) {
      this.updatePlay(guild, "buttons");
      return null;
    } else return get.TYPE;
  }
  public updatePlay(guild: string, type: string) {
    updatePlayType(guild, type);
    return;
  }
  public checkUrl(x: string) {
    try {
      new URL(x);
      return true;
    } catch (e) {
      return false;
    }
  }
  public track(tr: any) {
    return new AvonTrack(tr);
  }
  public resetNoPrefix() {
    return resetNp();
  }

  public findFavs(user: string, track: any) {
    let list = listfavs(user);
    if (list.includes(track.info.title)) return true;
    else return false;
  }
  public getAutoPlay(guild: string) {
    if (getAutoplay(guild).SETTING === 1) return true;
    else return false;
  }
  public updateAutoPlay(guild: string) {
    if (getAutoplay(guild).SETTING === 1) {
      disableAutoplay(guild);
      return false;
    } else {
      enableAutoplay(guild);
      return true;
    }
  }

  public get247(guild: string) {
    let get = get247(guild);
    if (get.SETTING === 1) return true;
    else return false;
  }

  public disable247(guild: string) {
    disable247(guild);
    return true;
  }

  public updatePrefix(guild: string, prefix: string) {
    updatePrefix(guild, prefix);
    return true;
  }

  public enable247(guild: string, voiceId: string, textId: string) {
    enable247(guild, voiceId, textId);
    return true;
  }

  public humanize(duration: number) {
    return prettyMilliseconds(duration, { colonNotation: true });
  }

  public removeServerNp(user: string, guild: string) {
    removeServerNp(user, guild);
    return true;
  }

  public attachment(attach: any) {
    return new AttachmentBuilder(attach)
      .setDescription(`Avon Is God`)
      .setName(`AvonNowPlaying.png`);
  }

  public checkIgnore(guild: string, channel: string) {
    let check = checkIgnore(channel, guild);
    if (check === true) return true;
    else return false;
  }

  public addIgnore(guild: string, channel: string) {
    addIgnore(channel, guild);
    return;
  }

  public removeIgnore(guild: string, channel: string) {
    removeIgnore(channel, guild);
    return;
  }

  public getIgnoreList(guild: string) {
    return listIgnores(guild);
  }
  public checkBypassAdmins(guild: string) {
    let check = checkBypassAdmins(guild);
    if (check.BYPASS_ADMINS === 1) return true;
    return false;
  }
  public checkBypassMods(guild: string) {
    let check = checkBypassMods(guild);
    if (check.BYPASS_MODS === 1) return true;
    return false;
  }
  public addBypassAdmins(guild: string) {
    addBypassAdmins(guild);
    return;
  }
  public removeBypassAdmins(guild: string) {
    removeAdminBypass(guild);
    return;
  }
  public addBypassMods(guild: string) {
    addBypassMods(guild);
    return;
  }
  public removeBypassMods(guild: string) {
    removeBypassMods(guild);
    return;
  }
  public resetIgnore(guild: string) {
    resetIgnore(guild);
    return;
  }
}
