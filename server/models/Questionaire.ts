import mongoose from 'mongoose';
import { QuestionaireType } from 'models.types';
var Schema = mongoose.Schema;

const QuestionaireSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
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
    attemptLimit: {
        type: Number,
        default: 1
    },
    totalAttempts: { //This variable is never saved to the database
        default: 0,
        type: Number
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

const Questionaire = mongoose.model<QuestionaireType>('Questionaire', QuestionaireSchema);
export default Questionaire;