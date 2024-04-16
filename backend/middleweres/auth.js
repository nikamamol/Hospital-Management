import jwt from "jsonwebtoken";
import { User } from "../models/UserSchema.js";
import { CatchAsyncError } from "./CatchAsyncError.js";
import ErrorHandler from "./errorMiddlewere.js";

//admin authentication
export const isAdminAuthenticaticated = CatchAsyncError(
    async(req, res, next) => {
        const token = req.cookies.adminToken;
        if (!token) {
            return next(new ErrorHandler("Admin Not Authenticated", 401));
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
        req.user = await User.findById(decoded.id);
        if (req.user.role !== "Admin") {
            return next(
                new ErrorHandler(
                    `${req.user.role} is not authorised for this resource`,
                    403
                )
            ); //you don't have permission to access this resource
        }
        next();
    }
);

//patient authentication
export const isPatientAuthenticaticated = CatchAsyncError(
    async(req, res, next) => {
        const token = req.cookies.patientToken;
        if (!token) {
            return next(new ErrorHandler("Patient Not Authenticated", 401));
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
        req.user = await User.findById(decoded.id);
        if (req.user.role !== "Patient") {
            return next(
                new ErrorHandler(
                    `${req.user.role} is not authorised for this resource`,
                    403
                )
            ); //you don't have permission to access this resource
        }
        next();
    }
);