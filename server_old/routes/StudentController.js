var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
import mongoose from "mongoose";

import Student from "../models/Student";
import Module from "../models/Module";
import Questionaire from "../models/Questionaire";
import consoling from '../services/Logger';
import helper from '../services/Helper';
import smsProvider from "../services/SMSProvider"
import emailProvider from "../services/EmailProvider"

/*
  TODO: Get one student - DONE
        Get a list of them - DONE
        Search for a student - DONE
        Add a student
        Remove a student (Not to delete)
        Edit student details
        Login student
*/
function GeneratePassword(password) {
  var saltRounds = 13;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
}


router.post("/delete/:studentID", function (req, res) {
  var studentID = req.params.studentID;
  Student.findById(studentID).then(student => {
    if (!student) return res.status(512).send("Student does not exist");
    student.active = false;
    student.removed = true;
    student.save(function (err) {
      if (err) return res.status(512).send("Server error : " + err.message);
      res.send(studentID);
    })
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });

});

router.post("/add/bulk/parents", function (req, res) {
  var studentParents = req.body.studentParents;
  if (studentParents && studentParents.length > 0) {
    studentParents.filter(v => v && v.surname && v.firstName).forEach(studentParent => {
      Student.findOne({
        $or: [
          {
            contactNumbers: studentParent.cellphone ? studentParent.cellphone.trim() : 'Joseph'
          },
          {
            lastname: new RegExp(studentParent.surname, 'i'),
            firstname: new RegExp(studentParent.firstName, 'i')
          }
        ]
      }).then(async student => {
        if (student) {
          console.log(`We found ${studentParent.surname} ${studentParent.firstName} and about to link parents.`);
          var father = {
            surname: studentParent.fatherSurname ? studentParent.fatherSurname.toLowerCase() : student.lastname,
            name: studentParent.fatherName ? studentParent.fatherName.toLowerCase() : `${student.firstname}Father`,
            contactNumbers: studentParent.fathercellphone,
            email: student.fatherEmail,
            relationship: "FATHER",
            password: studentParent.fatherSurname ? GeneratePassword(studentParent.fatherSurname.toLowerCase()) : GeneratePassword(student.lastname)
          };

          var mother = {
            surname: studentParent.motherSurname ? studentParent.motherSurname.toLowerCase() : student.lastname,
            name: studentParent.motherName ? studentParent.motherName.toLowerCase() : `${student.firstname}Mother`,
            contactNumbers: studentParent.mothercellphone,
            email: student.motherEmail,
            relationship: "MOTHER",
            password: studentParent.motherSurname ? GeneratePassword(studentParent.motherSurname.toLowerCase()) : GeneratePassword(student.lastname)
          };

          if (!student.parents) {
            student.parents = [];
          }
          let count = student.parents.length;

          if (student.parents.find(p => p.surname == father.surname && p.name == father.name && p.relationship == father.relationship)) {
            console.log(`${father.surname} ${father.name} is already a ${father.relationship} of ${student.username}.`);
          } else if (!father.contactNumbers) {
            console.log(`We got an invalid father for ${student.username}`);
          } else {
            console.log("Father pushed ?")
            student.parents.push(father);
          }

          if (student.parents.find(p => p.surname == mother.surname && p.name == mother.name && p.relationship == mother.relationship)) {
            console.log(`${mother.surname} ${mother.name} is already a ${mother.relationship} of ${student.username}.`);
          } else if (!mother.contactNumbers) {
            console.log(`We got an invalid mother for ${student.username}`);
          } else {
            console.log("Mother pushed ?")
            student.parents.push(mother);
          }

          student.save(function (err) {
            if (err) console.log(`Could not save parents for ${student.username}, try again later`);
            if (father.email) {
              let message = GenerateEmail(father.name, student.firstname + " " + student.lastname, father.relationship, father.email, father.surname);
              emailProvider.sendEmail(father.email, "Welcome to Coportal, Your profile is created successfully", message);
            }

            if (mother.email) {
              let message = GenerateEmail(mother.name, student.firstname + " " + student.lastname, mother.relationship, mother.email, mother.surname);
              emailProvider.sendEmail(mother.email, "Welcome to Coportal, Your profile is created successfully", message);
            }
            if (count != student.parents.length) {
              console.log("SUCCESS .... " + student.username);
            }
          });
        } else {
          console.log(`We couldn't find ${studentParent.surname} ${studentParent.firstName}`);
        }
      });
    });
  }
});


