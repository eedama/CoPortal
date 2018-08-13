'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseGridfs = require('mongoose-gridfs');

var _mongooseGridfs2 = _interopRequireDefault(_mongooseGridfs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');


console.log(_mongoose2.default.connection);

var gridfs = new _mongooseGridfs2.default({
    collection: 'lectureNotes',
    model: 'Attachment',
    mongooseConnection: _mongoose2.default.connection
});

var AttachmentSchema = gridfs.schema;

AttachmentSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

AttachmentSchema.methods.saveFile = function (file) {
    console.log(file);
    console.log(JSON.stringify(file));
    Attachment.write({
        filename: file.name,
        contentType: file.contentType
    }, fs.createReadStream(path.resolve(__dirname, '/files/' + file.name)), function (error, savedAttachment) {
        if (error) return false;
        console.log(savedAttachment);
        console.log(JSON.stringify(savedAttachment));
        return savedAttachment;
    });
};

module.export = _mongoose2.default.model('Attachment', AttachmentSchema);