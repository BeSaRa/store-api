import CRUDRepository from "../helpers/CRUDRepository";
import { Order } from "../interfaces/order";
import { OrderStatus } from "../enums/order-status";
import { OrderProduct } from "../interfaces/order-product";
import { OrderProductView } from "../interfaces/order-product-view";

export default class OrderStore extends CRUDRepository<Order, number> {
  protected table: string = "orders";
  protected insertable_fields: string[] = ["user_id", "status"];
  protected primaryKey: string = "id";

  async isActive(orderId: number): Promise<boolean> {
    try {
      const order = await this.show(orderId);
      return order && order.status === OrderStatus.ACTIVE;
    } catch (e) {
      throw Error(`unable to get order by id ${orderId} : ${e}`);
    }
  }

  async isComplete(orderId: number): Promise<boolean> {
    return !(await this.isActive(orderId));
  }

  async addProductToOrder(
    orderItem: Partial<OrderProduct>
  ): Promise<OrderProduct> {
    try {
      await this.open();
      const result = await this.conn.query<OrderProduct>(
        "INSERT INTO order_products (order_id, quantity, product_id) VALUES ($1,$2,$3) RETURNING *",
        [orderItem.order_id, orderItem.quantity, orderItem.product_id]
      );
      this.close();
      return result.rows[0];
    } catch (e) {
      console.log("HERE");
      throw Error(`Cannot add Product to Order ${e}`);
    }
  }

  async getOrderProducts(
    orderId: number,
    userId?: number
  ): Promise<OrderProductView[]> {
    try {
      await this.open();
      const params = userId ? [orderId, userId] : [orderId];
      const result = await this.conn.query<OrderProductView>(
        `SELECT 
        o.id , p.id product_id , name , category , price , quantity , order_id
        FROM order_products o INNER JOIN products p ON p.id = o.product_id
        INNER JOIN orders ON o.order_id = orders.id WHERE o.order_id=$1 ${
          userId ? "AND orders.user_id=$2" : ""
        }`,
        params
      );
      this.close();
      return result.rows;
    } catch (e) {
      throw Error(`cannot fetch order items ${e}`);
    }
  }

  async getUserOrders(userId: number, status?: OrderStatus): Promise<Order[]> {
    try {
      await this.open();
      const params = status ? [userId, status] : [userId];
      const result = await this.conn.query(
        `SELECT * FROM orders WHERE user_id=$1  ${
          status ? "AND status=$2" : ""
        }`,
        params
      );
      this.close();
      return result.rows;
    } catch (e) {
      throw Error(`unable to get orders of user ${userId} - ${e}`);
    }
  }
}
