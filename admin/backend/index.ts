import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

/* Serve React app */
app.use(express.static(path.join(__dirname, "views")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

/* Error handling */
app.use((_, res) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});
