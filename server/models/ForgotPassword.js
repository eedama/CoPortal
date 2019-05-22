import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const ForgotPasswordSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    email:String,
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    }
});

const ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema);
module.exports = ForgotPassword;