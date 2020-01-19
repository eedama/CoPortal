import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const AttendanceSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    lecturerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    students: [{
        date: Date,
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    }],
    code: String,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    expireDate: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    }
});

AttendanceSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

AttendanceSchema.index({
    lecturerId: 1,
    moduleId: 1,
    code: 1
}, {
    unique: true
});


const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;