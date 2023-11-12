import Database from "better-sqlite3";

export default class AvonDatabase extends Database {
  constructor(path: string) {
    super(`./build/src/database/${path}`, {
      fileMustExist: false,
      readonly: false,
    });
    this.pragma("jorunal_mode=WAL");
  }
}
