import AvonDatabase from "../../database/db.js";

const db = new AvonDatabase("premium.sqlite");

function createPrem(): void {
  createPremServer();
  db.exec(
    `CREATE TABLE IF NOT EXISTS PREMIUM(
      USER TEXT,
      TIME NUMBER,
      COUNT NUMBER,
      TIER TEXT,
      CODE TEXT,
      REASON TEXT
      )`
  );
  return;
}

function createPremServer(): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS PREM_SERVER(
      SERVER TEXT,
      TIME NUMBER,
      USER TEXT,
      STATUS BOOLEAN,
      CODE TEXT
    )`
  );
  return;
}

function getServerPremTime(server: string): {
  TIME?: number | null;
} {
  createPrem();
  let d = db
    .prepare(`SELECT TIME FROM PREM_SERVER WHERE SERVER = ?`)
    .get(server);
  if (d) return d;
  else return { TIME: 0 };
}

function removeUserPrem(user: string) {
  createPrem();
  let run = db.prepare(`DELETE FROM PREMIUM WHERE USER = ?`).run(user);
  if (run) return true;
  else return false;
}

function getUserPremtier(user: string): {
  TIER?: string | null;
} {
  createPrem();
  let run = db.prepare(`SELECT TIER FROM PREMIUM WHERE USER = ?`).get(user);
  if (run) return run;
  else return { TIER: null };
}

function addPrem(
  user: string,
  time: number,
  count: number,
  code: string,
  reason: string,
  tier: string
): boolean {
  createPrem();
  let run = db
    .prepare(
      `INSERT INTO PREMIUM(USER,TIME,COUNT,CODE,REASON,TIER) VALUES(
    ?,?,?,?,?,?
  )`
    )
    .run(user, time, count, code, reason, tier);
  if (run) return true;
  else return false;
}

function updatePrem(
  user: string,
  time: number,
  count: number,
  code: string,
  reason: string,
  tier: string
): boolean {
  createPrem();
  let run = db
    .prepare(
      `UPDATE PREMIUM SET TIME = ?,COUNT = ?,CODE = ?,REASON = ?,TIER = ? WHERE USER = ?`
    )
    .run(time, count, code, reason, tier, user);
  if (run) return true;
  else return false;
}

function getUserCode(user: string): {
  CODE?: string | null;
} {
  createPrem();
  let sel = db.prepare(`SELECT CODE FROM PREMIUM WHERE USER = ?`).get(user);
  if (sel) return sel;
  else return { CODE: null };
}

function getPremTime(user: string): {
  TIME?: number;
} {
  createPrem();
  let run = db.prepare(`SELECT TIME FROM PREMIUM WHERE USER = ?`).get(user);
  if (run) return run;
  else return { TIME: 0 };
}

function getCount(user: string): {
  COUNT?: number | undefined | null;
} {
  createPrem();
  let run = db.prepare(`SELECT COUNT FROM PREMIUM WHERE USER = ?`).get(user);
  if (run) return run;
  else return { COUNT: null };
}

function decretCount(user: string): boolean {
  createPrem();
  let cnt = getCount(user).COUNT;
  cnt = cnt ? cnt - 1 : 0;
  let run = db
    .prepare(`UPDATE PREMIUM SET COUNT = ? WHERE USER = ?`)
    .run(cnt, user);
  if (run) return true;
  else return false;
}

function incrementCount(user: string): boolean {
  createPrem();
  let cnt = getCount(user).COUNT;
  cnt = cnt ? cnt + 1 : 0;
  let run = db
    .prepare(`UPDATE PREMIUM SET COUNT = ? WHERE USER = ?`)
    .run(cnt, user);
  if (run) return true;
  else return false;
}

function addServerPrem(
  user: string,
  time: number,
  server: string,
  code: string
): boolean {
  createPrem();
  let run = db
    .prepare(
      `INSERT INTO PREM_SERVER(SERVER,TIME,USER,STATUS,CODE) VALUES(?,?,?,TRUE,?)`
    )
    .run(server, time, user, code);
  if (run) return true;
  else return false;
}

function removeServerPrem(user: string, server: string): boolean {
  createPrem();
  let run = db
    .prepare(`DELETE FROM PREM_SERVER WHERE USER = ? AND SERVER = ?`)
    .run(user, server);
  if (run) return true;
  else return false;
}

function getServerPremiumStatus(server: string): {
  STATUS?: number | null | undefined;
} {
  createPrem();
  let r = db
    .prepare(`SELECT STATUS FROM PREM_SERVER WHERE SERVER = ?`)
    .get(server);
  if (r) return r;
  else return { STATUS: null };
}

function getUserPremStatus(user: string): {
  USER?: string | null;
} {
  createPrem();
  let select = db.prepare(`SELECT USER FROM PREMIUM WHERE USER = ?`).get(user);
  if (select) return select;
  else return { USER: null };
}

function getPremServerList(user: string) {
  createPrem();
  let data: string[] = [];
  let run = db
    .prepare(`SELECT SERVER FROM PREM_SERVER WHERE USER = ? AND STATUS = TRUE`)
    .all(user);
  run
    .filter((x: any) => x.SERVER !== null)
    .forEach((x: any) => data.push(x.SERVER));
  return data;
}

function getServerPrem(guild: string): {
  SERVER?: string | null;
} {
  createPrem();
  let run = db
    .prepare(`SELECT SERVER FROM PREM_SERVER WHERE SERVER = ?`)
    .get(guild);
  if (run) return run;
  else return { SERVER: null };
}

function getActivator(guild: string): {
  USER?: string | null;
} {
  createPrem();
  let run = db
    .prepare(`SELECT USER FROM PREM_SERVER WHERE SERVER = ?`)
    .get(guild);
  if (run) return run;
  else return { USER: null };
}

function deleteServerPrem(guild: string) {
  createPrem();
  let run = db.prepare(`DELETE FROM PREM_SERVER WHERE SERVER = ?`).run(guild);
  if (run) return true;
  else return false;
}

function createAfk() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS AFK(
    GUILD TEXT,
    USER TEXT,
    REASON TEXT,
    TIME NUMBER
  )`
  ).run();
}

