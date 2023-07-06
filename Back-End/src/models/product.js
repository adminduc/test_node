import mongoose from "mongoose";
const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    salePrice: {
        type: Number,
    },
    images: [
        {
            type: String,
            require: true
        },
    ],
    description: {
        type: String,
        require: true
    },
    sizes: [{
        size: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    views: {
        type: Number,
        default: 0
    },
    CategoryId: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            require: true
        }
    ]
}, {
    timestamps: true,
    versionKey: false,
})

export default mongoose.model("Product", ProductModel)