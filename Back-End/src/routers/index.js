import express from "express";
import RouterCategory from "./category.js";
import routerAuth from "./auth.js";
import RouterContact from "./contact.js";
import RouterUser from "./user.js";
import RouterProduct from "./product.js";
import RouterBill from "./bill.js";
const Router = express.Router();

Router.use("/products", RouterProduct);
Router.use("/categories", RouterCategory);
Router.use("/contacts", RouterContact);
Router.use("/auth", routerAuth);
Router.use("/users", RouterUser);
Router.use("/bill", RouterBill);
export default Router;