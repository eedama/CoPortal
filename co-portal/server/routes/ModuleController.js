var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

// import the models
import Module from "../models/Module";
//import Attachment from '../models/Attachment'
import LectureNote from "../models/LectureNote";
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import Solution from "../models/Solution";
import MarkSheet from "../models/MarkSheet";

/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/
router.get("/modules/all", function (req, res) {
  Module.find()
    .populate(["lecturers"])
    .populate(["students"])
    .populate(["questionaires"])
    .populate({
      path: 'notes',
      select: 'title description type date'
    })
    .then(modules => {
      if (modules == null)
        return res.status(512).send("No modules where found");

      res.json(modules);
    })
    .catch(err => {
      return res.status(512).send("Server error : " + err.message);
    });
});

router.get("/get/lecturer/notes/:notesID", function (req, res) {
  var notesID = req.params.notesID;
  LectureNote.findById(notesID).then(notes => {
      if (notes == null) return res.status(512).send("No notes where found");
      res.json(notes);
    })
    .catch(err => {
      return res.status(512).send("Server error : " + err.message);
    });
})

router.get("/modules/all/for/:userID/:userType", function (req, res) {
  var userID = req.params.userID;
  var userType = req.params.userType;

  Module.find()
    .populate(["lecturers"])
    .populate(["students"])
    .populate(["questionaires"])
    .populate({
      path: 'notes',
      select: 'title description type date'
    })
    .then(modules => {
      if (modules == null)
        return res.status(512).send("No modules where found");
      // TODO: to speed up ,,, add this on the find
      modules = modules.filter(m => userType == "ADMIN" || m.students.filter(s => s._id == userID).length > 0 || m.lecturers.filter(l => l._id == userID).length > 0);
      res.json(modules);
    })
    .catch(err => {
      return res.status(512).send("Server error : " + err.message);
    });
});


router.get("/marksheet/for/:userID/moduleID/:moduleID", function (req, res) {
  var userID = req.params.userID;
  var moduleID = req.params.moduleID;

  MarkSheet.find({
    moduleID,
    removed: false,
    studentMarks: {
      $elemMatch: {
        studentID: mongoose.Types.ObjectId(userID)
      }
    }
  }).then(markSheet => {
    markSheet.map(m => {
      return {
        _id: m._id,
        type: m.type,
        id: m.id,
        title: m.title,
        date: m.date,
        mark: m.studentMarks.filter(sm => sm.studentID == userID)[0],
        studentID: userID,
        lecturerID: m.lecturerID,
        moduleID: m.moduleID,
      };
    });
    return res.json(markSheet);
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });
});

router.get("/get/module/:moduleId", function (req, res) {
  var moduleId = req.params.moduleId;
  Module.findById(moduleId)
    .populate(["lecturers"])
    .populate(["students"])
    .populate(["questionaires"])
    .populate(["notes"])
    .then(module => {
      if (module == null) return res.status(512).send("Module was not found");
      res.json(module);
    })
    .catch(err => {
      return res.status(512).send("Server error : " + err.message);
    });
});

router.post("/add/new/module", function (req, res) {
  Module.findOne({
    name: req.body.module.name,
    code: req.body.module.code
  }).then(results => {
    if (results != null)
      return res
        .status(512)
        .send(
          `Module ${req.body.module.name}(${
            req.body.module.code
          }) already exist`
        );
    var module = new Module({
      _id: mongoose.Types.ObjectId(),
      name: req.body.module.name,
      code: req.body.module.code,
      description: req.body.module.description
    });

    module.save(function (err) {
      if (err) return res.status(512).send("Server error : " + err.message);
      Module.find()
        .populate(["lecturers"])
        .populate(["students"])
        .populate(["questionaires"])
        .populate(["notes"])
        .then(modules => {
          if (modules == null)
            return res.status(512).send("Server error : sadbbyjwyqduqwgyu");
          res.json(modules);
        });
    });
  });
});

