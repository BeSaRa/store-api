import CRUDRepository from "../helpers/CRUDRepository";
import { Product } from "../interfaces/product";
import { TopProduct } from "../interfaces/top-product";

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

  async getTop5Products(count: number = 5): Promise<TopProduct[]> {
    try {
      await this.open();
      // get top 5 products based on product quantity on DESC
      const sql = ` 
          SELECT SUM(quantity)::integer as quantity ,o.product_id as id,p.name,p.category,price FROM order_products o
          INNER JOIN products p 
          ON o.product_id = p.id
          GROUP BY o.product_id, name,category,price
          ORDER BY quantity DESC
          LIMIT $1
        `;
      const result = await this.conn.query<TopProduct>(sql, [count]);
      this.close();
      return result.rows;
    } catch (e) {
      throw Error(`unable to get top most 5 products  ${e}`);
    }
  }
}
