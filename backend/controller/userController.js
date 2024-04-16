import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middleweres/CatchAsyncError.js";
import ErrorHandler from "../middleweres/errorMiddlewere.js";
import { User } from "../models/UserSchema.js";
import { generateToken as sendTokenResponse } from "../utils/jwtToken.js"; // Rename the import

export const patientRegister = CatchAsyncError(async(req, res, next) => {
    const {
        firstName,
        lastName,
        gender,
        dob,
        email,
        password,
        phone,
        nic,
        role,
    } = req.body;
    if (!firstName ||
        !lastName ||
        !gender ||
        !dob ||
        !email ||
        !password ||
        !phone ||
        !nic ||
        !role
    ) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = await User.findOne({ email: email });
    if (user) {
        return next(new ErrorHandler("User already registered", 400));
    }
    user = await User.create({
        firstName,
        lastName,
        phone,
        gender,
        dob,
        email,
        nic,
        role,
        password,
    });
    sendTokenResponse(user, "User Registered Successfully", 201, res); // Use the renamed function
});

export const login = CatchAsyncError(async(req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler("Password and Confirm Password do not match", 400)
        );
    }
    let user = await User.findOne({ email: email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User with this role not found", 400));
    }
    sendTokenResponse(user, "User Logged in Successfully", 200, res); // Use the renamed function
});

export const addNewAdmin = CatchAsyncError(async(req, res, next) => {
    const { firstName, lastName, gender, dob, email, password, phone, nic } =
    req.body;
    if (!firstName ||
        !lastName ||
        !gender ||
        !dob ||
        !email ||
        !password ||
        !phone ||
        !nic
    ) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    const isRegistered = await User.findOne({ email: email });
    if (isRegistered) {
        return next(
            new ErrorHandler(`${isRegistered.role} is alredy registred`, 400)
        );
    }
    const admin = await User.create({
        firstName,
        lastName,
        password,
        nic,
        phone,
        gender,
        dob,
        email,
        role: "Admin",
    });
    res.status(200).json({
        success: true,
        message: "Admin Added Successfully",
    });
});

export const getAllDoctors = CatchAsyncError(async(req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = CatchAsyncError(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = CatchAsyncError(async(req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Admin Logged out Successfully",
        });
});

export const logoutPatient = CatchAsyncError(async(req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Patient Logged out Successfully",
        });
});

export const addNewDoctor = CatchAsyncError(async(req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new ErrorHandler("Doctor Avatar Required!", 400);
        }
        const { docAvatar } = req.files;
        console.log(docAvatar);
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(docAvatar.mimetype)) {
            throw new ErrorHandler("File Format Not Supported!", 400);
        }
        const {
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password,
            doctorDepartment,
        } = req.body;
        if (!firstName ||
            !lastName ||
            !email ||
            !phone ||
            !nic ||
            !dob ||
            !gender ||
            !password ||
            !doctorDepartment
        ) {
            throw new ErrorHandler("Please Fill Full Form!", 400);
        }
        const isRegistered = await User.findOne({ email });
        if (isRegistered) {
            throw new ErrorHandler("Doctor With This Email Already Exists!", 400);
        }
        // const cloudinaryResponse = await cloudinary.uploader.upload(
        //     docAvatar.tempFilePath
        // );
        const cloudinaryResponse = await cloudinary.uploader.upload(
            "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg", { public_id: "olympic_flag" },
            function(error, result) {
                console.log(result);
            }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error(
                "Cloudinary Error:",
                cloudinaryResponse.error || "Unknown Cloudinary error"
            );
            throw new ErrorHandler(
                "Failed To Upload Doctor Avatar To Cloudinary",
                500
            );
        }
        const doctor = await User.create({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password,
            role: "Doctor",
            doctorDepartment,
            docAvatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        });
        res.status(200).json({
            success: true,
            message: "New Doctor Registered",
            doctor,
        });
    } catch (error) {
        console.error("Error creating new doctor:", error);
        next(error); // Pass the error to the error handling middleware
    }
});