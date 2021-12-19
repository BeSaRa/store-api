import CRUDRepository from "../helpers/CRUDRepository";
import { Product } from "../interfaces/product";

export default class ProductStore extends CRUDRepository<Product, number> {
  protected table: string = "products";
  protected insertable_fields: string[] = ["name", "price", "category"];
  protected primaryKey: string = "id";
}
