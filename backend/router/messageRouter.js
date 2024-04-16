import express from "express";
import { getAllMessages, sendMessage } from "../controller/messageController.js";
import { isAdminAuthenticaticated } from "../middleweres/auth.js";

const messageRouter = express.Router();
messageRouter.post("/send", sendMessage);
messageRouter.get("/getallmessage", isAdminAuthenticaticated, getAllMessages);
export default messageRouter;