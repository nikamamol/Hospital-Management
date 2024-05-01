import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name Must be Contain At Least 3 Characters"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "First Name Must be Contain At Least 3 Characters"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    phone: {
        type: Number,
        required: true,
        minLength: [11, "Phone Number Must be Contain At Least 11 Digits"],
        maxLength: [11, "Phone Number Must be Contain At Least 11 Digits"],
    },
    message: {
        type: String,
        required: true,
        minLength: [5, "Message Must be Contain At Least 10 Characters"],
    },
});

export const Message = mongoose.model("Message", messageSchema);