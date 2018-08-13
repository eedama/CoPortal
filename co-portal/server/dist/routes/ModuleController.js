'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Module = require('../models/Module');

var _Module2 = _interopRequireDefault(_Module);

var _LectureNote = require('../models/LectureNote');

var _LectureNote2 = _interopRequireDefault(_LectureNote);

var _Admin = require('../models/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

var _Lecturer = require('../models/Lecturer');

var _Lecturer2 = _interopRequireDefault(_Lecturer);

var _Student = require('../models/Student');

var _Student2 = _interopRequireDefault(_Student);

var _Solution = require('../models/Solution');

var _Solution2 = _interopRequireDefault(_Solution);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

// import the models

//import Attachment from '../models/Attachment'


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
    _Module2.default.find().populate(["lecturers"]).populate(["students"]).populate(["questionaires"]).populate(["notes"]).then(function (modules) {
        if (modules == null) res.status(512).send("No modules where found");
        res.json(modules);
    }).catch(function (err) {
        res.status(512).send("Server error : " + err.message);
    });
});

router.get("/get/module/:moduleId", function (req, res) {
    var moduleId = req.params.moduleId;
    _Module2.default.findById(moduleId).populate(["lecturers"]).populate(["students"]).populate(["questionaires"]).populate(["notes"]).then(function (module) {
        if (module == null) res.status(512).send("Module was not found");
        res.json(module);
    }).catch(function (err) {
        res.status(512).send("Server error : " + err.message);
    });
});

router.post('/add/new/module', function (req, res) {

    _Module2.default.findOne({
        name: req.body.module.name,
        code: req.body.module.code
    }).then(function (results) {
        if (results != null) res.status(512).send('Module ' + req.body.module.name + '(' + req.body.module.code + ') already exist');
        var module = new _Module2.default({
            _id: _mongoose2.default.Types.ObjectId(),
            name: req.body.module.name,
            code: req.body.module.code,
            description: req.body.module.description
        });

        module.save(function (err) {
            if (err) res.status(512).send("Server error : " + err.message);
            _Module2.default.find().populate(["lecturers"]).populate(["students"]).populate(["questionaires"]).populate(["notes"]).then(function (modules) {
                if (modules == null) res.status(512).send("Server error : sadbbyjwyqduqwgyu");
                res.json(modules);
            });
        });
    });
});

router.post('/add/notes/for/:moduleId/by/:lectureId', function (req, res) {
    var moduleId = req.params.moduleId;
    var lectureId = req.params.lectureId;

    _Module2.default.findById(moduleId).then(function (module) {
        if (module == null) new Error("Module does not exist");
        if (module.lecturers.indexOf(lectureId) < 0) new Error("Lecturer does not exist / Is not incharge of this module");

        var lecturerNote = new _LectureNote2.default({
            _id: _mongoose2.default.Types.ObjectId(),
            lecturerId: lecturerId,
            moduleId: moduleId,
            title: req.body.title,
            size: req.body.size,
            thumbnail: req.body.thumbnail,
            description: req.body.description,
            //     file: Attachment.saveFile(req.body.document),
            type: req.body.type
        });

        lecturerNote.save(function (err) {
            if (err) res.status(512).send("Server error : " + err.message);
            module.notes.push(lecturerNote._id);
            module.save(function (err) {
                if (err) res.status(512).send("Server error : " + err.message);
                res.json(lecturerNote._id);
            });
        });
    }).catch(function (err) {
        res.status(512).send("Server error : " + err.message);
    });
});

