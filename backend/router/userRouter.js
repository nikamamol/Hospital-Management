import express from "express";
import {
    addNewAdmin,
    addNewDoctor,
    getAllDoctors,
    getUserDetails,
    login,
    logoutAdmin,
    logoutPatient,
    patientRegister,
} from "../controller/userController.js";
import { isAdminAuthenticaticated, isPatientAuthenticaticated } from "../middleweres/auth.js";

const userRouter = express.Router();
userRouter.post("/patient/register", patientRegister);
userRouter.post("/login", login);
userRouter.post("/admin/addnew", isAdminAuthenticaticated, addNewAdmin); //isAdminAuthenticaticated  is middlewere
userRouter.get("/doctors", getAllDoctors);
userRouter.get("/admin/me", isAdminAuthenticaticated, getUserDetails);
userRouter.get("/patient/me", isPatientAuthenticaticated, getUserDetails);
userRouter.get("/admin/logout", isAdminAuthenticaticated, logoutAdmin);
userRouter.get("/patient/logout", isPatientAuthenticaticated, logoutPatient);
userRouter.post("/doctor/addnew", isAdminAuthenticaticated, addNewDoctor);


export default userRouter;