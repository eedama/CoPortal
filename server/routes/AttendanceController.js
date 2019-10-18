var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Attendance from "../models/Attendance";
import Module from "../models/Module";
import Lecturer from "../models/Lecturer";
import EmailProvider from "../services/EmailProvider";
import moment from "moment";
const emailProvider = new EmailProvider();

router.post("/sign", function (req, res) {
  var studentId = req.body.studentId;
  var code = req.body.code;

  return res.send("We got your attendance!");
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
  var code = req.body.code;

  return res.json([]);
});

router.get("/get/for/:moduleId/on/:date", function (req, res) {
  var moduleId = req.params.moduleId;
  var date = req.params.date;

  return res.json([]);
});

function generateCode(length) {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  if (!length || length < 0) length = 5;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += alphabets[(Math.random() * alphabets.length - 1).toFixed()];
  }
  return code;
}
module.exports = router;