import express from "express";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { testConnection } from "./config/db.js";
import cors from "cors";
import bookRouter from "./routes/bookRoute.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(bookRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
  testConnection();
});