router.post("/assign/to/lecturer/:lecturerID", function (req, res) {
  var lecturerID = req.params.lecturerID;

  var lecturerModules = new Array();

  req.body.modules.filter(m => m != null).map(m => {
    lecturerModules.push(mongoose.Types.ObjectId(m));
  });

  Lecturer.findById(lecturerID)
    .then(lecturer => {
      if (lecturer == null)
        return res.status(512).send("Lecturer was not found");
      Module.find({
          _id: {
            $in: lecturerModules
          }
        })
        .then(modules => {
          lecturerModules = modules
            .filter(m => lecturer.modules.filter(sm => sm == m._id).length == 0)
            .map(m => m._id);
          lecturer.modules.push(lecturerModules);
          lecturer.save(function (err) {
            if (err)
              return res.status(512).send("Server error : " + err.message);
            res.json(true);
          });
        })
        .catch(err => {
          console.log(err);
          return res.status(512).send("Server error : " + err.message);
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(512).send("Server error : " + err.message);
    });
});

router.post("/unassign/module/:moduleID/from/lecturer/:lecturerID", function (
  req,
  res
) {
  var lecturerID = req.params.lecturerID;
  var moduleID = req.params.moduleID;

  Lecturer.findById(lecturerID)
    .then(lecturer => {
      if (lecturer == null)
        return res.status(512).send("Lecturer was not found");
      Module.findById(moduleID)
        .then(module => {
          if (module == null)
            return res.status(512).send("Module was not found");
          var victim = lecturer.modules.find(m => m == moduleID);
          console.log("before " + lecturer.modules.length);
          console.log(victim);
          if (victim != null) {
            var index = lecturer.modules.indexOf(victim);
            console.log(index);
            lecturer.modules.splice(index, 1);
          }
          console.log("after " + lecturer.modules.length);
          lecturer.save(function (err) {
            if (err)
              return res.status(512).send("Server error : " + err.message);
            res.json(true);
          });
        })
        .catch(err => {
          console.log(err);
          return res.status(512).send("Server error : " + err.message);
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(512).send("Server error : " + err.message);
    });
});

router.post("/assign/to/student/:studentID", function (req, res) {
  var studentID = req.params.studentID;

  var studentModules = new Array();

  req.body.modules.filter(m => m != null).map(m => {
    studentModules.push(mongoose.Types.ObjectId(m));
  });

  Student.findById(studentID)
    .then(student => {
      if (student == null) return res.status(512).send("Student was not found");
      Module.find({
          _id: {
            $in: studentModules
          }
        })
        .then(modules => {
          studentModules = modules
            .filter(m => student.modules.filter(sm => sm == m._id).length == 0)
            .map(m => m._id);
          student.modules.push(studentModules);
          student.save(function (err) {
            if (err)
              return res.status(512).send("Server error : " + err.message);
            res.json(true);
          });
        })
        .catch(err => {
          console.log(err);
          return res.status(512).send("Server error : " + err.message);
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(512).send("Server error : " + err.message);
    });
});

router.post("/unassign/module/:moduleID/from/student/:studentID", function (
  req,
  res
) {
  var studentID = req.params.studentID;
  var moduleID = req.params.moduleID;

  Student.findById(studentID)
    .then(student => {
      if (student == null) return res.status(512).send("Student was not found");
      Module.findById(moduleID)
        .then(module => {
          if (module == null)
            return res.status(512).send("Module was not found");
          var victim = student.modules.find(m => m == moduleID);
          console.log("before " + student.modules.length);
          console.log(victim);
          if (victim != null) {
            var index = student.modules.indexOf(victim);
            console.log(index);
            student.modules.splice(index, 1);
          }
          console.log("after " + student.modules.length);
          student.save(function (err) {
            if (err)
              return res.status(512).send("Server error : " + err.message);
            res.json(true);
          });
        })
        .catch(err => {
          console.log(err);
          return res.status(512).send("Server error : " + err.message);
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(512).send("Server error : " + err.message);
    });
});

router.get(
  "/get/solution/id/for/:questionaireID/by/:userType/of/id/:userID",
  function (req, res) {
    var questionaireID = req.params.questionaireID;
    var userType = req.params.userType;
    var userID = req.params.userID;

    var studentID =
      userType == "LECTURER" || userType == "ADMIN" ? null : userID;
    var isMemo = userType == "LECTURER" || userType == "ADMIN";

    console.log(studentID + " " + isMemo);
    Solution.findOne({
        questionaireId: questionaireID,
        studentId: studentID,
        isMemo: isMemo
      })
      .then(solution => {
        if (
          solution == null &&
          (userType == "LECTURER" || userType == "ADMIN")
        ) {
          return res.status(512).send("No solution for this questionaire");
          return;
        } else if (solution == null) {
          res.json({
            id: null
          });
        } else {
          res.json({
            id: solution._id
          });
        }
      })
      .catch(err => {
        return res.status(512).send("Server error : " + err.message);
      });
  }
);

router.post(
  "/add/notes/title/:title/description/:description",
  function (req, res) {
    var title = req.params.title;
    var description = req.params.description;
    var file = req.body.file;
    var lecturerId = req.body.lecturerId == "ADMIN" ? null : req.body.lecturerId;
    var moduleId = req.body.moduleId;
    Module.findById(moduleId)
      .then(module => {
        if (module == null) new Error("Module does not exist");
        if (module.lecturers.indexOf(lecturerId) < 0 && lecturerId != null)
          new Error("Lecturer does not exist / Is not incharge of this module");

        var lecturerNote = new LectureNote({
          _id: mongoose.Types.ObjectId(),
          lecturerId: lecturerId, //ForeignKey
          moduleId: moduleId, //ForeignKey
          title: title,
          description: description,
          file: file,
          type: file.fileType
        });

        lecturerNote.save(function (err) {
          if (err) return res.status(512).send("Server error : " + err.message);
          module.notes.push(lecturerNote._id);
          module.save(function (err) {
            if (err) return res.status(512).send("Server error : " + err.message);
            res.json(lecturerNote._id);
          });
        });
      })
      .catch(err => {
        return res.status(512).send("Server error : " + err.message);
      });

  }
);

module.exports = router;