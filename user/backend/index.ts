import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

import express, { Express } from "express";

const baseUrl = process.env.BASE_URL;

import {
  productRouter,
  authRouter,
  partnerRouter,
  postRouter,
  adminRouter,
  orderRouter,
} from "./routes";

dotenv.config();

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

/* Create required directories if they do not exist (on application start) */
const directories = [
  path.join(__dirname, "public"),
  path.join(__dirname, "public", "uploads"),
  path.join(__dirname, "public", "uploads", "partner"),
  path.join(__dirname, "public", "uploads", "partner", "pending"),
  path.join(__dirname, "public", "uploads", "post"),
  path.join(__dirname, "public", "uploads", "product"),
  path.join(__dirname, "public", "uploads", "test"),
];

for (let dir of directories) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

/* Serve static files (styles, images, etc.) */
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

/* Public Routes */
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/post", postRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

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
  console.log(`[server]: Server is running at ${baseUrl}:${port}`);
});
