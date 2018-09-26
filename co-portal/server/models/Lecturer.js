import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const LecturerSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    idNumber: {
        type: Number,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    firstname: String,
    lastname: String,
    gender: String,
    email: String,
    profilePic: String,
    password: String,
    contactNumbers: Number,
    isSouthAfrican: {
        type: Boolean,
        default: null
    },
    active: {
        type: Boolean,
        default: true
    },
    dob: Date,
    lastUpdatedAt: {
        type: Date,
        default: Date.now()
    },
    lastActivityDate: {
        type: Date,
        default: Date.now()
    },
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    },
    // Relationships
    questionaires: [{
        type: Schema.Types.ObjectId,
        ref: 'Questionaire'
    }],
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
});

LecturerSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

LecturerSchema.index({
    '$**': 'text'
});

const Lecturer = mongoose.model('Lecturer', LecturerSchema);
module.exports = Lecturer;