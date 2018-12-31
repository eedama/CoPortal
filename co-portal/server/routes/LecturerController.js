var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Questionaire from "../models/Questionaire";
import Solution from "../models/Solution";
import Student from "../models/Student";
import Lecturer from "../models/Lecturer";
import Module from "../models/Module";
import MarkSheet from "../models/MarkSheet";
import Report from "../models/Report";

/*
  TODO: Get one lecturer - DONE
        Get a list of them - DONE
        Search for a lecturer - DONE
        Add a lecturer
        Remove a lecturer (Not to delete)
        Edit lecturer details
        Login lecturer
*/

router.get("/lecturers/all", function (req, res) {
  Lecturer.find({
      "active": true
    })
    .populate(["rents"])
    .populate(['modules'])
    .then(lecturers => {
      if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
      res.json(lecturers);
    });
});

router.get("/lecturers/of/ids/:lecturerIDs", function (req, res) {
  var lecturerIDs = req.params.lecturerIDs;
  if (!Array.isArray(lecturerIDs)) {
    lecturerIDs = [lecturerIDs];
  }
  console.log(lecturerIDs);

  lecturerIDs = lecturerIDs.map(l => mongoose.Types.ObjectId(l));

  Lecturer.find({
      "active": true,
      '_id': {
        $in: lecturerIDs
      }
    })
    .populate(["rents"])
    .populate(['modules'])
    .then(lecturers => {
      if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
      res.json(lecturers);
    });
});

router.post("/delete/:lecturerID", function (req, res) {
  var lecturerID = req.params.lecturerID;
  Lecturer.findById(lecturerID).then(lecturer => {
    lecturer.active = false;
    lecturer.removed = true;
    lecturer.save(function (err) {
      if (err) return res.status(512).send("Server error : " + err.message);
      res.send(lecturerID);
    })
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });

})

router.post("/add/questionaire", function (req, res) {
  var questionaire = new Questionaire({
    _id: mongoose.Types.ObjectId(),
    lecturerID: req.body.lecturerId,
    title: req.body.title,
    questions: req.body.questions,
    timeLimit: req.body.timeLimit,
    moduleID: req.body.moduleId
  });


  Lecturer.findById(questionaire.lecturerID).then(lecturer => {
    if (lecturer == null) return res.status(512).send("Lecturer does not exist");
    Module.findById(questionaire.moduleID).then(module => {
      if (module == null) return res.status(512).send("Module does not exist");
      if (module.lecturers.filter(l => l == req.body.lecturerId).length == 0) return res.status(512).send(lecturer.username + " is not a lecturer of " + module.name + " " + module.code);
      questionaire.save(function (err) {
        if (err) res.send(err);
        if (lecturer.questionaires == null) lecturer.questionaires = [];
        lecturer.questionaires.push(questionaire._id);
        lecturer.save(function (err) {
          if (err) res.send(err);
          if (module.questionaires == null) module.questionaires = [];
          module.questionaires.push(questionaire._id);
          module.save(function (err) {
            if (err) return res.status(512).send("Server error : " + err.message);
            console.log(questionaire);
            res.json(questionaire);
          });
        });
      });
    });
  })
});

router.post("/submit/questionaire", function (req, res) {
  var solution = new Solution({
    _id: mongoose.Types.ObjectId(),
    studentId: req.body.solution.isMemo ? null : req.body.studentId,
    questionaireId: req.body.solution.id,
    isMemo: req.body.solution.isMemo,
    answers: req.body.solution.answers
  });
  console.log(solution);

  if (!req.body.solution.isMemo) {
    solution.save(function (err) {
      if (err) res.send(err);
      Student.findById(req.body.studentId).then(student => {
        if (student == null) new Error("Student does not exist");
        student.solutions.push(solution._id);
        student.save(function (err) {
          if (err) return res.status(512).send("Server error : " + err.message);
          console.log(solution);
          res.json(solution);
        })
      }).catch(err => {
        return res.status(512).send("Server error : " + err.message);
      })
    });
  } else {
    solution.save(function (err) {
      if (err) return res.status(512).send("Server error : " + err.message);
      res.json(solution);
    });
  }
});

router.get("/get/solution/id/for/:questionaireId", function (req, res) {
  var questionaireId = req.params.questionaireId;
  Solution.findOne({
    questionaireId: questionaireId,
    isMemo: true
  }).then(solution => {
    if (solution == null) return res.status(512).send("No solution for this questionaire");
    res.json({
      id: solution._id
    });
  }).catch(err => {
    return res.status(512).send("Server error : " + err.message);
  });
});

router.post('/feedback/submit/:questionaireId', function (req, res) {
  var questionaireId = req.params.questionaireId;
  console.log("Submitting feedback " + questionaireId)
  Solution.findOne({
      questionaireId: questionaireId,
      isMemo: true
    })
    .then(s => {
      if (s == null) throw "Test does not have a memorandum";
      console.log(s.feedbacks);
      if (s.feedbacks == null) s.feedbacks = [];

      s.feedbacks.push({
        _id: mongoose.Types.ObjectId(),
        from: {
          id: req.body.fromId,
          name: req.body.from,
          type: req.body.fromType
        },
        message: req.body.message,
        date: req.body.date,
        status: 'sent'
      });

      s.save(function (err) {
        if (err) throw "Unable to save feedback";
        //var answer = s.feedbacks.filter(f => req.body.existingId.indexOf(f._id) < 0);
        res.json(s.feedbacks);
      });
    })
    .catch(err => {
      return res.statusCode = 402;
      res.send(err.message);
    });
});

