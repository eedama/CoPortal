'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ModuleSchema = new _mongoose2.default.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: _mongoose2.default.Types.ObjectId()
    },
    name: String,
    code: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    },

    //Relationships
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'LectureNote'
    }],
    questionaires: [{
        type: Schema.Types.ObjectId,
        ref: 'Questionaire'
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    lecturers: [{
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    }]
});

ModuleSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

ModuleSchema.index({
    name: 1,
    code: 1,
    description: 1
}, {
    unique: true
});

var Module = _mongoose2.default.model('Module', ModuleSchema);
module.exports = Module;