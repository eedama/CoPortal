import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SolutionSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    questionaireId: {
        type: Schema.Types.ObjectId,
        ref: 'Questionaire'
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    answers: Array,
    mark: Number,
    feedbacks: Array,
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
    var mark = 0;
    if (this.isMemo) {
        this.mark = this.answers.length;
        next();
    } else {
        console.log("Deep in the Pussy!");
        var Model = mongoose.model('Solution', SolutionSchema);
        Model.findOne({
                questionaireId: this.questionaireId,
                isMemo: true
            })
            .then(s => {
                if (s == null) throw "Test does not have a memorandum";

                this.answers.forEach((answer, i) => {
                    let solution = s.answers.find(v => v.question.id == answer.question.id);
                    if (solution == null) throw "Test does not have a memorandum";
                    if (answer.answer == solution.answer) {
                        mark++;
                    }
                });
                this.mark = mark;
                next();
            })
            .catch(err => {
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

SolutionSchema.index({
    questionaireId: 1,
    studentId: 1,
    date: 1
}, {
    unique: true
});

const Solution = mongoose.model('Solution', SolutionSchema);
module.exports = Solution;