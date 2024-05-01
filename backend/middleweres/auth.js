// import jwt from "jsonwebtoken";
// import { User } from "../models/UserSchema.js";
// import { CatchAsyncError } from "./CatchAsyncError.js";
// import ErrorHandler from "./errorMiddlewere.js";

// //admin authentication
// export const isAdminAuthenticaticated = CatchAsyncError(
//     async(req, res, next) => {
//         const token = req.cookies.adminToken;
//         if (!token) {
//             return next(new ErrorHandler("Admin Not Authenticated", 401));
//         }

//         //verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
//         req.user = await User.findById(decoded.id);
//         if (req.user.role !== "Admin") {
//             return next(
//                 new ErrorHandler(
//                     `${req.user.role} is not authorised for this resource`,
//                     403
//                 )
//             ); //you don't have permission to access this resource
//         }
//         next();
//     }
// );

// //patient authentication
// export const isPatientAuthenticaticated = CatchAsyncError(
//     async(req, res, next) => {
//         const token = req.cookies.patientToken;
//         if (!token) {
//             return next(new ErrorHandler("Patient Not Authenticated", 401));
//         }

//         //verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
//         req.user = await User.findById(decoded.id);
//         if (req.user.role !== "Patient") {
//             return next(
//                 new ErrorHandler(
//                     `${req.user.role} is not authorised for this resource`,
//                     403
//                 )
//             ); //you don't have permission to access this resource
//         }
//         next();
//     }
// );

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAdminAuthenticaticated = (req, res, next) => {
    // Check if JWT_SECRET_KEY is provided
    if (!process.env.JWT_SECRET_KEY) {
        return res
            .status(500)
            .json({ success: false, message: "JWT secret key not provided" });
    }

    // Get the token from the request cookies
    const token = req.cookies.adminToken;
    console.log(token);
    // Check if token is provided
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Set user in request object
        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const isPatientAuthenticaticated = (req, res, next) => {
    // Check if JWT_SECRET_KEY is provided
    if (!process.env.JWT_SECRET_KEY) {
        return res
            .status(500)
            .json({ success: false, message: "JWT secret key not provided" });
    }

    // Get the token from the request cookies
    const token = req.cookies.patientToken;

    // Check if token is provided
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Set user in request object
        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};