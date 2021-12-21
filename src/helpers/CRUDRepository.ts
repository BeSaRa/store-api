import { ICRUDRepository } from "../interfaces/ICRUDRepository";
import { DbConnection } from "./db-connection";

export default abstract class CRUDRepository<T, PrimaryKeyType>
  extends DbConnection
  implements ICRUDRepository<T, PrimaryKeyType>
{
  protected abstract table: string;
  protected abstract insertable_fields: string[];
  protected abstract primaryKey: string;

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
  async delete(id: PrimaryKeyType): Promise<T> {
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

  async show(id: PrimaryKeyType): Promise<T> {
    try {
      await this.open();
      const result = await this.conn.query(
        `SELECT * FROM ${this.table} WHERE ${this.primaryKey}=$1`,
        [id]
      );
      this.close();
      return result.rows[0];
    } catch (e) {
      throw new Error(`unable to get record ${this.table} - ${e}`);
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

  async exists(id: PrimaryKeyType): Promise<boolean> {
    try {
      await this.open();
      const result = await this.conn.query(
        `SELECT COUNT(*)::integer FROM ${this.table} WHERE ${this.primaryKey}=$1`,
        [id]
      );
      this.close();
      return !!result.rows[0].count;
    } catch (e) {
      throw new Error(`unable to find record in ${this.table} - ${e}`);
    }
  }
}
