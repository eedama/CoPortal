var express = require('express');
var router = express.Router();
import mongoose from 'mongoose';

// import the models
import Module from '../models/Module';
//import Attachment from '../models/Attachment'
import LectureNote from '../models/LectureNote';
import Admin from '../models/Admin';
import Lecturer from '../models/Lecturer';
import Student from '../models/Student';
import Solution from '../models/Solution';


/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/

router.get("/modules/all", function (req, res) {
    Module.find()
        .populate(["lecturers"])
        .populate(["students"])
        .populate(["questionaires"])
        .populate(["notes"])
        .then(modules => {
            if (modules == null) return res.status(512).send("No modules where found");
            res.json(modules);
        }).catch(err => {
            return res.status(512).send("Server error : " + err.message);
        });
});

router.get("/get/module/:moduleId", function (req, res) {
    var moduleId = req.params.moduleId;
    Module.findById(moduleId)
        .populate(["lecturers"])
        .populate(["students"])
        .populate(["questionaires"])
        .populate(["notes"])
        .then(module => {
            if (module == null) return res.status(512).send("Module was not found");
            res.json(module);
        }).catch(err => {
            return res.status(512).send("Server error : " + err.message);
        });
});

router.post('/add/new/module', function (req, res) {

    Module.findOne({
        name: req.body.module.name,
        code: req.body.module.code,
    }).then(results => {
        if (results != null) return res.status(512).send(`Module ${req.body.module.name}(${req.body.module.code}) already exist`);
        var module = new Module({
            _id: mongoose.Types.ObjectId(),
            name: req.body.module.name,
            code: req.body.module.code,
            description: req.body.module.description,
        });

        module.save(function (err) {
            if (err) return res.status(512).send("Server error : " + err.message);
            Module.find()
                .populate(["lecturers"])
                .populate(["students"])
                .populate(["questionaires"])
                .populate(["notes"])
                .then(modules => {
                    if (modules == null) return res.status(512).send("Server error : sadbbyjwyqduqwgyu");
                    res.json(modules);
                });
        });
    })
});

router.post('/add/notes/for/:moduleId/by/:lectureId', function (req, res) {
    var moduleId = req.params.moduleId;
    var lectureId = req.params.lectureId;

    Module.findById(moduleId).then(module => {
        if (module == null) new Error("Module does not exist");
        if (module.lecturers.indexOf(lectureId) < 0) new Error("Lecturer does not exist / Is not incharge of this module");

        var lecturerNote = new LectureNote({
            _id: mongoose.Types.ObjectId(),
            lecturerId: lecturerId,
            moduleId: moduleId,
            title: req.body.title,
            size: req.body.size,
            thumbnail: req.body.thumbnail,
            description: req.body.description,
            //     file: Attachment.saveFile(req.body.document),
            type: req.body.type,
        });

        lecturerNote.save(function (err) {
            if (err) return res.status(512).send("Server error : " + err.message);
            module.notes.push(lecturerNote._id);
            module.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                res.json(lecturerNote._id);
            });
        })
    }).catch(err => {
        return res.status(512).send("Server error : " + err.message);
    });
});

