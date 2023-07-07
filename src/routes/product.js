import express from "express";
import {
  create,
  get,
  getAll,
  remove,
  update,
  search,
  updateFollowCategoryId,
  getAllStatus,
} from "../controllers/product";
import checkPermission from "../middlewares/checkPermission";

const router = express.Router();

router.get("/", checkPermission, getAll);
router.get("/status", getAllStatus);
router.get("/:id", get);
router.get("/search/:key", search);
router.post("", checkPermission, create);
router.post("/updateFollowCateId", checkPermission, updateFollowCategoryId);
router.patch("/:id", checkPermission, update);
router.delete("/:id", checkPermission, remove);

export default router;
