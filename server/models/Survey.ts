import mongoose from 'mongoose';
import { SurveyType } from 'models.types';
var Schema = mongoose.Schema;

const SurveySchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    surveyTemplateId: {
        type: Schema.Types.ObjectId,
        ref: 'SurveyTemplates'
    },
    attendanceId: {
        type: Schema.Types.ObjectId,
        ref: 'Attendance'
    },
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    students: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        date: {
            type: Date,
            default: Date.now
        },
        answers: [{
            questionId: String,
            question: String,
            answer: String
        }]
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Survey = mongoose.model<SurveyType>('Survey', SurveySchema);
export default Survey;