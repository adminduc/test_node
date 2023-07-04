let router = require("express").Router();
const ProductController = require("../controllers/product.controller");
const auth = require("../middleware/auth.middleware");
//public
router.get("/products", ProductController.get);

module.exports = router;
