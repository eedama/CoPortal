import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const StudentSchema = new mongoose.Schema({
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
    room: String,
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
    nextOfKin: {
        name: String,
        surname: String,
        relationship: String,
        contact: Number
    },
    sponsor: String,
    lease: {
        rentDueOn: String,
        startDate: Date,
        endDate: Date,
        rentAmount: Number,
        depositAmount: Number
    }, // ForeignKey
    lastUpdatedAt: {
        type: Date,
        default: Date.now()
    },
    dob: Date,
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
    solutions: [{
        type: Schema.Types.ObjectId,
        ref: 'Solution'
    }],
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
});

StudentSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

StudentSchema.index({
    '$**': 'text'
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;