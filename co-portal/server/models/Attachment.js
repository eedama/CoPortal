var fs = require('fs');
import mongoose from 'mongoose';
import GridFS from 'mongoose-gridfs';

console.log(mongoose.connection);

var gridfs = new GridFS({
    collection: 'lectureNotes',
    model: 'Attachment',
    mongooseConnection: mongoose.connection
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
        },
        fs.createReadStream(path.resolve(__dirname, `/files/${file.name}`)),
        function (error, savedAttachment) {
            if (error) return false;
            console.log(savedAttachment);
            console.log(JSON.stringify(savedAttachment))
            return savedAttachment;
        }
    );
};

module.export = mongoose.model('Attachment', AttachmentSchema);