var express = require('express');
var router = express.Router();
import mongoose from 'mongoose';

// import the models
import Module from '../models/Module';
import LectureNote from '../models/LectureNote';
import Admin from '../models/Admin';
import Student from '../models/Student';


/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/
router.post('/add/new/module', function (req, res) {

    var module = new Module({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
    });

    module.save(function (err) {
        if (err) res.status(512).send("Server error : " + err.message);
        res.json(module);
    })
});

router.post('/add/notes/for/:moduleId/by/:lectureId', function (req, res) {
    var moduleId = req.params.moduleId;
    var lectureId = req.params.lectureId;

    Module.findById(moduleId).then(module => {
        if (module.lecturers.indexOf(lectureId) < 0) new Error("Lecturer does not exist / Is not incharge of this module");

        var lecturerNote = new Module({
            _id: mongoose.Types.ObjectId(),
            lecturerId: lecturerId,
            moduleId: moduleId,
            title: req.body.title,
            size: req.body.size,
            thumbnail: req.body.thumbnail,
            description: req.body.description,
            file: req.body.file,
        });
    }).catch(err => {
        res.status(512).send("Server error : " + err.message);
    });
});



router.get('/search/:searchText', function (req, res) {
    var text = req.params.searchText;
    Notification.find({
        fromId: req.params.adminId,
        dueDate: null
    }).populate('fromId').populate('toId').then((notifications) => {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get('/all/for/:userId', function (req, res) {
    var receiver = req.params.userId;
    Notification.find({
        toId: receiver
    }).then((notifications) => {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get('/all/:userId', function (req, res) {
    let sender = req.params.userId;
    Notification.find({
        dueDate: null,
        $or: [{
            fromId: sender
        }, {
            toId: sender
        }]
    }).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});


router.get('/tasks/all', function (req, res) {
    Notification.find({
        dueDate: {
            $ne: null
        }
    }).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.get('/tasks/all/:userId', function (req, res) {
    var sender = req.params.userId;
    Notification.find({
        dueDate: {
            $ne: null
        },
        $or: [{
            fromId: sender
        }, {
            toId: sender
        }]
    }).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

module.exports = router;