'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var SolutionSchema = new _mongoose2.default.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: _mongoose2.default.Types.ObjectId()
    },
    questionaireId: {
        type: Schema.Types.ObjectId,
        ref: 'Questionaire'
    },
    answers: Array,
    mark: Number,
    isMemo: {
        type: Boolean,
        default: false
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

SolutionSchema.pre("save", function (next) {
    var _this = this;

    var mark = 0;
    if (this.isMemo) {
        this.mark = this.answers.length;
        next();
    } else {
        console.log("Deep in the Pussy!");
        var Model = _mongoose2.default.model('Solution', SolutionSchema);
        Model.findOne({
            questionaireId: this.questionaireId,
            isMemo: true
        }).then(function (s) {
            console.log("Inside this thing");
            if (s == null) throw "Test does not have a memorandum";

            console.log(s);

            _this.answers.forEach(function (answer, i) {
                var solution = s.answers.find(function (v) {
                    return v.question == answer.question;
                });
                if (solution != null) {
                    if (answer.solution == solution.solution) {
                        mark++;
                    }
                }
            });
            _this.mark = mark;
            next();
        }).catch(function (err) {
            console.log("An error occured while calculating your mark, " + err.message);
            next(new Error(err.message));
        });
    }
});

SolutionSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

var Solution = _mongoose2.default.model('Solution', SolutionSchema);
module.exports = Solution;