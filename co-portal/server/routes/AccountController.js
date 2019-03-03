var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import ForgotPassword from "../models/ForgotPassword"
import EmailProvider from "../services/EmailProvider"
const emailProvider = new EmailProvider();
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

  Student
    .findOne({
      username: username
    }).populate({
      path: 'modules',
      select: '_id code name'
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
                return res.status(512).send("Incorrect login details");
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
      return res.status(500).send();
    });
});

router.post("/forgot/password", async function (req, res) {
  var email = req.body.email;

  if (!email || email.indexOf('@') < 2 || email.indexOf('.') < 2 || email.length < 5) {
    return res.status(512).send("You have entered an invalid email address");
  }

  var forgotPassword = new ForgotPassword();
  forgotPassword.email = email;

  var message = `Hey, \n Use the link below to reset your password \n \n \n \n ${process.env.BASE_URL}/${forgotPassword._id}`;

  var emailResponse = await emailProvider.sendEmail(email, "Coportal password recovery", message);
  if (emailResponse) {
    forgotPassword.save(function (err) {
      if (err) return res.status(512).send("Internal server error. Please try again later");
      return res.send(`An email with a new link to login was sent to ${email}`);
    });
  } else {
    return res.status(512).send("Unable to send you the email, please try again later");
  }
});

module.exports = router;