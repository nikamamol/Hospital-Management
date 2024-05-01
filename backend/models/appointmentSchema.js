import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    appointment_date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    doctor: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    hasVisited: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    patientId: {
        type: String, // Change this to String
        required: true
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;