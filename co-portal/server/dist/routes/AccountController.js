"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Admin = require("../models/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

var _Lecturer = require("../models/Lecturer");

var _Lecturer2 = _interopRequireDefault(_Lecturer);

var _Student = require("../models/Student");

var _Student2 = _interopRequireDefault(_Student);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var router = express.Router();
// import the models


/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/login", function (req, res) {
  var password = req.body.password;
  var username = req.body.username;

  _Student2.default.findOne({
    username: username
  }).then(function (student) {
    if (student == null) {
      _Lecturer2.default.findOne({
        username: username
      }).then(function (lecturer) {
        if (lecturer == null) {
          _Admin2.default.findOne({
            username: username,
            password: password
          }).then(function (admin) {
            if (admin == null) {
              res.status(512).send(username + " does not exist");
            } else {
              // admin != null
              if (admin.password != password) {
                res.status(512).send("Incorrect password for " + username);
              }
              res.json({
                userType: 'ADMIN',
                user: admin
              });
            }
          });
        } else {
          // lecturer != null
          if (lecturer.password != password) {
            res.status(512).send("Incorrect password for " + username);
          }
          res.json({
            userType: 'LECTURER',
            user: lecturer
          });
        }
      });
    } else {
      // student != null
      if (student.password != password) {
        res.status(512).send("Incorrect password for " + username);
      }
      res.json({
        userType: 'STUDENT',
        user: student
      });
    }
  }).catch(function (err) {
    res.status(500).send(err.message);
  });
});

module.exports = router;