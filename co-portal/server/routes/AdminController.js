var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Student from "../models/Student";
import Lecturer from "../models/Lecturer";

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/add/lecturer", function (req, res) {
  var lecturer = new Lecturer({
    _id: mongoose.Types.ObjectId(),
    lastname: req.body.lecturer.lastname,
    firstname: req.body.lecturer.firstname,
    password: req.body.lecturer.password,
    username: req.body.lecturer.username,
  });

  Lecturer.findOne({
    username: lecturer.username
  }).then(l => {
    if (l != null) res.status(512).send("Username " + lecturer.username + " is already taken.");
    lecturer.save(function (err) {
      if (err) res.send(err);
      Lecturer.find({
          "active": true
        })
        .then(lecturers => {
          if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
          res.json(lecturers);
        });
    });
  }).catch(err => {
    res.status(512).send("Server error : " + err.message);
  });
});

router.post("/add/student", function (req, res) {
  var student = new Student({
    _id: mongoose.Types.ObjectId(),
    lastname: req.body.student.lastname,
    firstname: req.body.student.firstname,
    password: req.body.student.password,
    username: req.body.student.username,
  });

  Student.findOne({
    username: student.username
  }).then(l => {
    if (l != null) res.status(512).send("Username " + student.username + " is already taken.");
    student.save(function (err) {
      if (err) res.send(err);
      Student.find({
          "active": true
        })
        .then(students => {
          if (students == null) res.status(512).send("Error : 9032rtu834g9erbo");
          res.json(students);
        });
    });
  }).catch(err => {
    res.status(512).send("Server error : " + err.message);
  });
});

module.exports = router;