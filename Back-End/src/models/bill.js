import mongoose from "mongoose";
const BillModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    }],
    total: {
        type: Number,
        required: true
    },
    User_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'đang chờ duyệt'
    },
    orderCode: {
        type: String,
        unique: true,
        required: true,
        default: Math.random().toString(35).substring(4, 8).toUpperCase(),
    },
}, {
    timestamps: true,
    versionKey: false,
})

export default mongoose.model("Bill", BillModel)