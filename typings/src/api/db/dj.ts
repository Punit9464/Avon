import AvonDatabase from "../../database/db.js";

const db = new AvonDatabase("dj.sqlite");

function createDb(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS DJ(
        GUILD TEXT,
        CHANNEL TEXT,
        MESSAGE TEXT,
        ROLE TEXT,
        MODE TEXT,
        TYPE TEXT
    )`
  ).run();
}

function getDj(guild: string): boolean {
  createDb();
  let run = db.prepare(`SELECT GUILD FROM DJ WHERE GUILD = ?`).get(guild);
  if (run) return true;
  else return false;
}

function addDjRole(guild: string, role: string): void {
  createDb();
  let get = getDj(guild);
  if (get === true) {
    db.prepare(`UPDATE DJ SET ROLE = ? WHERE GUILD = ?`).run(role, guild);
    return;
  } else {
    db.prepare(`INSERT INTO DJ(GUILD,ROLE) VALUES(?,?)`).run(guild, role);
    return;
  }
}

function getDjRole(guild: string): {
  ROLE?: string | null;
} {
  createDb();
  let run = db.prepare(`SELECT ROLE FROM DJ WHERE GUILD = ?`).get(guild);
  if (run) return run;
  else return { ROLE: null };
}

function removeDjRole(guild: string): boolean {
  createDb();
  let get = getDj(guild);
  if (get === true) {
    db.prepare(`UPDATE DJ SET ROLE = NULL WHERE GUILD = ?`).run(guild);
    return true;
  } else {
    return false;
  }
}

function getPlayerMode(guild: string): {
  MODE?: string | null;
} {
  createDb();
  let run = db.prepare(`SELECT MODE FROM DJ WHERE GUILD = ?`).get(guild);
  if (run) return run;
  else return { MODE: null };
}

function updatePlayerMode(guild: string, mode: string): boolean {
  createDb();
  let get = getDj(guild);
  if (get === true) {
    db.prepare(`UPDATE DJ SET MODE = ? WHERE GUILD = ?`).run(mode, guild);
    return true;
  } else if (get === false) {
    db.prepare(`INSERT INTO DJ(GUILD,MODE) VALUES(?,?)`).run(guild, mode);
    return true;
  } else return false;
}

function checkDj(guild: string): boolean {
  createDb();
  let run = getDjSetup(guild);
  if (run.CHANNEL !== null && run.MESSAGE !== null) return true;
  else return false;
}

function getDjChannel(guild: string): {
  CHANNEL?: null | string;
} {
  createDb();
  let run = db.prepare(`SELECT CHANNEL FROM DJ WHERE GUILD = ?`).get(guild);
  if (run) return run;
  else return { CHANNEL: null };
}

function createDjChannel(
  guild: string,
  channel: string,
  message: string
): boolean {
  createDb();
  let get = getDj(guild);
  if (get === true) {
    db.prepare(`UPDATE DJ SET CHANNEL = ?, MESSAGE = ? WHERE GUILD = ?`).run(
      channel,
      message,
      guild
    );
    return true;
  } else if (get === false) {
    db.prepare(`INSERT INTO DJ(GUILD,CHANNEL,MESSAGE) VALUES(?,?,?)`).run(
      guild,
      channel,
      message
    );
    return true;
  } else return false;
}

function deleteDjChannel(guild: string): boolean {
  createDb();
  let get = getDj(guild);
  if (get === true) {
    db.prepare(
      `UPDATE DJ SET CHANNEL = NULL, MESSAGE = NULL WHERE GUILD = ?`
    ).run(guild);
    return true;
  } else return false;
}

function getDjSetup(guildId: string): {
  MESSAGE?: string | null;
  CHANNEL?: string | null;
} {
  createDb();
  let run = db
    .prepare(`SELECT MESSAGE,CHANNEL FROM DJ WHERE GUILD = ?`)
    .get(guildId);
  if (run) return run;
  else return { MESSAGE: null, CHANNEL: null };
}

function playType(guild: string): {
  TYPE?: string | null;
} {
  createDb();
  let run = db.prepare(`SELECT TYPE FROM DJ WHERE GUILD = ?`).get(guild);
  if (run) return run;
  else return { TYPE: null };
}

function updatePlayType(guild: string, type: string): void {
  createDb();
  let get = getDj(guild);
  if (get === true) {
    db.prepare(`UPDATE DJ SET TYPE = ? WHERE GUILD = ?`).run(type, guild);
    return;
  } else {
    db.prepare(`INSERT INTO DJ(GUILD,TYPE) VALUES(?,?)`).run(guild, type);
    return;
  }
}

export {
  getPlayerMode,
  updatePlayerMode,
  checkDj,
  getDjChannel,
  createDjChannel,
  deleteDjChannel,
  getDjSetup,
  getDjRole,
  addDjRole,
  removeDjRole,
  playType,
  updatePlayType,
};
