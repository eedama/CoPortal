"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Questionaire = require("../models/Questionaire");

var _Questionaire2 = _interopRequireDefault(_Questionaire);

var _Solution = require("../models/Solution");

var _Solution2 = _interopRequireDefault(_Solution);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var router = express.Router();


/*
  TODO: Get one student - DONE
        Get a list of them - DONE
        Search for a student - DONE
        Add a student
        Remove a student (Not to delete)
        Edit student details
        Login student
*/

router.post("/add/questionaire", function (req, res) {
  var questionaire = new _Questionaire2.default({
    _id: _mongoose2.default.Types.ObjectId(),
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
  var solution = new _Solution2.default({
    _id: _mongoose2.default.Types.ObjectId(),
    questionaireId: req.body.solution.id,
    isMemo: req.body.solution.isMemo,
    answers: req.body.solution.answers
  });

  solution.save(function (err) {
    if (err) res.send(err);
    res.json(solution);
  });
});

router.get("/all/questionaire", function (req, res) {

  _Questionaire2.default.find().then(function (questionaires) {
    // randomizeQuestions
    questionaires = shuffle(questionaires);
    questionaires.forEach(function (questionaire) {
      questionaire.questions = shuffle(questionaire.questions);
      questionaire.questions.forEach(function (question) {
        question.answers = shuffle(question.answers);
      });
    });
    res.json(questionaires);
  });
});

function shuffle(array) {
  var m = array.length,
      t,
      i;

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

module.exports = router;