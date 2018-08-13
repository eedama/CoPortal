'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var AnnouncementSchema = new _mongoose2.default.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: _mongoose2.default.Types.ObjectId()
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
    message: String,
    type: String,
    done: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    },
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

var Announcement = _mongoose2.default.model('Announcement', AnnouncementSchema);
module.exports = Announcement;