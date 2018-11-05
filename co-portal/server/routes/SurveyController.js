var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Survey from "../models/Survey";
import SurveyQuestions from "../models/SurveyQuestions";

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get("/get/all", function (req, res) {
  Survey.find().then(surveys => {
    res.json(surveys);
  });
});

router.get("/get/all/surveyquestions", function (req, res) {
  SurveyQuestions.find().then(surveysQuestion => {
    res.json(surveysQuestion);
  });
});

router.post("/submit", function (req, res) {
  var user = req.body.user;
  var surveyAnswers = req.body.survey;

  var survey = new Survey();
  survey._id = mongoose.Types.ObjectId();
  survey.surveyAnswers = surveyAnswers;

  survey.name = user[0].Answer;
  survey.surname = user[1].Answer;
  survey.email = user[2].Answer;
  survey.area = user[3].Answer;

  survey.save((err) => {
    if (err) return res.status(512).send(err);
    res.send("Thank you , we got your survey");
  });

});

module.exports = router;