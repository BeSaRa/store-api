import { OrderStatus } from "../enums/order-status";

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
}
