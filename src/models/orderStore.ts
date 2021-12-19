import CRUDRepository from "../helpers/CRUDRepository";
import { Order } from "../interfaces/order";

export default class OrderStore extends CRUDRepository<Order, number> {
  protected table: string = "orders";
  protected insertable_fields: string[] = ["user_id", "status"];
  protected primaryKey: string = "id";
}
