import { Request, Response } from "express";
import express from "express";
import { errorHandler } from "./middlewares/erroraHandler";

const app = express();

app.use(express.json());

app.use("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use(errorHandler);

export default app;
