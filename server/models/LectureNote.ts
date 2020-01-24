import mongoose from 'mongoose';
import { LecturerNoteType } from 'models.types';
var Schema = mongoose.Schema;

const LectureNoteSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    lecturerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }, //ForeignKey
    title: String,
    size: String,
    thumbnail: {
        type: String,
        default: null
    },
    description: String,
    file: Object,
    type: String,
    date: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    }
});

LectureNoteSchema.index({
    lecturerId: 1,
    moduleId: 1,
    date: 1
}, {
    unique: true
});

const LectureNote = mongoose.model<LecturerNoteType>('LectureNote', LectureNoteSchema);
export default LectureNote;