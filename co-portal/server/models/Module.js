import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const ModuleSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    name: String,
    code: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    },

    //Relationships
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'LectureNote'
    }],
    questionaires: [{
        type: Schema.Types.ObjectId,
        ref: 'Questionaire'
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    lecturers: [{
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    }],
});

ModuleSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

ModuleSchema.index({
    name: 1,
    code: 1,
    description: 1
}, {
    unique: true
});


const Module = mongoose.model('Module', ModuleSchema);
module.exports = Module;