function Addafk(
  guild: string,
  user: string,
  reason: string,
  time: number
): void {
  createAfk();
  db.prepare(`INSERT INTO AFK(GUILD,USER,REASON,TIME) VALUES(?,?,?,?)`).run(
    guild,
    user,
    reason,
    time
  );
  return;
}

function CheckAfk(
  user: string,
  guild: string
): {
  USER?: string | null;
  REASON?: string | null;
  TIME?: number | null;
} {
  createAfk();
  let run = db
    .prepare(`SELECT USER,REASON,TIME FROM AFK WHERE USER = ? AND GUILD = ?`)
    .get(user, guild);
  if (run) return run;
  else return { USER: null, REASON: null, TIME: null };
}

function RemoveAfk(user: string, guild: string): void {
  createAfk();
  db.prepare(`DELETE FROM AFK WHERE USER = ? AND GUILD = ?`).run(user, guild);
  return;
}

function createNewAfk() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS AFK_NEW(
    GUILD TEXT,
    USER TEXT,
    REASON TEXT,
    TIME NUMBER,
    GLOBAL BOOLEAN
  )`
  ).run();
}

function checkGlobalAfk(user: string) {
  createNewAfk();
  let get = db
    .prepare(`SELECT USER FROM AFK_NEW WHERE GLOBAL = TRUE AND USER = ?`)
    .get(user);
  if (get) return true;
  else return false;
}

function checkServerAfk(user: string, guild: string) {
  createNewAfk();
  let get = db
    .prepare(
      `SELECT USER FROM AFK_NEW WHERE GLOBAL = FALSE AND USER = ? AND GUILD = ?`
    )
    .get(user, guild);
  if (get) return true;
  else return false;
}

function addGlobalAfk(user: string, reason: string, time: number) {
  createNewAfk();
  db.prepare(
    `INSERT INTO AFK_NEW(USER,REASON,TIME,GLOBAL) VALUES(?,?,?,TRUE)`
  ).run(user, reason, time);
  return;
}

function removeGlobalAfk(user: string) {
  createNewAfk();
  db.prepare(`DELETE FROM AFK_NEW WHERE USER = ? AND GLOBAL = TRUE`).run(user);
  return;
}

function addServerAfk(
  user: string,
  reason: string,
  time: number,
  guild: string
) {
  createNewAfk();
  db.prepare(
    `INSERT INTO AFK_NEW(GUILD,USER,REASON,TIME,GLOBAL) VALUES(?,?,?,?,FALSE)`
  ).run(guild, user, reason, time);
  return;
}

function removeServerAfk(user: string, guild: string) {
  createNewAfk();
  db.prepare(
    `DELETE FROM AFK_NEW WHERE USER = ? AND GUILD = ? AND GLOBAL = FALSE`
  ).run(user, guild);
  return;
}

function getGlobalAfk(user: string): {
  USER?: string | null;
  REASON?: string | null;
  TIME?: number | null;
} {
  let run = db
    .prepare(
      `SELECT USER,REASON,TIME FROM AFK_NEW WHERE USER = ? AND GLOBAL = TRUE`
    )
    .get(user);
  if (run) return run;
  else return { USER: null, REASON: null, TIME: null };
}

function getServerAfk(
  user: string,
  guild: string
): {
  USER?: string | null;
  REASON?: string | null;
  TIME?: number | null;
} {
  let run = db
    .prepare(
      `SELECT USER,REASON,TIME FROM AFK_NEW WHERE GUILD = ? AND USER = ? AND GLOBAL = FALSE`
    )
    .get(guild, user);
  if (run) return run;
  else return { USER: null, REASON: null, TIME: null };
}

function createFavs() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS FAVS(
    USER TEXT,
    TITLE TEXT,
    TRACK TEXT,
    LINK TEXT
  )`
  ).run();
}

