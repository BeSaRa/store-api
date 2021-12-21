import { Application, Request, Response } from "express";
import UserStore from "../models/userStore";
import { User } from "../interfaces/user";
import OrderStore from "../models/orderStore";
import { OrderStatus } from "../enums/order-status";

const userStore = new UserStore();
const orderStore = new OrderStore();
const index = async (_req: Request, res: Response) => {
  res.send(await userStore.index());
};
const create = async (req: Request, res: Response) => {
  const { first_name, last_name, password, username } = req.body;
  res.send(
    await userStore.create({ first_name, last_name, password, username })
  );
};

const destroy = async (req: Request, res: Response) => {
  res.send(await userStore.delete(parseInt(req.params.id)));
};

const show = async (req: Request, res: Response) => {
  res.send(await userStore.show(parseInt(req.params.id)));
};

const update = async (req: Request, res: Response) => {
  if (!(await userStore.exists(parseInt(req.params.id)))) {
    res.status(400);
    res.send("cannot update none exists user");
  } else {
    const user: Partial<User> = {
      id: parseInt(req.params.id),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    res.send(await userStore.update(user));
  }
};

const userOrders = async (req: Request, res: Response) => {
  res.send(await orderStore.getUserOrders(parseInt(req.params.id)));
};

const getOrderProducts = async (req: Request, res: Response) => {
  res.send(
    await orderStore.getOrderProducts(
      parseInt(req.params.orderId),
      parseInt(req.params.id)
    )
  );
};

const activeUserOrders = async (req: Request, res: Response) => {
  res.send(
    await orderStore.getUserOrders(parseInt(req.params.id), OrderStatus.ACTIVE)
  );
};
const completeUserOrders = async (req: Request, res: Response) => {
  res.send(
    await orderStore.getUserOrders(
      parseInt(req.params.id),
      OrderStatus.COMPLETE
    )
  );
};

const authenticate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(401)
      .send("Please provide username and password to authenticate");
    return;
  }
  res.send(await userStore.authenticate(username, password));
};

export default function userRoutes(app: Application): void {
  app.get("/users", index);
  app.post("/users", create);
  app.post("/users/authenticate", authenticate);
  app.get("/users/:id", show);
  app.put("/users/:id", update);
  app.delete("/users/:id", destroy);
  app.get("/users/:id/orders/active", activeUserOrders);
  app.get("/users/:id/orders/complete", completeUserOrders);
  app.get("/users/:id/orders", userOrders);
  app.get("/users/:id/orders/:orderId/products", getOrderProducts);
}
