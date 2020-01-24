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
        type: Number
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

LecturerSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

LecturerSchema.index({
    '$**': 'text'
});

const Lecturer = mongoose.model('Lecturer', LecturerSchema);
module.exports = Lecturer;