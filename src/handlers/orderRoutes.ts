import { Application, Request, Response } from "express";
import OrderStore from "../models/orderStore";
import { Order } from "../interfaces/order";

const store = new OrderStore();
const index = async (req: Request, res: Response) => {
  res.send(await store.index());
};
const create = async (req: Request, res: Response) => {
  const { user_id, status } = req.body;
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
    const order: Partial<Order> = {
      id: parseInt(req.params.id),
      status: req.body.status,
      user_id: req.body.user_id,
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

  res.send(
    await store.addProductToOrder({
      product_id: req.body.product_id,
      quantity: req.body.quantity,
      order_id: parseInt(req.params.id),
    })
  );
};

const orderProducts = async (req: Request, res: Response) => {
  res.send(await store.getOrderProducts(parseInt(req.params.id)));
};

export default function orderRoutes(app: Application) {
  app.get("/orders", index);
  app.post("/orders", create);
  app.get("/orders/:id", show);
  app.put("/orders/:id", update);
  app.delete("/orders/:id", destroy);
  app.post("/orders/:id/products", addProduct);
  app.get("/orders/:id/products", orderProducts);
}
