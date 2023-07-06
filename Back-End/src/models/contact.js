import mongoose from "mongoose";
const ContactModel = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true 
    },
    phone: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    support: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false,
})

export default mongoose.model("Contact", ContactModel)