import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SurveySchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    surveyAnswers: [{
        QuestionId: {
            type: Schema.Types.ObjectId,
            ref: 'SurveyQuestions'
        },
        Answer: String
    }],
    name: String,
    surname: String,
    email: String,
    number: String,
    area: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Survey = mongoose.model('Survey', SurveySchema);
module.exports = Survey;