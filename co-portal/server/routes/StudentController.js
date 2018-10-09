var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Student from "../models/Student";
import Module from "../models/Module";
import Questionaire from "../models/Questionaire";

/*
  TODO: Get one student - DONE
        Get a list of them - DONE
        Search for a student - DONE
        Add a student
        Remove a student (Not to delete)
        Edit student details
        Login student
*/

router.post("/delete/:studentID", function (req, res) {
  var studentID = req.params.studentID;
  Student.findById(studentID).then(student => {
    student.active = false;
    student.removed = true;
    student.save(function (err) {
      if (err) return res.status(512).send("Server error : " + err.message);
      res.send(studentID);
    })
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });

});

router.get("/students/all", function (req, res) {
  Student.find({
      "active": true
    })
    .populate(["rents"])
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/for/module/:moduleID", function (req, res) {
  var moduleID = req.params.moduleID;
  Module.findById(moduleID).then(m => {
    if (m == null)
      return res.status(512).send("Module does not exist");

    Student.find({
        "active": true,
        "modules": moduleID
      })
      .populate(['modules'])
      .then(students => {
        if (students == null) res.send("Server error : Try again later");
        res.json(students);
      }).catch(err => {
        return res.status(512).send("Server error : " + err.message);
      });
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });

});

router.get("/students/of/ids/:studentIDs", function (req, res) {
  var studentIDs = req.params.studentIDs;
  if (!Array.isArray(studentIDs)) {
    studentIDs = [studentIDs];
  }
  console.log(studentIDs);

  studentIDs = studentIDs.map(l => mongoose.Types.ObjectId(l));

  Student.find({
      "active": true,
      '_id': {
        $in: studentIDs
      }
    })
    .populate(["rents"])
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/usernames", function (req, res) {
  Student.find({
      "active": true
    }, "_id username")
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/fullnames", function (req, res) {
  Student.find({
      "active": true
    }, "_id firstname lastname")
    .populate(['modules'])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get('/all/past/tests/for/:studentId', function (req, res) {
  var studentId = req.params.studentId;
  Student.findById(studentId).populate('solutions').then(s => {
    if (s == null) return res.status(512).send("Student not found");
    console.log(s);
    var answer = [];
    s.solutions.forEach(solution => {
      Questionaire.findById(solution.questionaireId).then(q => {
        console.log(q);
        if (q != null) {
          answer.push({
            solutionId: solution._id,
            title: q.title,
            mark: solution.mark + '/' + solution.answers.length,
            date: solution.date
          })
          console.log(answer);
          res.json(answer);
        } else {
          return res.status(512).send("Server error : questionaire does not exist");
        }
      });
    });
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });
});


router.get("/:id/get", function (req, res) {
  let id = req.params.id;
  if (id == null) {
    return res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Student.findById(id)
      .populate(['modules'])
      .then(student => {
        if (student == null) {
          return res.status(404);
          res.send("No student with id : " + id);
        } else {
          res.json(student);
        }
      });
  }
});

/**
 * POST methods
 */

router.post("/:text/search", function (req, res) {
  let txtSearch = req.params.text;
  if (txtSearch == null || txtSearch.length < 2) {
    return res.status(404);
    res.send("Cannot search for - " + txtSearch);
  } else {
    Student.find({
      $text: {
        $search: new RegExp('^' + txtSearch + '$', "i")
      }
    }).then(answer => {
      if (answer == null || answer.length <= 0) {
        return res.status(512).send("No results for : " + txtSearch);
      } else {
        res.json(answer);
      }
    });
  }
});

module.exports = router;