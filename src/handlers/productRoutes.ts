import { Application, Request, Response } from "express";
import ProductStore from "../models/productStore";
import { Product } from "../interfaces/product";

const store = new ProductStore();
const index = async (_req: Request, res: Response) => {
  res.send(await store.index());
};
const create = async (req: Request, res: Response) => {
  const { name, price, category } = req.body;
  res.send(await store.create({ name, price, category }));
};
const show = async (req: Request, res: Response) => {
  res.send(await store.show(parseInt(req.params.id)));
};
const update = async (req: Request, res: Response) => {
  if (!(await store.exists(parseInt(req.params.id)))) {
    res.status(400);
    res.send("cannot update none exists Product");
  } else {
    const product: Partial<Product> = {
      id: parseInt(req.params.id),
      price: parseInt(req.body.price),
      category: req.body.category,
      name: req.body.name,
    };
    res.send(await store.update(product));
  }
};
const destroy = async (req: Request, res: Response) => {
  res.send(await store.delete(parseInt(req.params.id)));
};

export default function productRoutes(app: Application) {
  app.get("/products", index);
  app.post("/products", create);
  app.get("/products/:id", show);
  app.put("/products/:id", update);
  app.delete("/products/:id", destroy);
}
