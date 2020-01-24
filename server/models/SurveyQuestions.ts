import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SurveyQuestionsSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    question: String,
    type: {
        type: String,
        enum: ['RADIO', 'BOOLEAN', 'STRING', 'NUMBER'],
        default: 'UNKNOWN'
    },
    options: Array,
    optional: Object,
    maxLength: {
        type: Number,
        default: 100
    }
});

const SurveyQuestions = mongoose.model('SurveyQuestions', SurveyQuestionsSchema);
export default SurveyQuestions;