import AvonDatabase from "../../database/db.js";
const db = new AvonDatabase("prefix.sqlite");

function createDb(): void {
  let run = db.prepare(`CREATE TABLE IF NOT EXISTS PREFIXDB(
        GUILD TEXT PRIMARY KEY,
        PREFIX TEXT
    )`);
  run.run();
  return;
}

function getPrefix(guildId: string): {
  PREFIX?: string | null;
} {
  createDb();
  let run: unknown = db
    .prepare(`SELECT PREFIX FROM PREFIXDB WHERE GUILD = (?)`)
    .get(guildId);
  if (run) return run;
  else return { PREFIX: null };
}

function updatePrefix(guildId: string, prefix: string): boolean {
  createDb();
  let find = getPrefix(guildId);
  if (find.PREFIX !== null) {
    let query = `UPDATE PREFIXDB SET PREFIX = (?) WHERE GUILD = (?)`;
    db.prepare(query).run(prefix, guildId);
    return true;
  } else if (find.PREFIX === null) {
    let query = `INSERT INTO PREFIXDB(GUILD,PREFIX) VALUES(?,?)`;
    db.prepare(query).run(guildId, prefix);
    return true;
  } else return false;
}

function createNpDb(): void {
  let run = db.prepare(`CREATE TABLE IF NOT EXISTS NOPREFIX(
    USER TEXT,
    GLOBAL BOOLEAN,
    SERVER TEXT,
    REASON TEXT
  )`);
  run.run();
}

function getServerNpDb(server: string): string[] {
  createNpDb();
  let run = db
    .prepare(`SELECT USER FROM NOPREFIX WHERE SERVER = (?) AND GLOBAL = FALSE`)
    .all(server);
  let data: string[] = [];
  run.forEach((x: any) => data.push(x.USER));
  return data;
}

function getGlobalNp(): string[] {
  createNpDb();
  let run = db.prepare(`SELECT USER FROM NOPREFIX WHERE GLOBAL = TRUE`).all();
  let data: string[] = [];
  run.forEach((x: any) => data.push(x.USER));
  return data;
}

function globalNpSelection(user: string): boolean {
  createNpDb();
  let run = db
    .prepare(`SELECT USER FROM NOPREFIX WHERE GLOBAL = TRUE AND USER = ?`)
    .get(user);
  if (run) return true;
  else return false;
}

function serverNpSelection(user: string, server: string): boolean {
  createNpDb();
  let run = db
    .prepare(
      `SELECT USER FROM NOPREFIX WHERE GLOBAL = FALSE AND USER = ? AND SERVER = (?)`
    )
    .get(user, server);
  if (run) return true;
  else return false;
}

function AddGlobalNp(user: string, reason: string): boolean {
  createNpDb();
  let run = db
    .prepare(`INSERT INTO NOPREFIX(USER,GLOBAL,REASON) VALUES(?,TRUE,?)`)
    .run(user, reason);
  if (run) return true;
  else return false;
}

function RemoveGlobalNp(user: string): boolean {
  createNpDb();
  let run = db
    .prepare(`DELETE FROM NOPREFIX WHERE USER = (?) AND GLOBAL = TRUE`)
    .run(user);
  if (run) return true;
  else return false;
}

function addServerNp(user: string, guild: string, reason: string): boolean {
  createNpDb();
  let run = db
    .prepare(
      `INSERT INTO NOPREFIX(USER,GLOBAL,SERVER,REASON) VALUES(?,FALSE,?,?)`
    )
    .run(user, guild, reason);
  if (run) return true;
  else return false;
}

function removeServerNp(user: string, guild: string): boolean {
  createNpDb();
  let run = db
    .prepare(
      `DELETE FROM NOPREFIX WHERE USER = ? AND SERVER = ? AND GLOBAL = FALSE`
    )
    .run(user, guild);
  if (run) return true;
  else return false;
}

function resetNp() {
  db.prepare(`DROP TABLE NOPREFIX`).run();
  return;
}

export {
  getPrefix,
  updatePrefix,
  getGlobalNp,
  getServerNpDb,
  globalNpSelection,
  serverNpSelection,
  AddGlobalNp,
  RemoveGlobalNp,
  addServerNp,
  removeServerNp,
  resetNp
};
