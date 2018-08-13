'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var QuestionaireSchema = new _mongoose2.default.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: _mongoose2.default.Types.ObjectId()
    },
    lecturerID: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    moduleID: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    title: String,
    questions: Array,
    timeLimit: {
        type: String,
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

QuestionaireSchema.index({
    title: 1,
    questions: 1,
    moduleID: 1
}, {
    unique: true
});

var Questionaire = _mongoose2.default.model('Questionaire', QuestionaireSchema);
module.exports = Questionaire;