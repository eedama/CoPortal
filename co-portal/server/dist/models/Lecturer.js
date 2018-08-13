'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var LecturerSchema = new _mongoose2.default.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: _mongoose2.default.Types.ObjectId()
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
    }]
});

LecturerSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

LecturerSchema.index({
    '$**': 'text'
});

var Lecturer = _mongoose2.default.model('Lecturer', LecturerSchema);
module.exports = Lecturer;