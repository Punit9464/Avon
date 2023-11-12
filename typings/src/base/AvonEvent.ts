import EventEmitter from "events";

export default class AvonEvent extends EventEmitter {
  public client: any;
  public name?: string;
  constructor(client: any) {
    super();
    this.client = client;
  }
}
