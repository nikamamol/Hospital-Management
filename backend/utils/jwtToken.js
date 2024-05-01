// // export const generateToken = (user, message, statusCode, res) => {
// //     const token = user.generateJsonWebToken();
// //     const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
// //     res.status(statusCode).cookie(cookieName, token, {
// //         expires: new Date(
// //             Date.now() + process.env.COOKIES_EXPIRE * 24 * 60 * 60 * 1000
// //         ), // 7 days
// //         httpOnly: true,
// //     }).json({
// //         success: true,
// //         message,
// //         user,
// //         token,
// //     })
// // };

// // jwtToken.js

// import jwt from "jsonwebtoken";

// export const generateToken = (user, message, statusCode, res) => {
//     const token = user.generateJsonWebToken();
//     const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
//     res.status(statusCode).cookie(cookieName, token, {
//         expires: new Date(
//             Date.now() + process.env.COOKIES_EXPIRE * 24 * 60 * 60 * 1000
//         ), // 7 days
//         httpOnly: true,
//     }).json({
//         success: true,
//         message,
//         user,
//         token,
//     });
// };

// import jwt from "jsonwebtoken";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user, message, statusCode, res) => {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT secret key not provided");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRESIN,
        });

        const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

        res
            .status(statusCode)
            .cookie(cookieName, token, {
                expires: new Date(
                    Date.now() + process.env.COOKIES_EXPIRE * 24 * 60 * 60 * 1000
                ), // 7 days
                httpOnly: true,
            })
            .json({
                success: true,
                message,
                user,
                token,
            });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};