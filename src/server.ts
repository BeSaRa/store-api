import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import userRoutes from "./handlers/userRoutes";
import productRoutes from "./handlers/productRoutes";
import orderRoutes from "./handlers/orderRoutes";
import { ErrorHandler } from "./helpers/error-handler";

const app: Application = express();
const address: string = "http://localhost:3000";

app.use(bodyParser.json());

app.get("/", async function (req: Request, res: Response) {
  res.send("Hello World!");
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);
// general error handler
app.use(ErrorHandler);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
