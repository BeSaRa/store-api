import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import userRoutes from "./handlers/userRoutes";
import productRoutes from "./handlers/productRoutes";
import orderRoutes from "./handlers/orderRoutes";

const app: Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/", async function (req: Request, res: Response) {
  res.send("Hello World!");
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
