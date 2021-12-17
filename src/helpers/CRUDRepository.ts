import { ICRUDRepository } from "../interfaces/ICRUDRepository";
import { PoolClient } from "pg";
import db from "../database";

export default abstract class CRUDRepository<T> implements ICRUDRepository<T> {
  protected conn!: PoolClient;
  abstract table: string;
  abstract insertable_fields: string[];
  abstract primaryKey: string;

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

  /**
   * @description get all records
   */
  async index(): Promise<T[]> {
    try {
      await this.open();
      const result = await this.conn.query<T>(`SELECT * FROM ${this.table}`);
      this.close();
      return result.rows;
    } catch (e) {
      throw Error(`unable to get data from ${this.table}`);
    }
  }

  async create(model: Partial<T>): Promise<T> {
    try {
      await this.open();
      const result = await this.conn.query<T>(
        `INSERT INTO ${this.table} (${this.insertable_fields.join(
          ","
        )}) VALUES (${this.insertable_fields
          .map((_f, index) => "$" + (index + 1))
          .join(",")}) RETURNING *`,
        this.insertable_fields.map((field) => model[field as keyof T])
      );
      this.close();
      return result.rows[0];
    } catch (e) {
      throw Error(`unable insert into ${this.table} -  ${e}`);
    }
  }

  /**
   * @description delete record by it primary key
   * @param id
   */
  async delete(id: number): Promise<T> {
    try {
      await this.open();
      const result = await this.conn.query<T>(
        `DELETE FROM ${this.table} WHERE ${this.primaryKey} = $1 RETURNING *`,
        [id]
      );
      this.close();
      return result.rows[0];
    } catch (e) {
      throw new Error(`unable to delete from ${this.table} - ${e}`);
    }
  }

  async show(id: number): Promise<T> {
    try {
      await this.open();
      const result = await this.conn.query(
        `SELECT * FROM ${this.table} WHERE ${this.primaryKey}=$1`,
        [id]
      );
      this.close();
      return result.rows[0];
    } catch (e) {
      throw new Error(`unable to update ${this.table} - ${e}`);
    }
  }

  async update(model: Partial<T>): Promise<T> {
    try {
      await this.open();
      const result = await this.conn.query<T>(
        `UPDATE ${this.table} SET ${Object.keys(model)
          .filter((field) => field !== this.primaryKey)
          .map((field) => field + "=" + `'${model[field as keyof T]}'`)
          .join(",")} WHERE ${this.primaryKey} =$1 RETURNING *`,
        [model[this.primaryKey as keyof T]]
      );
      this.close();
      return result.rows[0];
    } catch (e) {
      throw new Error(`unable to update ${this.table} - ${e}`);
    }
  }
}