router.get('/feedback/reload/:questionaireId', function (req, res) {
  var questionaireId = req.params.questionaireId;
  Solution.findOne({
      questionaireId: questionaireId,
      isMemo: true
    })
    .then(s => {
      if (s == null) throw "Test does not have a memorandum";

      if (s.feedbacks == null) s.feedbacks = [];
      //var answer = s.feedbacks.filter(f => req.body.existingId.indexOf(f._id) < 0);
      res.json(s.feedbacks);
    })
    .catch(err => {
      return res.statusCode = 402;
      console.log("Error " + err.message);
      res.send(err.message);
    });
});

router.get("/all/questionaire", function (req, res) {

  Questionaire.find().then(questionaires => {
    // randomizeQuestions
    questionaires = shuffle(questionaires);
    questionaires.forEach((questionaire) => {
      questionaire.questions = shuffle(questionaire.questions);
      questionaire.questions.forEach(question => {
        question.answers = shuffle(question.answers);
      });
    });
    res.json(questionaires);
  }).catch(err => {
    return res.statusCode = 400;
    res.send(err);
  });

});

router.get("/get/solutions/:solutionId", function (req, res) {
  var solutionId = req.params.solutionId;
  Solution.findById(solutionId).populate('studentId').then(solution => {
    if (solution == null) res.send("Can not find that solution");
    console.log(solution);
    console.log(solutionId + " id");
    res.json(solution);
  }).catch(err => {
    return res.statusCode = 404;
    res.send(err);
  });
});

function shuffle(array) {
  var m = array.length,
    t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

router.get("/lecturers/all/usernames", function (req, res) {
  Lecturer.find({
    "active": true
  }, "_id username").then(lecturers => {
    if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
    res.json(lecturers);
  });
});

router.get("/lecturers/all/fullnames", function (req, res) {
  Lecturer.find({
    "active": true
  }, "_id firstname lastname").then(lecturers => {
    if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
    res.json(lecturers);
  });
});

router.get("/:id/get", function (req, res) {
  let id = req.params.id;
  if (id == null) {
    return res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Lecturer.findById(id).then(lecturer => {
      if (lecturer == null) {
        return res.status(404);
        res.send("No lecturer with id : " + id);
      } else {
        res.json(lecturer);
      }
    });
  }
});

router.post("/:text/search", function (req, res) {
  let txtSearch = req.params.text;
  if (txtSearch == null || txtSearch.length < 2) {
    return res.status(404);
    res.send("Cannot search for - " + txtSearch);
  } else {
    Lecturer.find({
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

router.post("/sheet/add", function (req, res) {
  if (!req.body.markSheet.type || req.body.markSheet.type.length == 0) {
    req.body.markSheet.type = 'UNKNOWN';
  }
  if (!req.body.markSheet.date) {
    req.body.markSheet.date = Date.now();
  }
  var markSheet = new MarkSheet({
    _id: mongoose.Types.ObjectId(),
    id: req.body.markSheet.id,
    title: req.body.markSheet.title,
    total: req.body.markSheet.total,
    type: req.body.markSheet.type.toUpperCase(),
    date: req.body.markSheet.date
  });

  // lecturerID
  // moduleID
  Lecturer.findById(req.body.markSheet.lecturerID).then(lecturer => {
    if (lecturer == null)
      return res.status(512).send("Lecturer was not found");
    Module.findById(req.body.markSheet.moduleID).then(_module => {
      if (_module == null) return res.status(512).send("Module was not found");
      var victim = lecturer.modules.find(m => m == req.body.markSheet.moduleID);
      if (!victim) return res.status(512).send("Lecturer is not incharge of this module");
      markSheet.lecturerID = req.body.markSheet.lecturerID;
      markSheet.moduleID = req.body.markSheet.moduleID;
      markSheet.save(function (err) {
        if (err)
          return res.status(512).send("Server error : " + err.message);
        res.json(markSheet);
      });
    });
  });
});

router.get("/sheet/get/all/for/:lecturerID", function (req, res) {
  var lecturerID = req.params.lecturerID;
  MarkSheet.find({
    lecturerID: lecturerID
  }).then(sheets => {
    if (sheets == null) return res.status(512).send("Lecturer does not have any marksheets");
    res.json(sheets);
  }).catch(err => {
    return res.status(512).send("Server error: " + err.message);
  });
});

router.post("/sheet/update/mark/by/:lecturerID", function (req, res) {
  var lecturerID = req.params.lecturerID;
  var sheetID = req.body.markSheetID;
  var studentID = req.body.studentID;
  var mark = req.body.mark;
  MarkSheet.findById(sheetID).then(sheet => {
    if (sheet == null || sheet.lecturerID != lecturerID) return res.status(512).send("Marksheet does not exist");
    if (sheet.studentMarks.filter(s => s.studentID == studentID).length == 0) {
      sheet.studentMarks.push({
        studentID,
        mark
      })
    } else {
      sheet.studentMarks.filter(s => s.studentID == studentID)[0].mark = mark;
    }
    sheet.save(function (err) {
      if (err)
        return res.status(512).send("Server error : " + err.message);
      res.json(sheet);
    });
  }).catch(err => {
    return res.status(512).send("Server error: " + err.message);
  });
});

router.post("/report/student", function (req, res) {
  var lecturerID = req.params.lecturerID;
  var subject = req.body.subject;
  var studentID = req.body.studentID;
  var message = req.body.message;
  var method = req.body.method && req.body.method.toUpperCase();

  var report = new Report();
  report.studentId = studentID;
  report.lecturerId = lecturerID;
  report.method = method;
  report.subject = subject;
  report.message = message;

  report.save(function (err) {
    if (err) return res.status(512).send("Unable to save report ");
    // Will call a service to send the SMS/Email here.
    return res.send("Report successfully saved");
  });
});
module.exports = router;