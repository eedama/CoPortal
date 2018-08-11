import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const QuestionaireSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    lecturerID: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    }, // ForeignKey
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
    questions: 1
}, {
    unique: true
});

const Questionaire = mongoose.model('Questionaire', QuestionaireSchema);
module.exports = Questionaire;