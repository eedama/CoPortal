var express = require("express");
var bcrypt = require('bcrypt');
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import ForgotPassword from "../models/ForgotPassword";
import EmailProvider from "../services/EmailProvider";
const emailProvider = new EmailProvider();
/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/sign", function (req, res) {
  var studentId = req.body.studentId;
  var code = req.body.code;

  return res.send("We got your attendance!");
});

router.post("/create/for/:moduleId", function (req, res) {
  var moduleId = req.params.moduleId;
  var duration = req.body.duration;

  return res.send("Attendance created!");
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
module.exports = router;