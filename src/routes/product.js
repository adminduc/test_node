import express from "express";
import { add, get, remove, restore, update } from "../controllers/product";
import { checkPermission } from "../middlewares/checkAuth";

const router = express.Router();

router.route("/products").get((req, res) => {
  return res.status(200).json({
    message: "List Products",
  });
});
router.route("/products/:id").get(get).post(add);
router
  .route("/products/:id", checkPermission)
  .patch(restore)
  .put(update)
  .delete(remove);

export default router;
