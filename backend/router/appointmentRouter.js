import express from "express";
import { appointment, deleteAppointment, getAllAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthenticaticated, isPatientAuthenticaticated } from "../middleweres/auth.js";


const appointmentRouter = express.Router();
appointmentRouter.post("/post", isPatientAuthenticaticated, appointment)
appointmentRouter.get("/getallapointment", isAdminAuthenticaticated, getAllAppointment)
appointmentRouter.put("/updatestatus/:id", isAdminAuthenticaticated, updateAppointmentStatus)
appointmentRouter.delete("/deleteappointment/:id", isAdminAuthenticaticated, deleteAppointment)

export default appointmentRouter;