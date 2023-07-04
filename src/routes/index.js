const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const productRoute = require("./product.routes");
const exampleRoute = require("./example.routes");

const router = express.Router();

router.use("/", userRoute);
router.use("/", authRoute);
router.use("/example/", exampleRoute);
router.use("/api", productRoute);

module.exports = router;