function listfavs(user: string) {
  createFavs();
  let tracks: any[] = [];
  let select = db.prepare(`SELECT TITLE FROM FAVS WHERE USER = ?`).all(user);
  select.forEach((x: any) => tracks.push(x.TITLE));
  return tracks;
}

function addFavs(user: string, track: any) {
  createFavs();
  db.prepare(`INSERT INTO FAVS(USER,TITLE,TRACK,LINK) VALUES(?,?,?,?)`).run(
    user,
    track.info.title,
    JSON.stringify(track),
    track.info.uri
  );

  return;
}

function removeFavs(user: string, track: string) {
  createFavs();
  db.prepare(`DELETE FROM FAVS WHERE USER = ? AND TRACK = ?`).run(
    user,
    JSON.stringify(track)
  );
  return;
}

function listFavsLinks(user: string) {
  createFavs();
  let data: string[] = [];
  let run = db.prepare(`SELECT LINK FROM FAVS WHERE USER = ?`).all(user);
  run.forEach((x: any) => data.push(x.LINK));
  return data;
}

export {
  getCount,
  decretCount,
  getServerPremTime,
  getServerPrem,
  updatePrem,
  addPrem,
  createPrem,
  deleteServerPrem,
  getActivator,
  getUserPremStatus,
  getServerPremiumStatus,
  removeServerPrem,
  addServerPrem,
  getPremTime,
  getUserCode,
  removeUserPrem,
  getPremServerList,
  getUserPremtier,
  incrementCount,
  addFavs,
  removeFavs,
  listFavsLinks,
  listfavs,
  addGlobalAfk,
  addServerAfk,
  removeGlobalAfk,
  removeServerAfk,
  checkGlobalAfk,
  checkServerAfk,
  getGlobalAfk,
  getServerAfk,
};
