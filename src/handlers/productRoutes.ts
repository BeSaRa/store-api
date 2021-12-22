import { Application, Request, Response } from "express";
import ProductStore from "../models/productStore";
import { Product } from "../interfaces/product";
import { authToken } from "../middleware/auth-token";
import { AsyncErrorWrapper } from "../helpers/async-error-wrapper";

const store = new ProductStore();
const index = async (_req: Request, res: Response) => {
  res.send(await store.index());
};
const create = async (req: Request, res: Response) => {
  const { name, price, category } = req.body as Product;
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
    const { price, category, name } = req.body as Product;
    const product: Partial<Product> = {
      id: parseInt(req.params.id),
      price,
      category,
      name,
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
  app.get("/products", AsyncErrorWrapper.catch(index));
  app.post("/products", authToken, AsyncErrorWrapper.catch(create));
  app.get(
    "/products/category/:cat",
    AsyncErrorWrapper.catch(productsByCategory)
  );
  app.get("/products/top/:number", AsyncErrorWrapper.catch(getTop5Products));
  app.get("/products/:id", AsyncErrorWrapper.catch(show));
  app.put("/products/:id", authToken, AsyncErrorWrapper.catch(update));
  app.delete("/products/:id", authToken, AsyncErrorWrapper.catch(destroy));
}
