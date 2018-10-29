var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";

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

  Student.findOne({
      username: username
    })
    .then(student => {
      if (student == null) {
        Lecturer.findOne({
          username: username
        }).then(lecturer => {
          if (lecturer == null) {
            Admin.findOne({
              username: username,
              password: password
            }).then(admin => {
              if (admin == null) {
                return res.status(512).send(username + " does not exist");
              } else {
                // admin != null
                if (admin.password != password) {
                  return res.status(512).send("Incorrect password for " + username);
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
              return res.status(512).send("Incorrect password for " + username);
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
          return res.status(512).send("Incorrect password for " + username);
        }
        res.json({
          userType: 'STUDENT',
          user: student
        });
      }
    }).catch(err => {
      return res.status(500).send(err.message);
    });
});

module.exports = router;