var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Questionaire from "../models/Questionaire";
import Solution from "../models/Solution";

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

module.exports = router;