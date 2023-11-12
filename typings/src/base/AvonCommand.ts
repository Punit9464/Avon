export default class AvonCommand {
  public client: any;
  public name?: string;
  public exec?: any;
  public aliases?: string[];
  public cat?: string;
  public vote?: boolean;
  public vc?: boolean;
  public samevc?: boolean;
  public dev?: boolean;
  public manage?: boolean;
  public desc?: string;
  public usage?: string;
  public premium?: object;
  public playing?: boolean;
  public dispatcher?: boolean;
  constructor(client: any) {
    this.client = client;
  }
}
