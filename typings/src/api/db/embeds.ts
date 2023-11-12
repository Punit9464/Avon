import AvonDatabase from "../../database/db.js";

const db = new AvonDatabase("embeds.sqlite");

function create(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS EMBEDS(
        GUILD TEXT,
        HEXCODE TEXT
    )`
  ).run();
}

function addHex(guild: string, hex: string): void {
  create();
  let get = getHex(guild);
  if (get.HEXCODE === null) {
    db.prepare(`INSERT INTO EMBEDS(GUILD,HEXCODE) VALUES(?,?)`).run(guild, hex);
    return;
  } else {
    db.prepare(`UPDATE EMBEDS SET HEXCODE = ? WHERE GUILD = ?`).run(hex, guild);
    return;
  }
}

function removeHex(guild: string): void {
  create();
  db.prepare(`DELETE FROM EMBEDS WHERE GUILD = ?`).run(guild);
  return;
}

function getHex(guild: string): {
  HEXCODE?: null | string;
} {
  create();
  let run = db.prepare(`SELECT HEXCODE FROM EMBEDS WHERE GUILD = ?`).get(guild);
  if (run) return run;
  else return { HEXCODE: null };
}

export { getHex, addHex, removeHex };
