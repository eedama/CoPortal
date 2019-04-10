var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
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

router.post("/clear/studentmodules", function (req, res) {
    Module.find().then(modules => {
        if (!modules) return res.status(512).send("Modules do not exist");
        modules.forEach(m => {
            m.students = [];
            m.save(function (err) {
                if (err) console.error('Module removal error', m._id + ' can not be removed');
                console.log("Removed module " + m._id);
            })
        })
    })

    Student.find().then(students => {
        if (!students) return res.status(512).send("Students does not exist");
        students.forEach(s => {
            s.modules = [];
            s.save(function (err) {
                if (err) console.error('Student removal error', s._id + ' can not be removed');
                console.log("Removed student " + s._id);
            })
        })
    })

    res.send("Student module removal is in progress");
});


router.get("/passwords/student/update", function (req, res) 
{
  Student.find({
    "active": true
  })
.then(students =>
  {
 if (students == null) res.send("Error : 9032rtu834g9erbo");
  students.forEach(student=>
    {
    student.password =GeneratePassword(student.password) ;
    student.save(function (err)
        {
            if(err){
                console.error(erro)
            }else
            {
                console.log("saved Student");
            }
        })
    })  
  });
});

router.get("/passwords/admin/update", function (req, res) 
{
  Admin.find({
    "active": true
  })
.then(admins =>
  {
 if (admins == null) res.send("Error : 9032rtu834g9erbo");
  admins.forEach(admin=>
    {
    admin.password =GeneratePassword(admin.password) ;
    admin.save(function (err)
        {
            if(err){
                console.error(erro)
            }else
            {
                console.log("saved Admin");
            }
        })
    })  
  });
});

router.get("/passwords/lecturer/update", function (req, res) 
{
  Lecturer.find({
    "active": true
  })
.then(lecturers =>
  {
 if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
  lecturers.forEach(lecturer=>
    {
    lecturer.password =GeneratePassword(lecturer.password) ;
    lecturer.save(function (err)
        {
            if(err){
                console.error(erro)
            }else
            {
                console.log("saved Lecturer");
            }
        })
    })  
  });
});




router.post("/add/lecturer", function (req, res) {
    var lecturer = new Lecturer({
        _id: mongoose.Types.ObjectId(),
        lastname: req.body.lecturer.lastname,
        firstname: req.body.lecturer.firstname,
        password:GeneratePassword(req.body.lecturer.password),
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
            lecturer.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                modules.map(m => {
                    m.lecturers.push(lecturer._id);
                    m.save(function (err) {
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

router.post("/update/lecturer/:lecturerID", function (req, res) {
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

    Lecturer.findById(lecturerID).then(l => {
        if (l == null) return res.status(512).send(lecturer.username + " does not exist.");

        l.lastname = lecturer.lastname;
        l.firstname = lecturer.firstname;
        l.username = lecturer.username;
        l.gender = lecturer.gender;
        l.dob = lecturer.dob;
        l.idNumber = lecturer.idNumber;
        l.isSouthAfrican = lecturer.isSouthAfrican;

        l.save(function (err) {
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
function GeneratePassword(password)
{

var saltRounds = 13;
var salt = bcrypt.genSaltSync(saltRounds);
var hash =   bcrypt.hashSync(password, salt);
return hash;
}

router.post("/add/student", function (req, res) {
    var student = new Student({
        _id: mongoose.Types.ObjectId(),
        lastname: req.body.student.lastname,
        firstname: req.body.student.firstname,
        password: GeneratePassword(req.body.student.password),
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
            student.save(function (err) {
                if (err) return res.status(512).send("Server error : " + err.message);
                modules.map(m => {
                    m.students.push(student._id);
                    m.save(function (err) {
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

router.post("/update/student/:studentID", function (req, res) {
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
                _module.save(function (err) {
                    if (err) console.log('Module addition failed', `Unable to add module ${_module._id} to ${studentID}`)
                    console.log('Module added', `Linked module ${_module._id} to ${studentID}`)
                });
            })
        });
        s.save(function (err) {
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


router.post("/device/token/add", async function (req, res) {
    var adminID = req.body.adminID;
    var deviceToken = req.body.deviceToken;
    var deviceInfo = req.body.deviceInfo;

    try {
        var admin = await Admin.findById(adminID);
        if (admin == null) {
            admin = await Lecturer.findById(adminID)
            if (admin == null) {
                admin = await Student.findById(adminID);
                if (admin == null) {
                    return res.status(512).send("Invalid user");
                }
            }
        }

        if (!admin.deviceTokens) {
            admin.deviceTokens = new Array();
        }

        var exist = admin.deviceTokens.some(v => v.token == deviceToken && !v.removed);
        if (!exist) {
            admin.deviceTokens.push({
                date: Date.now(),
                token: deviceToken,
                deviceInfo: deviceInfo
            });
            admin.save(function (err) {
                if (err) return res.status(512).send(err);
                return res.send("Successfully added the new token");
            });
        } else {
            return res.send("Token was already linked to user");
        }
    } catch (err) {
        return res.status(512).send(err.message);
    }
});

module.exports = router;