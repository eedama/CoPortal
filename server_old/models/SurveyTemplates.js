import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SurveyTemplatesSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    title: String,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    lecturerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    questions: [{
        question: String,
        type: {
            type: String,
            enum: ['RADIO', 'BOOLEAN', 'STRING', 'NUMBER'],
            default: 'RADIO'
        },
        options: Array,
        optional: Object,
        maxLength: {
            type: Number,
            default: 100
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const SurveyTemplates = mongoose.model('SurveyTemplates', SurveyTemplatesSchema);
module.exports = SurveyTemplates;