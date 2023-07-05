import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose, { Schema } from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import multer from "multer";
import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
const userSchema = new mongoose.Schema(
  {
    name: {
      type: Schema.Types.String,
      minLength: 6,
      maxLength: 255
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member"
    }
  },
  { timestamps: true, versionKey: false }
);
const User = mongoose.model("User", userSchema);
const signupSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required().messages({
    "string.base": `"email" phải là kiểu "text"`,
    "string.empty": `"email" không được bỏ trống`,
    "string.email": `"email" phải có định dạng là email`,
    "any.required": `"email" là trường bắt buộc`
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": `"password" phải là kiểu "text"`,
    "string.empty": `"password" không được bỏ trống`,
    "string.min": `"password" phải chứa ít nhất {#limit} ký tự`,
    "any.required": `"password" là trường bắt buộc`
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.base": `"confirmPassword" phải là kiểu "text"`,
    "string.empty": `"confirmPassword" không được bỏ trống`,
    "any.only": `"confirmPassword" phải giống "password"`,
    "any.required": `"confirmPassword" là trường bắt buộc`
  })
});
const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" phải là kiểu "text"`,
    "string.empty": `"email" không được bỏ trống`,
    "string.email": `"email" phải có định dạng là email`,
    "any.required": `"email" là trường bắt buộc`
  }),
  password: Joi.string().required().messages({
    "string.base": `"password" phải là kiểu "text"`,
    "string.empty": `"password" không được bỏ trống`,
    "string.min": `"password" phải chứa ít nhất {#limit} ký tự`,
    "any.required": `"password" là trường bắt buộc`
  })
});
dotenv.config();
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const { error } = await signupSchema.validate(
      {
        name,
        email,
        password,
        confirmPassword
      },
      { abortEarly: false }
    );
    if (error) {
      const errors = error.details.map((error2) => error2.message);
      return res.status(400).json({
        message: errors
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email đã tồn tại"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = signInSchema.validate({ email, password }, { abortEarly: false });
    if (error) {
      const errors = error.details.map((error2) => error2.message);
      return res.status(400).json({
        message: errors
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }
    const token = jwt.sign({ _id: user._id }, "123456");
    const { password: excludedPassword, ...userData } = user;
    res.status(200).json({
      data: userData,
      accessToken: token
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const router$2 = express.Router();
router$2.post("/signup", signup);
router$2.post("/signin", signin);
const plugins$1 = [mongoosePaginate, mongooseDelete];
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // trường này để xác định nếu là false thì không thể xóa - dành cho uncategory
  isDeleteable: {
    type: Boolean,
    default: true
  },
  products: [
    { type: mongoose.Types.ObjectId, ref: "Product" }
  ]
}, { timestamps: true, versionKey: false });
categorySchema.pre("findOneAndDelete", async function(next) {
  var _a;
  try {
    const Product2 = mongoose.model("Product");
    const filter = this.getFilter();
    const categoryId = (_a = this.getQuery().$set) == null ? void 0 : _a.categoryId;
    const update2 = {
      categoryId: categoryId ?? "uncategorized"
    };
    await Product2.updateMany(
      { categoryId: filter._id },
      // Tìm các sản phẩm cùng categoryId
      update2
      // Cập nhật categoryId mới
    );
    next();
  } catch (err) {
    next(err);
  }
});
plugins$1.forEach((plugin) => {
  categorySchema.plugin(plugin);
});
const Category = mongoose.model("Category", categorySchema);
const plugins = [mongoosePaginate, mongooseDelete];
const productSchema$1 = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true, versionKey: false });
plugins.forEach((plugin) => {
  productSchema$1.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true
  });
});
const Product = mongoose.model("Product", productSchema$1);
const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required().min(0),
  description: Joi.string(),
  categoryId: Joi.string().required(),
  createdAt: Joi.date().default(() => /* @__PURE__ */ new Date()),
  updatedAt: Joi.date().default(() => /* @__PURE__ */ new Date()),
  deletedAt: Joi.date().default(null),
  deleted: Joi.boolean().default(false)
});
const getAll = async (req, res) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createdAt",
    _order = "asc",
    _expand
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
    sort: { [_sort]: _order === "desc" ? -1 : 1 }
  };
  const populateOptions = _expand ? [{ path: "categoryId", select: "name" }] : [];
  try {
    const ConvertProduct = Product;
    const result = await ConvertProduct.paginate(
      { categoryId: null },
      { ...options, populate: populateOptions }
    );
    if (result.docs.length === 0)
      throw new Error("No products found");
    const response = {
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      throw new Error("Product not found");
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const create = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((message) => ({ message }));
      return res.status(400).json({ errors });
    }
    const product = await Product.create(req.body);
    await Category.findOneAndUpdate(product.categoryId, {
      $addToSet: {
        products: product._id
      }
    });
    return res.status(200).json({
      product
    });
  } catch (error) {
    return res.status(400).json({
      message: "Thêm sản phẩm không thành công",
      error: error.message
    });
  }
};
const update = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        messages: error.details.map((message) => ({ message }))
      });
    }
    const productId = req.params.id;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.sendStatus(404);
    }
    const oldCategoryId = updatedProduct.categoryId;
    await Category.findByIdAndUpdate(oldCategoryId, {
      $pull: { products: productId }
    });
    const newCategoryId = req.body.categoryId;
    if (newCategoryId) {
      await Category.findByIdAndUpdate(newCategoryId, {
        $addToSet: { products: productId }
      });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({
      message: "Cập nhật sản phẩm không thành công",
      error: error.message
    });
  }
};
const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const { isHardDelete } = req.body;
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((message) => ({ message }));
      return res.status(400).json({ errors });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });
    }
    if (isHardDelete) {
      await product.forceDelete();
      await Category.findByIdAndUpdate(product.categoryId, {
        $pull: { products: product._id }
      });
    } else {
      await product.delete();
    }
    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      data: product
    });
  } catch (error) {
    res.status(400).json({
      message: "Xóa sản phẩm thất bại",
      error: error.message
    });
  }
};
const restore = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const product = await Product.findById(id);
    if (!user.role || user.role !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền phục hồi sản phẩm"
      });
    }
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });
    }
    if (!product.deleted) {
      return res.status(400).json({
        message: "Sản phẩm chưa bị xóa mềm"
      });
    }
    product.deleted = false;
    product.deletedAt = null;
    const restoredProduct = await product.save();
    return res.status(200).json({
      message: "Phục hồi sản phẩm thành công",
      data: restoredProduct
    });
  } catch (error) {
    res.status(400).json({
      message: "Phục hồi sản phẩm không thành công",
      error: error.message
    });
  }
};
const authorization = async (req, res, next) => {
  try {
    const user = req.user;
    if (!(user.role === "admin")) {
      throw new Error("Bạn không có quyền để thực hiện hành động này");
    }
    next();
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new Error("Bạn phải đăng nhập để thực hiện hành động này");
    const token = authHeader && authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET;
    const { id } = jwt.verify(token, secretKey);
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
const router$1 = express.Router();
router$1.get("/products", getAll);
router$1.get("/products/:id", get);
router$1.post("/products/:id", create);
router$1.patch("/products/:id", authenticate, authorization, restore);
router$1.put("/products/:id", authenticate, authorization, update);
router$1.delete("/products/:id", authenticate, authorization, remove);
v2.config({
  cloud_name: "ecommercer2021",
  api_key: "626155946999554",
  api_secret: "7VZ2gYWaR0ZWKGfd55uBPIjEnso"
});
const uploadImage = async (req, res) => {
  const files = req.files;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded" });
  }
  try {
    const uploadPromises = files.map((file) => {
      return v2.uploader.upload(file.path);
    });
    console.log("uploadPromises", uploadPromises);
    const results = await Promise.all(uploadPromises);
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id
    }));
    return res.json({ urls: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await v2.uploader.destroy(publicId);
    return res.status(200).json({ message: "Xóa ảnh thành công", result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting image" });
  }
};
const updateImage = async (req, res) => {
  const files = req.files;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded" });
  }
  const publicId = req.params.publicId;
  const newImage = req.files[0].path;
  try {
    const [uploadResult, deleteResult] = await Promise.all([
      v2.uploader.upload(newImage),
      v2.uploader.destroy(publicId)
    ]);
    return res.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message || "Error updating image" });
  }
};
const router = express.Router();
const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "WE17301",
    format: "png"
  }
});
const upload = multer({ storage });
router.post("/images/upload", upload.array("images", 10), uploadImage);
router.delete("/images/:publicId", deleteImage);
router.put("/images/:publicId", upload.array("images", 10), updateImage);
const app = express();
dotenv.config();
connectDB(String(process.env.MONGO_URI));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use("/api", router$1);
app.use("/api", router$2);
app.use("/api", router);
const viteNodeApp = app;
export {
  viteNodeApp
};
