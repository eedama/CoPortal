import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const MarkSheetSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    lecturerID: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    moduleID: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    id: String,
    title: String,
    studentMarks: [{
        studentID: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        mark: Number
    }],
    type: {
        type: String,
        enum: ['PRACTICALTEST', 'THEORYTEST', 'HOMECLASSTEST', 'EXAM', 'ONLINETEST', 'UNKNOWN'],
        default: 'UNKNOWN'
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

MarkSheetSchema.index({
    id: 1,
    title: 1,
    moduleID: 1
}, {
    unique: true
});

const MarkSheet = mongoose.model('MarkSheet', MarkSheetSchema);
module.exports = MarkSheet;