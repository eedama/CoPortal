'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var BugSchema = new _mongoose2.default.Schema({
    _id: { type: Schema.Types.ObjectId, default: _mongoose2.default.Types.ObjectId() },
    bugText: String,
    senderName: String,
    senderPic: String,
    screenshot: { type: Object, default: null },
    comments: [{ type: String }],
    date: { type: Date, default: Date.now() },
    removed: { type: Boolean, default: false }
});

var Bug = _mongoose2.default.model('Bug', BugSchema);
module.exports = Bug;