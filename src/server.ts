import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import userRoutes from "./handlers/userRoutes";

const app: Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/", async function (req: Request, res: Response) {
  res.send("Hello World!");
});

userRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
