var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Student from "../models/Student";
import Lecturer from "../models/Lecturer";
import Module from "../models/Module";

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/clear/studentmodules", function(req, res) {
    Module.find().then(modules => {
        if (!modules) return res.status(512).send("Modules do not exist");
        modules.forEach(m => {
            m.students = [];
            m.save(function(err) {
                if (err) console.error('Module removal error', m._id + ' can not be removed');
                console.log("Removed module " + m._id);
            })
        })
    })

    Student.find().then(students => {
        if (!students) return res.status(512).send("Students does not exist");
        students.forEach(s => {
            s.password = "password";
            s.modules = [];
            s.save(function(err) {
                if (err) console.error('Student removal error', s._id + ' can not be removed');
                console.log("Removed student " + s._id);
            })
        })
    })

    res.send("Student module removal is in progress");
});

router.post("/add/lecturer", function(req, res) {
    var lecturer = new Lecturer({
        _id: mongoose.Types.ObjectId(),
        lastname: req.body.lecturer.lastname,
        firstname: req.body.lecturer.firstname,
        password: req.body.lecturer.password,
        username: req.body.lecturer.username,
        gender: req.body.lecturer.gender,
        dob: req.body.lecturer.dob,
        idNumber: req.body.lecturer.idNumber,
        isSouthAfrican: req.body.lecturer.isSouthAfrican
    });

    var lectureModules = [];

    req.body.lecturer.modules.filter(m => m != null).map(m => {
        lectureModules.push(mongoose.Types.ObjectId(m));
    });

    Module.find({
        '_id': {
            $in: lectureModules
        }
    }).then(modules => {
        lecturer.modules = modules.filter(m => m._id);
        Lecturer.findOne({
            username: lecturer.username
        }).then(l => {
            if (l != null) return res.status(512).send("Username " + lecturer.username + " is already taken.");
            lecturer.save(function(err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                modules.map(m => {
                    m.lecturers.push(lecturer._id);
                    m.save(function(err) {
                        if (err) return res.status(512).send("Server error : " + err.message);
                        Lecturer.find({
                                "active": true
                            }).populate(['modules'])
                            .then(lecturers => {
                                if (lecturers == null) res.send("Error : 9032rtu8fg34g9erbo");
                                res.json(lecturers);
                            });
                    });
                });
            });
        }).catch(err => {
            return res.status(512).send("Server error : " + err.message);
        });
    }).catch(err => {
        console.log(err);
    });

});

router.post("/update/lecturer/:lecturerID", function(req, res) {
    var lecturerID = req.params.lecturerID;
    var lecturer = new Lecturer({
        lastname: req.body.lecturer.lastname,
        firstname: req.body.lecturer.firstname,
        username: req.body.lecturer.username,
        gender: req.body.lecturer.gender,
        dob: req.body.lecturer.dob,
        idNumber: req.body.lecturer.idNumber,
        isSouthAfrican: req.body.lecturer.isSouthAfrican
    });

    Lecturer.findOne({
        username: lecturer.username
    }).then(ll => {
        if (ll != null || ll._id != lecturerID) return res.status(512).send("Username " + lecturer.username + " is already taken.");
        Lecturer.findById(lecturerID).then(l => {
            if (l == null) return res.status(512).send(lecturer.username + " does not exist.");

            l.lastname = lecturer.lastname;
            l.firstname = lecturer.firstname;
            l.username = lecturer.username;
            l.gender = lecturer.gender;
            l.dob = lecturer.dob;
            l.idNumber = lecturer.idNumber;
            l.isSouthAfrican = lecturer.isSouthAfrican;

            l.save(function(err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                Lecturer.find({
                        "active": true
                    })
                    .populate(['modules'])
                    .then(lecturers => {
                        if (lecturers == null) res.send("Error : 9032rtu8fg34g9erbo");
                        res.json(lecturers);
                    });
            });
        }).catch(err => {
            return res.status(512).send("Server error : " + err.message);
        });
    });
});


router.post("/add/student", function(req, res) {
    var student = new Student({
        _id: mongoose.Types.ObjectId(),
        lastname: req.body.student.lastname,
        firstname: req.body.student.firstname,
        password: req.body.student.password,
        username: req.body.student.username,
        gender: req.body.student.gender,
        dob: req.body.student.dob,
        idNumber: req.body.student.idNumber,
        isSouthAfrican: req.body.student.isSouthAfrican,
    });


    var studentModules = [];

    req.body.student.modules.filter(m => m != null).map(m => {
        studentModules.push(mongoose.Types.ObjectId(m));
    });

    Module.find({
        '_id': {
            $in: studentModules
        }
    }).then(modules => {
        student.modules = modules.filter(m => m._id);
        Student.findOne({
            username: student.username
        }).then(l => {
            if (l != null) return res.status(512).send("Username " + student.username + " is already taken.");
            student.save(function(err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                modules.map(m => {
                    m.students.push(student._id);
                    m.save(function(err) {
                        if (err) return res.status(512).send("Server error : " + err.message);
                        Student.find({
                                "active": true
                            })
                            .populate(['modules'])
                            .then(students => {
                                if (students == null) res.send("Error : 9032rtu8fg34g9erbo");
                                res.json(students);
                            });
                    });
                });
            });
        }).catch(err => {
            return res.status(512).send("Server error : " + err.message);
        });
    }).catch(err => {
        console.log(err);
    });
});

router.post("/update/student/:studentID", function(req, res) {
    var studentID = req.params.studentID;
    var student = new Student({
        lastname: req.body.student.lastname,
        firstname: req.body.student.firstname,
        username: req.body.student.username,
        gender: req.body.student.gender,
        dob: req.body.student.dob,
        idNumber: req.body.student.idNumber,
        isSouthAfrican: req.body.student.isSouthAfrican
    });

    var studentModules = [];

    req.body.student.modules.filter(m => m != null).map(m => {
        studentModules.push(mongoose.Types.ObjectId(m));
    });
    Student.findOne({
        username: student.username
    }).then(ss => {
        if (ss != null || ss._id != studentID) return res.status(512).send("Username " + student.username + " is already taken.");
        Student.findById(studentID).then(s => {
            if (s == null) return res.status(512).send(student.username + " does not exist.");

            s.lastname = student.lastname;
            s.firstname = student.firstname;
            s.username = student.username;
            s.gender = student.gender;
            s.dob = student.dob;
            s.idNumber = student.idNumber;
            s.isSouthAfrican = student.isSouthAfrican;
            if (!s.modules) s.modules = [];

            studentModules.filter(v => !s.modules.some(sm => v == sm)).forEach(smm => {
                s.modules.push(smm);
            })

            Module.find({
                '_id': {
                    $in: studentModules
                }
            }).then(modules => {
                if (!modules) console.error('Module addition failed', `Unable to add the modules for ${studentID}`);
                modules.forEach(_module => {
                    if (!_module.students) _module.students = [];
                    if (!_module.students.some(v => v == studentID)) _module.students.push(studentID);
                    _module.save(function(err) {
                        if (err) console.log('Module addition failed', `Unable to add module ${_module._id} to ${studentID}`)
                        console.log('Module added', `Linked module ${_module._id} to ${studentID}`)
                    });
                })
            });
            s.save(function(err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                Student.find({
                        "active": true
                    })
                    .populate(['modules'])
                    .then(students => {
                        if (students == null) res.send("Error : 9032rtu8fg34g9erbo");
                        res.json(students);
                    });
            });
        }).catch(err => {
            return res.status(512).send("Server error : " + err.message);
        });
    });
});

module.exports = router;