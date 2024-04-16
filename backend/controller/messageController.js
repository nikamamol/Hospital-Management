import { Message } from "../models/messageSchema.js";
import { CatchAsyncError } from "../middleweres/CatchAsyncError.js";
import ErrorHandler from "../middleweres/errorMiddlewere.js";


export const sendMessage = CatchAsyncError(async(req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    await Message.create({
        firstName,
        lastName,
        email,
        phone,
        message,
    });
    return res.status(200).json({
        succsess: true,
        message: "Message sent successfully",
    });
});


export const getAllMessages = CatchAsyncError(async(req, res) => {
    const messages = await Message.find();
    return res.status(200).json({
        succsess: true,
        messages
    })
})