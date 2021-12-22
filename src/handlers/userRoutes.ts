import { Application, Request, Response } from "express";
import UserStore from "../models/userStore";
import { User } from "../interfaces/user";
import OrderStore from "../models/orderStore";
import { OrderStatus } from "../enums/order-status";
import { authToken } from "../middleware/auth-token";

const userStore = new UserStore();
const orderStore = new OrderStore();
const index = async (_req: Request, res: Response) => {
  res.send(await userStore.index());
};
const create = async (req: Request, res: Response) => {
  const { first_name, last_name, password, username } = req.body as User;
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
    const { first_name, last_name } = req.body as User;
    const user: Partial<User> = {
      id: parseInt(req.params.id),
      first_name,
      last_name,
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
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  if (!username || !password) {
    res
      .status(401)
      .send("Please provide username and password to authenticate");
    return;
  }
  res.send(await userStore.authenticate(username, password));
};

const createDefaultApplicationUser = async (req: Request, res: Response) => {
  // we will create user in case if there is no user with id =1
  // case we know if there is user with id 1 means this route already consumed before
  const defaultUser: Partial<User> = {
    username: "username",
    password: "password",
    first_name: "admin",
    last_name: "user",
  };
  let user: User;
  // to check the user with id 1 exists
  if (await userStore.exists(1)) {
    // return it
    user = await userStore.show(1);
  } else {
    // create one
    user = await userStore.create(defaultUser);
  }

  res.send({
    ...user,
    // always show the plain password for this user to make the reviewer be able to consume the APIs
    password: defaultUser.password,
  });
};

export default function userRoutes(app: Application): void {
  // this route will be available only for development, and we should remove it before build the project
  app.get("/users/create-default-user", createDefaultApplicationUser);
  app.post("/users/authenticate", authenticate);
  app.get("/users", authToken, index);
  app.post("/users", authToken, create);
  app.get("/users/:id", authToken, show);
  app.put("/users/:id", authToken, update);
  app.delete("/users/:id", authToken, destroy);
  app.get("/users/:id/orders/active", authToken, activeUserOrders);
  app.get("/users/:id/orders/complete", authToken, completeUserOrders);
  app.get("/users/:id/orders", authToken, userOrders);
  app.get("/users/:id/orders/:orderId/products", authToken, getOrderProducts);
}
