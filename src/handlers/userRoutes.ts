import { Application, Request, Response } from "express";
import UserStore from "../models/userStore";
import { User } from "../interfaces/user";

const userStore = new UserStore();

const index = async (_req: Request, res: Response) => {
  res.send(await userStore.index());
};
const create = async (req: Request, res: Response) => {
  const { first_name, last_name, password } = req.body;
  res.send(await userStore.create({ first_name, last_name, password }));
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

export default function userRoutes(app: Application): void {
  app.get("/users", index);
  app.post("/users", create);
  app.get("/users/:id", show);
  app.put("/users/:id", update);
  app.delete("/users/:id", destroy);
}
