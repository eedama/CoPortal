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
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    parents: [{
        _id: {
            type: Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId()
        },
        surname: String,
        name: String,
        contactNumbers: String,
        email: String,
        relationship: {
            type: String,
            enum: ['MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'GUARDIAN'],
            default: 'GUARDIAN'
        }
    }],
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
    deviceTokens: [{
        date: {
            type: Date
        },
        lastActiveDate: {
            type: Date,
            default: new Date()
        },
        token: {
            type: String
        },
        deviceInfo: {
            deviceType: {
                type: String,
                default: null
            },
            screen: {
                width: String,
                height: String,
                scale: String,
                widthPixels: String,
                heightPixels: String
            },
            model: {
                type: String,
                default: null
            },
            manufacturer: {
                type: String,
                default: null
            },
            manufacturer: {
                type: String,
                default: null
            },
            os: {
                type: String,
                default: null
            },
            osVersion: {
                type: String,
                default: null
            },
            sdkVersion: {
                type: String,
                default: null
            },
            language: {
                type: String,
                default: null
            }
        },
        dateRemoved: {
            type: Date,
            default: null
        },
        removed: {
            type: Boolean,
            default: false
        }
    }]
});

StudentSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

StudentSchema.index({
    '$**': 'text'
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;