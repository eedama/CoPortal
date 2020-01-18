import express from "express";
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import Announcement from "../models/Announcement";
import Module from "../models/Module";
import FCM from '../services/FirebaseManager';
import helper from '../services/Helper';
import consoling from "../services/Logger";
import smsProvider from "../services/SMSProvider"
import emailProvider from "../services/EmailProvider"
import { StudentType } from "models.types";

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/
router.post("/test/push/notification", function (req: express.Request, res: express.Response) {
  var deviceToken = req.body.token;
  var payload = {
    notification: {
      title: "Testing push!!",
      body: "This is the body of the push"
    },
    data: {
      link: "/home",
      props: JSON.stringify({
        device_token: deviceToken
      })
    }
  };
  FCM.sendToDevice(deviceToken, payload)
    .then(response => {
      return res.json(response);
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

router.post("/push/notification/to/:userID", function (req: express.Request, res: express.Response) {
  var userID = req.params.userID;
  var notification = req.body.notification;
  var data = req.body.data;
  var link = req.body.link;
  var props = req.body.props;

  if (!notification) {
    notification = {
      title: "Testing push!!",
      body: "This is the body of the push"
    };
  }

  FCM.sendToUserSimple(userID, notification.title, notification.body, link, props)
    .then(response => {
      return res.json(response);
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

// This is used on the Website and it is overloaded soo null ModuleId returns all the global notifications
router.post("/announcements/get/for/:userID", function (req: express.Request, res: express.Response) {
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
  })
    .populate('lecturerId')
    .then(announcements => {
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
      res.json(announcements.reverse());
    });
});

// This is used on the App to get all student notifications
router.get("/announcements/get/all/for/student/:userID", function (req: express.Request, res: express.Response) {
  var userId = req.params.userID;

  Student.findById(userId).then(user => {
    if (user == null) return res.status(512).send("User was not found.");
    if (!user.modules) {
      user.modules = [null];
    } else {
      user.modules.push(null);
    }
    Announcement.find({
      removed: false,
      moduleId: user.modules
    }).
      populate({
        path: 'moduleId',
        select: '_id code name'
      })
      .then(announcements => {
        if (announcements == null) return res.status(512).send("No announcements where found");
        announcements = announcements.filter(a => a.deletedBy.filter(deleted => deleted == userId).length == 0)

        announcements.forEach(element => {
          element.seenBy = undefined;
          element.deletedBy = undefined;
        });
        return res.json(announcements.reverse());
      }).catch(err => {
        return res.status(512).send("Unable to retrieve the notifications, Try again later.");
      });
  }).catch(err => {
    return res.status(512).send("Unable to retrieve the user, Try again later.");
  });
});

router.post("/announcements/add/for/:moduleID/by/:userType/of/id/:userId", function (req: express.Request, res: express.Response) {
  var moduleID = req.params.moduleID;
  var userType = req.params.userType;
  var userId = req.params.userId;
  var notification = req.body.announcement;

  if (notification) {
    moduleID = notification.isToAll ? null : moduleID;
    userId = userType != 'LECTURER' ? null : userId
    var announcement = new Announcement({
      _id: mongoose.Types.ObjectId(),
      lecturerId: userId,
      moduleId: moduleID,
      title: notification.title,
      message: notification.message,
      type: notification.type
    });
    Module.findById(moduleID).then(m => {
      if (m == null && moduleID != null) return res.status(512).send("No modules where found");
      Lecturer.findById(userId).then(l => {
        if (l == null && userId != null) return res.status(512).send("No lecturer was found");
        announcement.save(function (err) {
          if (err) return res.status(512).send("Server error : " + err.message);
          if (m) {
            consoling.info({ key: "About to send SMS to  - " + notification.isParent, success: true, input: "Found " + m.students.length + " students", message: m.name + " " + m.code });
            m.students.forEach((_student: string) => {
              try {
                if (notification.isParent) {
                  Student.findById(_student).then(sss => {
                    console.log("Sending SMS to parents for " + sss.lastname);
                    sendSMSToParent(sss, announcement.message);
                  });
                }
                FCM.sendToUserSimple(_student, announcement.title, announcement.message).then(results => {
                  consoling.info({ key: 'h54gf33gh4wjjhg5vrfe54', success: true, input: _student, message: results });
                }).catch(ex => {
                  consoling.info({ key: 'h54gf33gh4wjjhg5vrfe54', success: false, input: _student, message: ex });
                });
              } catch (err) {
                consoling.info({ key: "About to send SMS to  - " + notification.isParent, success: false, input: _student, message: err.message });
              }
            });
          } else {
            Student.find({
              removed: false
            }).then(students => {
              if (students) {
                students.forEach((_student: StudentType) => {
                  if (notification.isParent) {
                    console.log("Sending SMS to parents for " + _student.lastname);
                    sendSMSToParent(_student, announcement.message);
                  }
                  FCM.sendToUserSimple(_student._id, announcement.title, announcement.message).then(results => {
                    consoling.info({ key: 'h54gf33gh4wjjhg5vweew54', success: true, input: _student, message: results });
                  }).catch(ex => {
                    consoling.info({ key: 'h54gf33gh4wjjhg5vweew54', success: false, input: _student, message: ex });
                  });
                });
              }
            })
          }
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

async function sendSMSToParent(student: StudentType, message: string) {
  if (student && student.parents && student.parents.length > 0) {
    const parent = student.parents.find(v => v.contactNumbers);
    if (parent) {
      try {
        consoling.info({ key: "About to send SMS to parent", success: true, input: parent.contactNumbers, message: message });
        console.log("Added send SMS To Parent " + student.lastname);
        await smsProvider.sendSMS(parent.contactNumbers, message);
      } catch (err) {
        consoling.info({ key: "Unable to send SMS SMS to parent", success: false, input: student.lastname + " " + student.firstname, message: err.message });
      }
    } else {
      consoling.info({ key: "Invalid SMS to parent", success: false, input: student.lastname + " " + student.firstname, message: "Student does not have a valid parent with contact numbers" });
    }
  } else {
    consoling.info({ key: "Invalid SMS to parent", success: false, input: student.lastname + " " + student.firstname, message: "Student does not have a valid parent with contact numbers" });
  }
}

export default router;