import { PoolClient } from "pg";
import db from "../database";

export abstract class DbConnection {
  protected conn!: PoolClient;

  /**
   * @description open connection with database
   * @protected
   */
  protected async open(): Promise<PoolClient> {
    this.conn = await db.connect();
    return this.conn;
  }

  /**
   * @description close connection with database
   * @protected
   */
  protected close(): void {
    this.conn.release();
  }
}
