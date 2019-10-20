var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Attendance from "../models/Attendance";
import Module from "../models/Module";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import EmailProvider from "../services/EmailProvider";
import moment from "moment";
import consoling from "../services/Logger";
const emailProvider = new EmailProvider();

router.post("/sign", function (req, res) {
  var studentId = req.body.studentId;
  var code = req.body.code;

  Attendance.findOne({
    code
  }).then(async attendance => {
    if (!attendance) {
      return res.status(512).send("You have entered a wrong attendance code.");
    }
    if (moment().diff(attendance.expireDate) > 0) {
      return res.status(512).send("The attendance code has expired.");
    }
    try {
      const s = await Student.findById(studentId);
      if (!s) throw new Error('You are not in our system');
      if (!s.modules || s.modules.some(v => v == attendance.moduleId)) throw new Error('You have entered an attendance code of a wrong module.');
    } catch (e) {
      return res.status(512).send(e.message);
    }
    if (!attendance.students) attendance.students = [];
    if (!attendance.students.some(v => v && v.studentId == studentId)) {
      attendance.students.push({
        date: new Date(),
        studentId
      });
    }
    attendance.save(function (err) {
      if (err) return res.status(512).send("Your attendance was not logged, please try again before the code expires.");
      return res.send("Your attendance register is signed successfully!");
    });
  }).catch(err => {
    consoling.info({ key: "Sign attendance", success: false, input: studentId, message: err.message, err });
    return res.status(512).send(err.message);
  });
});

router.post("/create/for/:moduleId", async function (req, res) {
  var moduleId = req.params.moduleId;
  var duration = req.body.duration;
  var lecturerId = req.body.lecturerId

  try {
    let expireDate = moment().add(duration, 'seconds');
    let code = generateCode(5);
    while (await Attendance.findOne({ code })) {
      code = generateCode(5);
    }

    try {
      const m = await Module.findById(moduleId);
      if (!m) throw new Error('The module you entered does not exist')
      const l = await Lecturer.findById(lecturerId);
      if (!l) throw new Error('The lecturer you entered does not exist')
      if (!l.modules || !l.modules.some(v => v == moduleId)) throw new Error('You are not the lecturer of ' + m.name + '(' + m.code + ')');
    } catch (e) {
      return res.status(512).send(e.message);
    }

    const attendance = new Attendance({
      _id: mongoose.Types.ObjectId(),
      code,
      moduleId,
      expireDate,
      lecturerId
    });

    attendance.save(function (err) {
      if (err) {
        console.log(err)
        return res.status(512).send('Unable to generate code,please try again');
      }
      return res.json({
        code: code,
        expiryDate: expireDate
      });
    })
  } catch (err) {
    return res.status(512).send('Server error : ' + err.message);
  }
});

router.get("/get/times/for/:moduleId", function (req, res) {
  var moduleId = req.params.moduleId;

  Attendance.find({
    moduleId
  }, "date").then(attendances => {
    console.log(attendances)
    return res.json(attendances);
  }).catch(err => {
    consoling.info({ key: "GET Times for module", success: false, input: moduleId, message: err.message, err });
    return res.status(512).send(err.message);
  });
});

router.get("/get/for/:moduleId/on/:date", function (req, res) {
  var moduleId = req.params.moduleId;
  var date = req.params.date;
  Attendance.findOne({
    moduleId,
    date
  }, "date")
    .populate("students.studentId")
    .then(attendance => {
      if (!attendance) return res.status(512).send("Can not find the specified attendance register.");
      return res.json(attendance.students);
    }).catch(err => {
      consoling.info({ key: "GET FOR module and time", success: false, input: moduleId, message: err.message, err });
      return res.status(512).send(err.message);
    });
});

function generateCode(length) {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  if (!length || length < 0) length = 5;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += alphabets[(Math.random() * (alphabets.length - 1)).toFixed()];
  }
  return code;
}
module.exports = router;