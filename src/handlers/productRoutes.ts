import { Application, Request, Response } from "express";
import ProductStore from "../models/productStore";
import { Product } from "../interfaces/product";
import { authToken } from "../middleware/auth-token";

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

const productsByCategory = async (req: Request, res: Response) => {
  res.send(await store.getByCategory(req.params.cat));
};

const getTop5Products = async (req: Request, res: Response) => {
  const number = parseInt(req.params.number);

  res.send(
    await store.getTop5Products(
      isNaN(number) ? undefined : parseInt(number.toString())
    )
  );
};

export default function productRoutes(app: Application) {
  app.get("/products", index);
  app.post("/products", authToken, create);
  app.get("/products/category/:cat", productsByCategory);
  app.get("/products/top/:number", getTop5Products);
  app.get("/products/:id", show);
  app.put("/products/:id", authToken, update);
  app.delete("/products/:id", authToken, destroy);
}
