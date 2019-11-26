import express from "express";
var bcrypt = require('bcrypt');
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import ForgotPassword from "../models/ForgotPassword";
import emailProvider from "../services/EmailProvider";
/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/login", function (req: express.Request, res: express.Response) {
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
              username: username
            }).then(admin => {
              if (admin == null) {
                Student.find({
                  'parents.contactNumbers': username
                }).populate({
                  path: 'modules',
                  select: '_id code name'
                }).then(students => {
                  if (students && students.length > 0) {
                    // parent != null
                    students.filter(s => s && s.parents && s.parents.length > 0).forEach(s => {
                      s.parents.filter(p => p && p.password && p.contactNumbers).forEach(parent => {
                        if (ComparePassword(password, parent.password)) {
                          return res.json({
                            userType: 'PARENT',
                            user: parent,
                            students
                          });
                        }
                      })
                    });
                    return res.status(512).send("Incorrect password for " + username);
                  } else {
                    return res.status(512).send("Incorrect login details");
                  }
                });
              } else {
                // admin != null
                if (!ComparePassword(password, admin.password)) {
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
            if (!ComparePassword(password, lecturer.password)) {
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
        if (!ComparePassword(password, student.password)) {
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

router.post("/:userType/change/password/:userID", async function (req: express.Request, res: express.Response) {
  var userType = req.params.userType;
  var userID = req.params.userID;

  switch (userType) {
    case 'student':
      var student = await Student.findById(userID);
      if (student) {
        if (!ComparePassword(req.body.oldPassword, student.password)) {
          return res.status(512).send("Incorrect old password");
        } else {
          if (!req.body.newPassword || req.body.newPassword.length < 4) {
            return res.status(512).send("New password too short, atleast 4 charactors are required");
          }
          student.password = GeneratePassword(req.body.newPassword);
          student.save(function (err) {
            if (err) return res.status(512).send("Unable to save your password,try again later");
            return res.send("Password successfully changed");
          });
        }
      } else {
        res.status(512).send("Unable to find a user with id " + userID);
      }
      break;
    default:
      return res.status(512).send("Invalid request");
  }
});

router.post("/forgot/password", async function (req: express.Request, res: express.Response) {
  var email = req.body.email;

  if (!email || email.indexOf('@') < 2 || email.indexOf('.') < 2 || email.length < 5) {
    return res.status(512).send("You have entered an invalid email address");
  }

  var student = await Student.findOne({
    email: email
  }, 'username');
  var lecturer = await Lecturer.findOne({
    email: email
  }, 'username');
  var admin = await Admin.findOne({
    email: email
  }, 'username');

  var username = null;
  if (student) {
    username = student.username;
  } else if (lecturer) {
    username = lecturer.username;
  } else if (admin) {
    username = admin.username;
  }
  if (!username) {
    return res.status(512).send("You have entered an incorrect email address");
  }

  var forgotPassword = new ForgotPassword({
    email
  });

  var message = GenerateEmail(username, `${process.env.BASE_URL}/${forgotPassword._id}`);

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

function ComparePassword(passwordNew: string, passwordSaved: string) {
  var compare = bcrypt.compareSync(passwordNew, passwordSaved);
  return compare;
}

function GeneratePassword(password: string) {
  var saltRounds = 13;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
}

function GenerateEmail(username: string, link: string) {
  return "<div class=\"Email-header\" style=\"font-size:20px;font-family:sans-serif;letter-spacing:1px; box-sizing:border-box; margin-top:60px;margin-bottom:98px;\">" +
    "<img class=\"corportal\" align=\"left\" style=\"width:160px;height:auto;margin-top:-40px;\" src=\"https://coportal.net/static/img/logo.1328452.png\">" +
    "<span>Coportal Communication</span></div><div style=\"font-family:sans-serif;margin-left:20px;color:dark\"><h4>Hi " + username +
    "</h4><p style=\"margin-bottom:40px\">you recently requested to reset your Coportal account password.please click the button below to reset.</p>" +
    "<a href=\"" + link + "\" style=\"text-decoration:none;background-color:black;color:white;padding:10px;border-radius:10px;\" >Reset your Password</a>" +
    "<p style=\"margin-top:40px; margin-bottom:34px\"> if you did not make this request. please ignore this email</p>   Best Regards,<br> <br><span>Coportal Communication</span>" +
    "<br><img class=\"corportal\" align=\"left\" style=\"width:160px;height:auto;opacity:0.1\" src=\"https://coportal.net/static/img/coPortalLogo.jpg\"></div>";
}

export default router;