router.post('/assign/to/lecturer/:lecturerID', function (req, res) {
    var lecturerID = req.params.lecturerID;

    var lecturerModules = new Array();

    req.body.modules.filter(function (m) {
        return m != null;
    }).map(function (m) {
        lecturerModules.push(_mongoose2.default.Types.ObjectId(m));
    });

    _Lecturer2.default.findById(lecturerID).then(function (lecturer) {
        if (lecturer == null) res.status(512).send("Lecturer was not found");
        _Module2.default.find({
            '_id': {
                $in: lecturerModules
            }
        }).then(function (modules) {
            lecturerModules = modules.filter(function (m) {
                return lecturer.modules.filter(function (sm) {
                    return sm == m._id;
                }).length == 0;
            }).map(function (m) {
                return m._id;
            });
            lecturer.modules.push(lecturerModules);
            lecturer.save(function (err) {
                if (err) res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(function (err) {
            console.log(err);
            res.status(512).send("Server error : " + err.message);
        });
    }).catch(function (err) {
        console.log(err);
        res.status(512).send("Server error : " + err.message);
    });
});

router.post("/unassign/module/:moduleID/from/lecturer/:lecturerID", function (req, res) {
    var lecturerID = req.params.lecturerID;
    var moduleID = req.params.moduleID;

    _Lecturer2.default.findById(lecturerID).then(function (lecturer) {
        if (lecturer == null) res.status(512).send("Lecturer was not found");
        _Module2.default.findById(moduleID).then(function (module) {
            if (module == null) res.status(512).send("Module was not found");
            var victim = lecturer.modules.find(function (m) {
                return m == moduleID;
            });
            console.log("before " + lecturer.modules.length);
            console.log(victim);
            if (victim != null) {
                var index = lecturer.modules.indexOf(victim);
                console.log(index);
                lecturer.modules.splice(index, 1);
            }
            console.log("after " + lecturer.modules.length);
            lecturer.save(function (err) {
                if (err) res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(function (err) {
            console.log(err);
            res.status(512).send("Server error : " + err.message);
        });
    }).catch(function (err) {
        console.log(err);
        res.status(512).send("Server error : " + err.message);
    });
});

router.post('/assign/to/student/:studentID', function (req, res) {
    var studentID = req.params.studentID;

    var studentModules = new Array();

    req.body.modules.filter(function (m) {
        return m != null;
    }).map(function (m) {
        studentModules.push(_mongoose2.default.Types.ObjectId(m));
    });

    _Student2.default.findById(studentID).then(function (student) {
        if (student == null) res.status(512).send("Student was not found");
        _Module2.default.find({
            '_id': {
                $in: studentModules
            }
        }).then(function (modules) {
            studentModules = modules.filter(function (m) {
                return student.modules.filter(function (sm) {
                    return sm == m._id;
                }).length == 0;
            }).map(function (m) {
                return m._id;
            });
            student.modules.push(studentModules);
            student.save(function (err) {
                if (err) res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(function (err) {
            console.log(err);
            res.status(512).send("Server error : " + err.message);
        });
    }).catch(function (err) {
        console.log(err);
        res.status(512).send("Server error : " + err.message);
    });
});

router.post("/unassign/module/:moduleID/from/student/:studentID", function (req, res) {
    var studentID = req.params.studentID;
    var moduleID = req.params.moduleID;

    _Student2.default.findById(studentID).then(function (student) {
        if (student == null) res.status(512).send("Student was not found");
        _Module2.default.findById(moduleID).then(function (module) {
            if (module == null) res.status(512).send("Module was not found");
            var victim = student.modules.find(function (m) {
                return m == moduleID;
            });
            console.log("before " + student.modules.length);
            console.log(victim);
            if (victim != null) {
                var index = student.modules.indexOf(victim);
                console.log(index);
                student.modules.splice(index, 1);
            }
            console.log("after " + student.modules.length);
            student.save(function (err) {
                if (err) res.status(512).send("Server error : " + err.message);
                res.json(true);
            });
        }).catch(function (err) {
            console.log(err);
            res.status(512).send("Server error : " + err.message);
        });
    }).catch(function (err) {
        console.log(err);
        res.status(512).send("Server error : " + err.message);
    });
});

router.get('/get/solution/id/for/:questionaireID/by/:userType/of/id/:userID', function (req, res) {
    var questionaireID = req.params.questionaireID;
    var userType = req.params.userType;
    var userID = req.params.userID;

    var studentID = userType == "LECTURER" || userType == "ADMIN" ? null : userID;
    var isMemo = userType == "LECTURER" || userType == "ADMIN";

    console.log(studentID + " " + isMemo);
    _Solution2.default.findOne({
        questionaireId: questionaireID,
        studentId: studentID,
        isMemo: isMemo
    }).then(function (solution) {
        if (solution == null && (userType == "LECTURER" || userType == "ADMIN")) {
            res.status(512).send("No solution for this questionaire");
            return;
        } else if (solution == null) {
            res.json({
                id: null
            });
        } else {
            res.json({
                id: solution._id
            });
        }
    }).catch(function (err) {
        res.status(512).send("Server error : " + err.message);
    });
});

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.post('/add/notes/title/:title/description/:description', upload.single('file'), function (req, res) {
    var title = req.params.title;
    var description = req.params.description;
    console.log(title);
    console.log(__dirname);
    console.log(req.file);
    console.log(req.files);

    res.send("Done");
});

module.exports = router;