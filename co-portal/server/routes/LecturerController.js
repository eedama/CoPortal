var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Questionaire from "../models/Questionaire";
import Solution from "../models/Solution";
import Lecturer from "../models/Lecturer";

/*
  TODO: Get one lecturer - DONE
        Get a list of them - DONE
        Search for a lecturer - DONE
        Add a lecturer
        Remove a lecturer (Not to delete)
        Edit lecturer details
        Login lecturer
*/

router.post("/add/questionaire", function (req, res) {
  var questionaire = new Questionaire({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    questions: req.body.questions,
    timeLimit: req.body.timeLimit
  });

  questionaire.save(function (err) {
    if (err) res.send(err);
    console.log(questionaire);
    res.json(questionaire);
  });
});

router.post("/submit/questionaire", function (req, res) {
  var solution = new Solution({
    _id: mongoose.Types.ObjectId(),
    questionaireId: req.body.solution.id,
    isMemo: req.body.solution.isMemo,
    answers: req.body.solution.answers
  });

  solution.save(function (err) {
    if (err) res.send(err);
    res.json(solution);
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
        from: req.body.from,
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
      res.statusCode = 402;
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
      res.statusCode = 402;
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
    res.statusCode = 400;
    res.send(err);
  });

});

router.get("/get/solutions/:solutionId", function (req, res) {
  var solutionId = req.params.solutionId;
  Solution.findById(solutionId).then(solution => {
    if (solution == null) res.send("Can not find that solution");
    console.log(solution);
    console.log(solutionId + " id");
    res.json(solution);
  }).catch(err => {
    res.statusCode = 404;
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

router.get("/lecturers/all", function (req, res) {
  Lecturer.find({
      "active": true
    })
    .populate(["rents"])
    .then(lecturers => {
      if (lecturers == null) res.send("Error : 9032rtu834g9erbo");
      res.json(lecturers);
    });
});

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
    res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Lecturer.findById(id).then(lecturer => {
      if (lecturer == null) {
        res.status(404);
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
    res.status(404);
    res.send("Cannot search for - " + txtSearch);
  } else {
    Lecturer.find({
      $text: {
        $search: new RegExp('^' + txtSearch + '$', "i")
      }
    }).then(answer => {
      if (answer == null || answer.length <= 0) {
        res.status(512).send("No results for : " + txtSearch);
      } else {
        res.json(answer);
      }
    });
  }
});
module.exports = router;