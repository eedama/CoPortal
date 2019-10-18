import mongoose from 'mongoose';
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
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    code: String,
    module: {
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

AnnouncementSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

AnnouncementSchema.index({
    lecturerId: 1,
    studentId: 1,
    moduleId: 1,
    message: 1,
    type: 1
}, {
    unique: true
});


const Announcement = mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;