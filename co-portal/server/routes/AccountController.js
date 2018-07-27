var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import Document from "../models/Document";
import Transaction from "../models/Transaction";
import Bug from "../models/Bug";

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
                res.status(512).send(username + " does not exist");
              } else {
                // admin != null
                if (admin.password != password) {
                  res.status(512).send("Incorrect password for " + username);
                }
                res.send(admin);
              }
            });
          } else {
            // lecturer != null
            if (lecturer.password != password) {
              res.status(512).send("Incorrect password for " + username);
            }
            res.send(lecturer);
          }
        });
      } else {
        // student != null
        if (student.password != password) {
          res.status(512).send("Incorrect password for " + username);
        }
        res.send(student);
      }
    }).catch(err => {
      res.status(500).send(err.message);
    });
});

module.exports = router;