router.post("/add/parent/for/:studentID", function (req, res) {
  var studentID = req.params.studentID;
  var _parent = req.body.parent;

  Student.findById(studentID).then(async student => {
    if (!student) return res.status(512).send("Student does not exist");
    if (!_parent) return res.status(512).send("Invalid parent details provided");

    let oldParent = null;
    try {
      const _student = await Student.findOne({
        'parents.contactNumbers': _parent.numbers
      });
      if (_student) {
        oldParent = _student.parents.find(s => s.contactNumbers == _parent.numbers);
      }
    } catch (err) {

    }

    const rawPassword = oldParent ? null : helper.generatePassword(4);
    const password = oldParent ? oldParent.password : GeneratePassword(rawPassword);
    var parent = {
      surname: _parent.surname,
      name: _parent.name,
      contactNumbers: _parent.numbers,
      email: _parent.email,
      relationship: _parent.relationship && _parent.relationship.toUpperCase(),
      password: password
    };

    if (!student.parents) {
      student.parents = [];
    }

    if (student.parents.find(p => p.surname == parent.surname && p.name == parent.name && p.relationship == parent.relationship)) {
      return res.status(512).send(`${parent.surname} ${parent.name} is already a ${parent.relationship} of ${student.username}.`);
    } else {
      student.parents.push(parent);
    }

    if (oldParent) {
      student.save(function (err) {
        if (err) return res.status(512).send(`Could not update user ${parent.surname} ${parent.name} try again later`);
        return res.send(`Added ${parent.surname} ${parent.name} as a ${parent.relationship} of ${student.username}.`);
      });
    } else {
      student.save(function (err) {
        if (err) return res.status(512).send(`Could not save user ${parent.surname} ${parent.name} try again later`);
        if (parent.email) {
          let message = GenerateEmail(parent.name, student.firstname + " " + student.lastname, parent.relationship, parent.email, rawPassword);
          emailProvider.sendEmail(parent.email, "Welcome to Coportal, Your profile is created successfully", message);
        }
        return res.send(`Added as a ${parent.relationship} of ${student.username}.`);
      });
    }

  }).catch(err => {
    consoling.info({ key: req.url, input: err, message: err.message });
    return res.status(512).send("Server error : " + err.message);
  });

});

router.get("/students/all", function (req, res) {
  Student.find({
    "active": true
  })
    .populate(["rents"])
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/for/module/:moduleID", function (req, res) {
  var moduleID = req.params.moduleID;
  Module.findById(moduleID).then(m => {
    if (m == null)
      return res.status(512).send("Module does not exist");

    Student.find({
      "active": true,
      "modules": moduleID
    })
      .populate(['modules'])
      .then(students => {
        if (students == null) res.send("Server error : Try again later");
        res.json(students);
      }).catch(err => {
        return res.status(512).send("Server error : " + err.message);
      });
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });

});

