import { PoolClient } from "pg";
import db from "../database";

let releaseState = false;

export abstract class DbConnection {
  protected conn!: PoolClient;

  /**
   * @description open connection with database
   * @protected
   */
  protected async open(): Promise<PoolClient> {
    this.conn = await db.connect();
    releaseState = false;
    return this.conn;
  }

  /**
   * @description close connection with database
   * @protected
   */
  protected close(): void {
    if (!releaseState) this.conn.release();
    releaseState = true;
  }
}
