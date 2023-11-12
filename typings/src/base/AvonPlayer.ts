import { createCanvas, loadImage } from "@napi-rs/canvas";

export default class AvonPlayer {
  client: any;
  constructor(client: any) {
    this.client = client;
  }
  async build(track: any, player: any) {
    try {
      const canvas = createCanvas(600, 150);
      const ctx = canvas.getContext("2d");
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f9f9f9";
      ctx.font = "bold 20px MANROPE_REGULAR,NOTO_COLOR_EMOJI";
      ctx.fillText(track.info.title.substring(0, 30), 170, 40);

      ctx.fillStyle = "#f9f9f9";
      ctx.font = "16px MANROPE_REGULAR,NOTO_COLOR_EMOJI";
      ctx.fillText(`Requester: ${track.info.requester.tag}`, 170, 70);

      ctx.fillStyle = "#F1F1F1";
      ctx.font = "16px MANROPE_REGULAR,NOTO_COLOR_EMOJI";
      ctx.fillText(`Author: ${track.info.author}`, 170, 90);

      ctx.fillStyle = "#B3B3B3";
      ctx.font = "16px MANROPE_BOLD,NOTO_COLOR_EMOJI";
      ctx.fillText(`${this.client.utils.humanize(player.position).split(".")[0]}`, 170, 140);

      ctx.fillStyle = "#B3B3B3";
      ctx.font = "16px MANROPE_BOLD,NOTO_COLOR_EMOJI";
      ctx.fillText(`${this.client.utils.humanize(track.info.length)}`, 440, 140);

      ctx.rect(170, 170, 300, 20);
      ctx.fillStyle = "#E8E8E8";
      ctx.fillRect(170, 110, 300, 7);


      ctx.fillStyle = "#ff3139";
      ctx.fillRect(170, 110, this._calcule_progress(player.position, track.info.length), 7);


      let image = await loadImage(`https://img.youtube.com/vi/${track.info.identifier}/sddefault.jpg`)
      ctx.drawImage(image, 30, 15, 120, 120);

      let av = await loadImage(this.client.user.displayAvatarURL());
      ctx.drawImage(av, 530, 10, 50, 50)

      return canvas.toBuffer("image/png");
    } catch (e) { console.log(e) }
  }
  private _calcule_progress(current: number, total: number) {
    const progress = (current / total) * 300;
    if (isNaN(progress) || current < 0) {
      return 0;
    } else if (progress > 300) {
      return 300;
    } else {
      return progress;
    }
  }
}