router.post('/assign/to/lecturer/:lecturerID', function (req, res) {
    var lecturerID = req.params.lecturerID;

    var lecturerModules = new Array();

    req.body.modules.filter(m => m != null).map(m => {
        lecturerModules.push(mongoose.Types.ObjectId(m));
    });

    Lecturer.findById(lecturerID).then(lecturer => {
        if (lecturer == null) return res.status(512).send("Lecturer was not found");
        Module.find({
            '_id': {
                $in: lecturerModules
            }
        }).then(modules => {
            lecturerModules = modules.filter(m => lecturer.modules.filter(sm => sm == m._id).length == 0).map(m => m._id);
            lecturer.modules.push(lecturerModules);
            lecturer.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(err => {
            console.log(err);
            return res.status(512).send("Server error : " + err.message);
        });
    }).catch(err => {
        console.log(err);
        return res.status(512).send("Server error : " + err.message);
    });
});

router.post("/unassign/module/:moduleID/from/lecturer/:lecturerID", function (req, res) {
    var lecturerID = req.params.lecturerID;
    var moduleID = req.params.moduleID;

    Lecturer.findById(lecturerID).then(lecturer => {
        if (lecturer == null) return res.status(512).send("Lecturer was not found");
        Module.findById(moduleID).then(module => {
            if (module == null) return res.status(512).send("Module was not found");
            var victim = lecturer.modules.find(m => m == moduleID);
            console.log("before " + lecturer.modules.length);
            console.log(victim)
            if (victim != null) {
                var index = lecturer.modules.indexOf(victim);
                console.log(index)
                lecturer.modules.splice(index, 1);
            }
            console.log("after " + lecturer.modules.length);
            lecturer.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(err => {
            console.log(err);
            return res.status(512).send("Server error : " + err.message);
        });
    }).catch(err => {
        console.log(err);
        return res.status(512).send("Server error : " + err.message);
    });
});

router.post('/assign/to/student/:studentID', function (req, res) {
    var studentID = req.params.studentID;

    var studentModules = new Array();

    req.body.modules.filter(m => m != null).map(m => {
        studentModules.push(mongoose.Types.ObjectId(m));
    });

    Student.findById(studentID).then(student => {
        if (student == null) return res.status(512).send("Student was not found");
        Module.find({
            '_id': {
                $in: studentModules
            }
        }).then(modules => {
            studentModules = modules.filter(m => student.modules.filter(sm => sm == m._id).length == 0).map(m => m._id);
            student.modules.push(studentModules);
            student.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(err => {
            console.log(err);
            return res.status(512).send("Server error : " + err.message);
        });
    }).catch(err => {
        console.log(err);
        return res.status(512).send("Server error : " + err.message);
    });
});

router.post("/unassign/module/:moduleID/from/student/:studentID", function (req, res) {
    var studentID = req.params.studentID;
    var moduleID = req.params.moduleID;

    Student.findById(studentID).then(student => {
        if (student == null) return res.status(512).send("Student was not found");
        Module.findById(moduleID).then(module => {
            if (module == null) return res.status(512).send("Module was not found");
            var victim = student.modules.find(m => m == moduleID);
            console.log("before " + student.modules.length);
            console.log(victim)
            if (victim != null) {
                var index = student.modules.indexOf(victim);
                console.log(index)
                student.modules.splice(index, 1);
            }
            console.log("after " + student.modules.length);
            student.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(err => {
            console.log(err);
            return res.status(512).send("Server error : " + err.message);
        });
    }).catch(err => {
        console.log(err);
        return res.status(512).send("Server error : " + err.message);
    });
});

router.get('/get/solution/id/for/:questionaireID/by/:userType/of/id/:userID',function(req,res){
  var questionaireID = req.params.questionaireID;
  var userType = req.params.userType;
  var userID = req.params.userID;
  
  var studentID = (userType == "LECTURER" || userType == "ADMIN") ? null : userID;
  var isMemo = (userType == "LECTURER" || userType == "ADMIN");

  console.log(studentID + " " + isMemo)
  Solution.findOne({
    questionaireId: questionaireID,
    studentId: studentID,
    isMemo: isMemo
  }).then(solution => {
    if(solution == null && (userType == "LECTURER" || userType == "ADMIN")){
        return res.status(512).send("No solution for this questionaire");
        return;
    }else if(solution == null){
        res.json({
            id: null
        });
    }else{
        res.json({
            id: solution._id
        });     
    } 
    
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });
  
});

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

router.post('/add/notes/title/:title/description/:description',upload.single('file'),function(req,res){
    var title = req.params.title;
    var description = req.params.description;
    console.log(title);
    console.log(__dirname);
    console.log(req.file);
    console.log(req.files);
    
    res.send("Done");
});

module.exports = router;