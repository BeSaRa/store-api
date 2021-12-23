import { Application, Request, Response } from "express";
import OrderStore from "../models/orderStore";
import { Order } from "../interfaces/order";
import { authToken } from "../middleware/auth-token";
import { OrderStatus } from "../enums/order-status";
import { AsyncErrorWrapper } from "../helpers/async-error-wrapper";

const store = new OrderStore();
const index = async (req: Request, res: Response) => {
  res.send(await store.index());
};
const create = async (req: Request, res: Response) => {
  const { user_id, status } = req.body as {
    user_id: number;
    status: OrderStatus;
  };
  res.send(await store.create({ user_id, status }));
};
const show = async (req: Request, res: Response) => {
  res.send(await store.show(parseInt(req.params.id)));
};
const update = async (req: Request, res: Response) => {
  if (!(await store.exists(parseInt(req.params.id)))) {
    res.status(400);
    res.send("cannot update none exists Order");
  } else {
    const { status, user_id } = req.body as {
      status: OrderStatus;
      user_id: number;
    };
    const order: Partial<Order> = {
      id: parseInt(req.params.id),
      status,
      user_id,
    };
    res.send(await store.update(order));
  }
};
const destroy = async (req: Request, res: Response) => {
  res.send(await store.delete(parseInt(req.params.id)));
};
const addProduct = async (req: Request, res: Response) => {
  if (await store.isComplete(parseInt(req.params.id))) {
    res.status(400).send("Cannot add product to completed order");
    return;
  }
  const { product_id, quantity } = req.body as {
    product_id: number;
    quantity: number;
  };
  res.send(
    await store.addProductToOrder({
      product_id: product_id,
      quantity: quantity,
      order_id: parseInt(req.params.id),
    })
  );
};
const orderProducts = async (req: Request, res: Response) => {
  res.send(await store.getOrderProducts(parseInt(req.params.id)));
};

export default function orderRoutes(app: Application) {
  app.get("/orders", authToken, AsyncErrorWrapper.catch(index));
  app.post("/orders", authToken, AsyncErrorWrapper.catch(create));
  app.get("/orders/:id", authToken, AsyncErrorWrapper.catch(show));
  app.put("/orders/:id", authToken, AsyncErrorWrapper.catch(update));
  app.delete("/orders/:id", authToken, AsyncErrorWrapper.catch(destroy));
  app.post(
    "/orders/:id/products",
    authToken,
    AsyncErrorWrapper.catch(addProduct)
  );
  app.get(
    "/orders/:id/products",
    authToken,
    AsyncErrorWrapper.catch(orderProducts)
  );
}
