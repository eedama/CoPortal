var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import Announcement from "../models/Announcement";
import Module from "../models/Module";

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.post("/announcements/get/for/:userID", function (req, res) {
  var userID = req.params.userID;
  var userType = req.body.userType;
  var moduleId = req.body.moduleID;
  var withSeen = req.body.seen;
  var withDeleted = req.body.deleted;

  if (!userType || (userType != 'ADMIN' && userType != 'LECTURER' && userType != 'STUDENT')) {
    return res.status(512).send("Invalid user");
  }
  Announcement.find({
    removed: false,
    moduleId: moduleId
  }).then(announcements => {
    if (announcements == null) return res.status(512).send("No announcements where found");
    announcements = announcements.filter(a => a.deletedBy.filter(deleted => deleted == userID).length == 0)

    announcements = announcements.filter(async a => {
      if (a.moduleId == null) return true;
      var m = await Module.findById(a.moduleId);
      if (m == null) return false;
      if (userType == 'STUDENT') return m.students.filter(s => s == userID).length > 0;
      if (userType == 'LECTURER') return m.lecturers.filter(l => l == userID).length > 0;
      return true;
    });

    announcements.forEach(element => {
      element.seenBy = undefined;
      element.deletedBy = undefined;
    });
    res.json(announcements);
  });
});

router.post("/announcements/add/for/:moduleID/by/:userType/of/id/:userId", function (req, res) {
  var moduleID = req.params.moduleID;
  var userType = req.params.userType;
  var userId = req.params.userId;
  var notification = req.body.announcement;

  if (notification) {
    moduleID = notification.isToAll ? null : moduleID;
    userId = userType != 'LECTURER' ? null : userId
    var announcement = new Announcement({
      lecturerId: userId,
      moduleId: moduleID,
      title: notification.title,
      message: notification.message,
      type: notification.type
    });
    Module.findById(moduleID).then(m => {
      if (m == null && moduleID != null) return res.status(512).send("No modules where found");
      console.log(m);
      Lecturer.findById(userId).then(l => {
        if (l == null && userId != null) return res.status(512).send("No lecturer was found");
        announcement.save(function (err) {
          if (err) return res.status(512).send("Server error : " + err.message);
          res.json(announcement);
        });
      }).catch(err => {
        return res.status(512).send("Server error : " + err.message);
      });
    }).catch(err => {
      return res.status(512).send("Server error : " + err.message);
    });
  } else if (!notification) {
    return res.status(512).send("Invalid request");
  }
});


module.exports = router;