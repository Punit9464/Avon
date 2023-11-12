import AvonDatabase from "../../database/db.js";

const db = new AvonDatabase("management.sqlite");

export {
  manageMent,
  addManagement,
  removeManagement,
  getManagement,
  listRihan,
  addRihan,
  removeRihan,
  checkRihan,
};

function createDb(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS MANAGEMENT(
        USER TEXT PRIMARY KEY,
        MANAGER BOOLEAN
    )`
  ).run();
}

function manageMent(user: string): {
  MANAGE?: string | null | number;
} {
  createDb();
  let run: unknown = db
    .prepare(`SELECT MANAGER FROM MANAGEMENT WHERE USER = (?)`)
    .get(user);
  if (run) return run;
  else return { MANAGE: null };
}

function addManagement(user: string): boolean {
  createDb();
  let run = db
    .prepare(`INSERT INTO MANAGEMENT(USER,MANAGER) VALUES(?,TRUE)`)
    .run(user);
  if (run) return true;
  else return false;
}

function removeManagement(user: string): boolean {
  createDb();
  let run = db
    .prepare(`DELETE FROM MANAGEMENT WHERE USER = (?) AND MANAGER = TRUE`)
    .run(user);
  if (run) return true;
  else return false;
}

function getManagement(): string[] {
  createDb();
  let run = db
    .prepare(`SELECT USER FROM MANAGEMENT WHERE MANAGER = TRUE`)
    .all();
  let data: string[] = [];
  run.forEach((x: any) => data.push(x.USER));
  return data;
}

function createRihanDb(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS RIHAN(
    USER TEXT
  )`
  ).run();
}

function checkRihan(user: string): boolean {
  createRihanDb();
  let run = db.prepare(`SELECT USER FROM RIHAN WHERE USER = ?`).get(user);
  if (run) return true;
  else return false;
}

function addRihan(user: string): boolean {
  createRihanDb();
  db.prepare(`INSERT INTO RIHAN(USER) VALUES(?)`).run(user);
  return true;
}

function removeRihan(user: string): boolean {
  createRihanDb();
  db.prepare(`DELETE FROM RIHAN WHERE USER = ?`).run(user);
  return true;
}

function listRihan() {
  createRihanDb();
  let data: string[] = [];
  let run = db.prepare(`SELECT USER FROM RIHAN`).all();
  run.forEach((x: any) => data.push(x.USER));
  return data;
}
