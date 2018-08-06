import mongoose from 'mongoose';
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
    type: {
        type: Object,
        default: null
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

LectureNoteSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const LectureNote = mongoose.model('LectureNote', LectureNoteSchema);
module.exports = LectureNote;