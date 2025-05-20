import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(databaseUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
