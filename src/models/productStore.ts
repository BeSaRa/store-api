import CRUDRepository from "../helpers/CRUDRepository";
import { Product } from "../interfaces/product";

export default class ProductStore extends CRUDRepository<Product, number> {
  protected table: string = "products";
  protected insertable_fields: string[] = ["name", "price", "category"];
  protected primaryKey: string = "id";

  async getByCategory(category: string): Promise<Product[]> {
    try {
      await this.open();
      const result = await this.conn.query<Product>(
        `SELECT * FROM products WHERE category=$1`,
        [category]
      );
      this.close();
      return result.rows;
    } catch (e) {
      throw Error(`unable to get products for category ${category} ${e}`);
    }
  }
}
