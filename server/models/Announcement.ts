import mongoose from 'mongoose';
import { AnnouncementType } from 'models.types';
var Schema = mongoose.Schema;

const AnnouncementSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    lecturerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    title: String,
    message: String,
    type: String,
    done: {
        type: Boolean,
        default: false
    },
    seenBy: [{
        type: Schema.Types.ObjectId
    }],
    deletedBy: [{
        type: Schema.Types.ObjectId
    }],
    date: {
        type: Date,
        default: Date.now
    },
    //If dueDate is not null then it is a reminder to be sent to the from
    dueDate: {
        type: Date,
        default: null
    },
    removed: {
        type: Boolean,
        default: false
    }
});

AnnouncementSchema.index({
    lecturerId: 1,
    studentId: 1,
    moduleId: 1,
    message: 1,
    type: 1
}, {
    unique: true
});


const Announcement = mongoose.model<AnnouncementType>('Announcement', AnnouncementSchema);
export default Announcement;