router.get("/students/of/ids/:studentIDs", function (req, res) {
  var studentIDs = req.params.studentIDs;
  if (!Array.isArray(studentIDs)) {
    studentIDs = [studentIDs];
  }
  console.log(studentIDs);

  studentIDs = studentIDs.map(l => mongoose.Types.ObjectId(l));

  Student.find({
    "active": true,
    '_id': {
      $in: studentIDs
    }
  })
    .populate(["rents"])
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/usernames", function (req, res) {
  Student.find({
    "active": true
  }, "_id username")
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/fullnames", function (req, res) {
  Student.find({
    "active": true
  }, "_id firstname lastname")
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get('/all/past/tests/for/:studentId', function (req, res) {
  var studentId = req.params.studentId;
  Student.findById(studentId).populate('solutions').then(s => {
    if (s == null) return res.status(512).send("Student not found");
    console.log(s);
    var answer = [];
    s.solutions.forEach(solution => {
      Questionaire.findById(solution.questionaireId).then(q => {
        console.log(q);
        if (q != null) {
          answer.push({
            solutionId: solution._id,
            title: q.title,
            mark: solution.mark + '/' + solution.answers.length,
            date: solution.date
          })
          console.log(answer);
          res.json(answer);
        } else {
          return res.status(512).send("Server error : questionaire does not exist");
        }
      });
    });
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });
});

router.get("/:id/get", function (req, res) {
  let id = req.params.id;
  if (id == null) {
    return res.status(512).send("Invalid ID");
  } else {
    Student.findById(id)
      .populate(['modules'])
      .then(student => {
        if (student == null) {
          return res.status(512).send("No student with id : " + id);
        } else {
          res.json(student);
        }
      });
  }
});

router.post("/add/bulk/students", async function (req, res) {

  const students = req.body.students; var succeded = [], failed = [];

  for (var _student of students) {
    try {
      console.log("Adding " + _student.firstname)

      _student.gender = (_student.gender == "M" || _student.gender == "m") ? "Male" : "Female";

      if (_student.idNumber && _student.idNumber.length == 12) {
        _student.dob = new Date(
          _student.idNumber.substring(0, 2),
          _student.idNumber.substring(2, 4) - 1,
          _student.idNumber.substring(4, 6)
        );
      }

      _student.username = _student.firstname.toLowerCase().replace(/ /g, '') + '-' + _student.lastname.toLowerCase().replace(/ /g, '')
      _student.password = _student.lastname.toLowerCase().replace(/ /g, '');

      var student = new Student({
        _id: mongoose.Types.ObjectId(),
        lastname: _student.lastname[0].toUpperCase() + _student.lastname.slice(1).toLowerCase(),
        firstname: _student.firstname[0].toUpperCase() + _student.firstname.slice(1).toLowerCase(),
        password: GeneratePassword(_student.password),
        username: _student.username,
        gender: _student.gender,
        dob: _student.dob,
        idNumber: _student.idNumber,
        isSouthAfrican: true
      });

      var results = await Student.findOne({
        username: student.username
      });
      if (!results) {
        var saved = await student.save();
        if (saved) {
          console.log("Done with " + _student.firstname)
          succeded.push(saved);
        } else {
          failed.push(student.name + " failed");
        }
      } else {
        failed.push(results.lastname + " " + results.firstname + " already exists");
      }
    } catch (ex) {

      console.log("Exception ")
      console.log(ex.message);
      failed.push(ex.message);
    }
  }
  return res.json({
    succeded: succeded,
    failed: failed
  });
});

function GenerateEmail(parentName, studentName, relationship, username, password) {
  return "<div class=\"Email-header\" style=\"font-size:20px;font-family:sans-serif;letter-spacing:1px; box-sizing:border-box; margin-top:60px;margin-bottom:98px;\">" +
    "<img class=\"corportal\" align=\"right\" style=\"width:160px;height:auto;margin-top:-40px;\" src=\"https://coportal.net/static/img/logo.1328452.png\">" +
    "<span>Coportal Communication</span></div><div style=\"font-family:sans-serif;margin-left:20px;color:dark\"><h4>Hi " + parentName +
    "</h4><p style=\"margin-bottom:20px\">You have been added as a " + relationship + " of " + studentName + " on the CoPortal system<br /><br />" +
    "Please use the following details to log into the system</p><br />" +
    "<h4 style=\"font-family:sans-serif;margin-left:20px;color:dark\">Username : <strong>" + username + "</strong></h4>" +
    "<h4 style=\"font-family:sans-serif;margin-left:20px;color:dark\">Password : <strong>" + password + "</strong></h4>" +
    "<br /><a href='https://" + process.env.SCHOOL + ".coportal.net' style=\"text-decoration:none;background-color:black;color:white;padding:10px;border-radius:10px;\" >Visit the portal</a><br /><br />" +
    "<br /><a href='https://play.google.com/store/apps/details?id=com.jmrsquared.coportal' style=\"text-decoration:none;background-color:black;color:white;padding:10px;border-radius:10px;\" >Download the APP</a>" +
    "<br /><br /><br /><br />Best Regards,<br> <br><span>Coportal Communication</span>" +
    "<br><img class=\"corportal\" align=\"left\" style=\"width:160px;height:auto;opacity:0.1\" src=\"https://coportal.net/static/img/coPortalLogo.jpg\"></div>";
}
module.exports = router;