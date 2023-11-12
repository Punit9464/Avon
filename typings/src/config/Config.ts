export default class AvonConfig extends Object {
  token: string;
  prefix: string;
  nodes: object[];
  spotiId: string;
  owners: string[];
  spotiSecret: string;
  spotiNodes: object[];
  webhooks: object;
  supportId: string;
  color: string;
  server: string;
  voteUrl: string;
  voteApi: string;
  setupBgLink: string;
  constructor() {
    super();
    this.token =
      "OTA0MzE3MTQxODY2NjQ3NTky.GjahBV.K_skRDVUcSoZxSsB6AzeHUITYTm6Kt7r31muFM";
    this.prefix = "+";
    this.nodes = [
      {
        name: `Avon`,
        url: `149.56.20.224:19211`,
        auth: `avonbot`,
        secure: false,
      },
    ];
    this.voteApi =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkwNDMxNzE0MTg2NjY0NzU5MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjczNTI3OTYzfQ.WwA0KXh_nAQcBmR7BPqgLGyElYZheTQmguQfA2F6aNc";
    this.webhooks = {
      guildCreate:
        "https://discord.com/api/webhooks/1155007055128711261/7phZG-Aw8LwJrwrgDu_Pj8RhfAkSj76W6zyW8j0jwYXSfROQ6hoHa3K3KfX0VsKY9x_j",
      guildDelete:
        "https://discord.com/api/webhooks/1155007540652937316/SDQrem4OVZkCD1_SokqDIo9o6zgvm4XND1LyLSjoEerWT7yFtguCv358aNp-ovtmDeZo",
      Cmds: "https://discord.com/api/webhooks/1155008062613094411/fR4a3iysxBs-M_IGzMcfZbF-K7E-6QviEOePdlmwPrhOWjl56m3DmYHp1n9vrwwUx8rv",
    };
    this.server = "https://discord.gg/antRAwCQy5";
    this.spotiId = "ada2f0339dd340df9aa14c76f33f84f3";
    this.spotiSecret = "9fd6d604c0f343b4a998839f43ef88c7";
    this.owners = ["765841266181144596", "785708354445508649"];
    this.color = "#ff0000";
    this.supportId = "1010134124490666025";
    this.spotiNodes = [
      {
        id: `Avon`,
        host: `149.56.20.224`,
        port: 19211,
        password: `avonbot`,
        secure: false,
      },
    ];
    this.voteUrl = "https://top.gg/bot/904317141866647592/vote";
    this.setupBgLink =
      "https://media.discordapp.net/attachments/1136701451184394250/1165297670353600572/Picsart_23-07-11_20-30-52-826.png?ex=65465706&is=6533e206&hm=392acb7b13f8059e4befc5d902c9e237f43ede20027b11b3813a9ce955eeb9bc&=";
  }
}
