import { CatchAsyncError } from "../middleweres/CatchAsyncError.js";
import ErrorHandler from "../middleweres/errorMiddlewere.js";
import { User } from "../models/UserSchema.js";
import Appointment from "../models/appointmentSchema.js";
import { v4 as uuidv4 } from 'uuid';

// Function to generate a new patient ID
function generateNewPatientId() {
    return uuidv4();
}

export const appointment = CatchAsyncError(async(req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;

    // Check if all required fields are provided
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    // Find the doctor based on provided details
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    // Handle cases where no doctor found or multiple doctors found
    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found", 400));
    }
    if (isConflict.length > 1) {
        return next(
            new ErrorHandler(
                "Doctor conflict please contact through email or phone",
                400
            )
        );
    }

    // Extract doctor's ID and generate patient's ID
    const doctorId = isConflict[0]._id;
    const patientId = generateNewPatientId();
    console.log(patientId)

    // Create the appointment
    const createdAppointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId: patientId,
    });

    // Send response back to the client with status and appointment data
    res.status(201).json({
        status: "success",
        data: {
            status: "success",
            appointment: createdAppointment,
            patientId: patientId,
        },
    });
});

export const getAllAppointment = CatchAsyncError(async(req, res, next) => {
    const appointments = await Appointment.find();

    res.status(200).json({
        status: true,
        appointments: appointments,
    });
});

export const updateAppointmentStatus = CatchAsyncError(
    async(req, res, next) => {
        const { id } = req.params;
        let appointment = await Appointment.findById(id);
        if (!appointment) {
            return next(new ErrorHandler("Appointment not found", 404));
        }
        appointment = await Appointment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            appointment: appointment,
        });
    }
);

export const deleteAppointment = CatchAsyncError(async(req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
        appointment: appointment,
    })
});