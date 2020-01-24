var fs = require('fs');
var path = require('path');

import mongoose from 'mongoose';
const GridFS = require('mongoose-gridfs');

console.log(mongoose.connection);

var gridfs = new GridFS({
    collection: 'lectureNotes',
    model: 'Attachment',
    mongooseConnection: mongoose.connection
});

var AttachmentSchema = gridfs.schema;

AttachmentSchema.methods.saveFile = function (file: { name: string, contentType: string }) {
    console.log(file);
    console.log(JSON.stringify(file));
    this.write({
        filename: file.name,
        contentType: file.contentType
    },
        fs.createReadStream(path.resolve(__dirname, `/files/${file.name}`)),
        function (error: Error, savedAttachment: any) {
            if (error) return false;
            console.log(savedAttachment);
            console.log(JSON.stringify(savedAttachment))
            return savedAttachment;
        }
    );
};

export default mongoose.model('Attachment', AttachmentSchema);