import mongoose from 'mongoose';
import MarkSheet from "../models/MarkSheet";
import { SolutionType } from 'models.types';
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
    answers: [{
        question: Object,
        answer: String,
        correctAnswer: String
    }],
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

SolutionSchema.pre("save", function (this: SolutionType, next) {
    var mark = 0;
    if (this.isMemo) {
        this.mark = this.answers.length;
        next();
    } else {
        var Model = mongoose.model<SolutionType>('Solution', SolutionSchema);
        Model.findOne({
            questionaireId: this.questionaireId,
            isMemo: true
        })
            .then((s) => {
                if (s == null) throw new Error("Test does not have a memorandum");

                this.answers = this.answers.filter(a => a.answer).map(answer => {
                    let solution = s.answers.find(v => v.question.id == answer.question.id);
                    if (solution == null) throw new Error("Test does not have a memorandum");
                    if (answer.answer == solution.answer) {
                        mark++;
                    }
                    answer.correctAnswer = solution.answer;
                    return answer;
                });
                this.mark = mark;

                // Put the mark to the marksheet
                var self = this;
                MarkSheet.findOne({
                    id: this.questionaireId
                }).then((sheet: any) => {
                    if (sheet == null) throw new Error("Your mark is not added to your marksheet , no marksheet");
                    sheet.studentMarks.push({
                        studentID: self.studentId,
                        mark
                    })
                    sheet.save(function (err: Error) {
                        if (err) throw new Error("Your mark is not added to your marksheet, save failed");
                        next();
                    });
                }).catch(err => {
                    console.log(err)
                    next(new Error(err));
                });
            })
            .catch(err => {
                console.log("An error occured while calculating your mark, " + err.message);
                next(new Error(err.message));
            });
    }

});

SolutionSchema.index({
    questionaireId: 1,
    studentId: 1,
    date: 1
}, {
    unique: true
});

const Solution = mongoose.model<SolutionType>('Solution', SolutionSchema);
export default Solution;