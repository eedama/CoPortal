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

router.get("/get/all", function(req, res) {
    Survey.find().then(surveys => {
        res.json(surveys);
    });
});

router.get("/get/all/surveyquestions", function(req, res) {
    SurveyQuestions.find().then(surveysQuestion => {
        res.json(surveysQuestion);
    });
});

router.post("/submit", function(req, res) {
    var user = req.body.user;
    var surveyAnswers = req.body.survey;

    var survey = new Survey();
    survey._id = mongoose.Types.ObjectId();
    survey.surveyAnswers = surveyAnswers;

    survey.name = user[0].Answer;
    survey.surname = user[1].Answer;
    survey.email = user[2].Answer;
    survey.area = user[3].Answer;

    if (!survey.name || survey.name.length < 2) return res.status(512).send("Please provide a valid name");
    if (!survey.surname || survey.surname.length < 2) return res.status(512).send("Please provide a valid surname");
    if (!survey.email || survey.email.length < 2 || survey.email.indexOf('@') < 1 || survey.email.indexOf('.') < 1) return res.status(512).send("Please provide a valid email address");

    survey.name = user[0].Answer.toLowerCase();
    survey.surname = user[1].Answer.toLowerCase();
    survey.email = user[2].Answer.toLowerCase();

    Survey.find({
        name: survey.name,
        surname: survey.surname,
        email: survey.email
    }).then(surveys => {
        if (surveys && surveys.length > 0) {
            return res.status(512).send("You have already submitted this survey");
        }
        survey.save((err) => {
            if (err) return res.status(512).send(err);
            res.send("Thank you , we got your survey");
        });
    });

});

module.exports = router;