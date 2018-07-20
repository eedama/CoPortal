import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const QuestionaireSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    studentID: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }, // ForeignKey
    datePaid: Date,
    monthOfPayment: String,
    amount: Number,
    isDeposit: {
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

const Questionaire = mongoose.model('Questionaire', QuestionaireSchema);
module.exports = Questionaire;