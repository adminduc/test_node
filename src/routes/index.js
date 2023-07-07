import express from "express";
import productRouter from "./product";
import categoryRouter from "./category";
import authRouter from "./auth";
import upImages from "./upImages";

const Router = express.Router();

Router.use("/products", productRouter);
Router.use("/categories", categoryRouter);
Router.use("/", authRouter);
Router.use("/", upImages);
export default Router;
