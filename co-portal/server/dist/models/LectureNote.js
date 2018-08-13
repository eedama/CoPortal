'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var LectureNoteSchema = new _mongoose2.default.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: _mongoose2.default.Types.ObjectId()
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
LectureNoteSchema.index({
    lecturerId: 1,
    moduleId: 1,
    date: 1
}, {
    unique: true
});

var LectureNote = _mongoose2.default.model('LectureNote', LectureNoteSchema);
module.exports = LectureNote;