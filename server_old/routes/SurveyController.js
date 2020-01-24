var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
// import the models
import Module from "../models/Module";
import Survey from "../models/Survey";
import SurveyQuestions from "../models/SurveyQuestions";
import SurveyTemplates from "../models/SurveyTemplates";
import Attendance from "../models/Attendance";
import moment from "moment";

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get("/get/templates/for/:moduleId", async function (req, res) {
    const moduleId = req.params.moduleId;

    try {
        const m = await Module.findById(moduleId);
        if (!m) throw new Error('The module you entered does not exist')
    } catch (err) {
        return res.status(512).send("The module you entered does not exist");
    }

    SurveyTemplates.find({
        moduleId
    }, "-questions").then(templates => {
        if (!templates) templates = [];
        res.json(templates);
    });
});

router.get("/get/surveys/for/:moduleId", async function (req, res) {
    const moduleId = req.params.moduleId;

    try {
        const m = await Module.findById(moduleId);
        if (!m) throw new Error('The module you entered does not exist')
    } catch (err) {
        return res.status(512).send("The module you entered does not exist");
    }

    Survey.find({
        moduleId
    }, "-students")
        .populate("surveyTemplateId", "-questions")
        .then(surveys => {
            if (!surveys) surveys = [];
            return res.json(surveys.reverse());
        });
});

router.get("/get/latest/survey/for/:moduleId", async function (req, res) {
    const moduleId = req.params.moduleId;

    try {
        const m = await Module.findById(moduleId);
        if (!m) throw new Error('The module you entered does not exist')
    } catch (err) {
        return res.status(512).send("The module you entered does not exist");
    }

    Survey.findOne({
        moduleId
    }, "-students", { sort: { date: -1 } })
        .populate("surveyTemplateId")
        .then(survey => {
            if (survey && survey.surveyTemplateId && moment().diff(survey.date, 'days') < 1) {
                return res.json(survey);
            }
            return res.status(512).send("This module has no survey for today.");
        });
});

router.get("/get/survey/questions/for/:surveyId", async function (req, res) {
    const surveyId = req.params.surveyId;

    Survey.findById(surveyId)
        .populate("surveyTemplateId", "title")
        .populate("students.studentId", "username lastname firstname")
        .then(survey => {
            return res.json(survey);
        });
});

router.post("/submit/:surveyId", async function (req, res) {
    const surveyId = req.params.surveyId;
    const studentId = req.body.studentId;
    const answers = req.body.answers;

    Survey.findById(surveyId).then(async survey => {
        if (!survey) return res.status(512).send('Unable to find survey ,please try again');
        const attendance = await Attendance.findById(survey.attendanceId)
        if (!attendance) return res.status(512).send('Unable to find attendance linked to this survey ,please try again');
        if (!attendance.students) attendance.students = [];
        try {
            attendance.students = attendance.students.filter(v => v && v.studentId != studentId);
            attendance.students.push({
                studentId,
                date: new Date()
            })
            await attendance.save();
            if (!survey.students) survey.students = [];
            survey.students = survey.students.filter(v => v && v.studentId != studentId);
            survey.students.push({
                studentId,
                date: new Date(),
                answers
            });
            await survey.save();
            return res.send("Your survey was submitted successfully");
        } catch (err) {
            return res.status(512).send('Unable to submit your survey ,please try again');
        }
    })
});

router.post("/create/survey/template/for/:moduleId", async function (req, res) {
    const moduleId = req.params.moduleId;
    const surveyT = req.body.surveyTemplate;

    try {
        const m = await Module.findById(moduleId);
        if (!m) throw new Error('The module you entered does not exist')
    } catch (err) {
        return res.status(512).send("The module you entered does not exist");
    }

    const surveryTemplate = new SurveyTemplates({
        moduleId,
        title: surveyT.title,
        lecturerId: surveyT.lecturerId,
        questions: surveyT.questions
    });

    surveryTemplate.save(function (err) {
        if (err) return res.status(512).send('Unable to create survey template,please try again');
        return res.send('Survey template successfully created');
    });
});

router.post("/activate/survey/for/:surveyTemplateId", async function (req, res) {
    const surveyTemplateId = req.params.surveyTemplateId;

    try {
        let expireDate = moment().add(1, 'days');
        const surveyTemplate = await SurveyTemplates.findById(surveyTemplateId);
        const attendance = new Attendance({
            _id: mongoose.Types.ObjectId(),
            code: generateCode(12),
            moduleId: surveyTemplate.moduleId,
            expireDate,
            lecturerId: surveyTemplate.lecturerId
        });

        await attendance.save();

        const survey = new Survey({
            _id: mongoose.Types.ObjectId(),
            surveyTemplateId,
            moduleId: surveyTemplate.moduleId,
            attendanceId: attendance._id,
            students: []
        });

        survey.save(function (err) {
            if (err) return res.status(512).send('Unable to active survey,please try again');
            return res.send('Survey successfully activated');
        });
    } catch (err) {
        console.log(err.message)
        return res.status(512).send("Unable to active your survey, please try again later");
    }
});

router.post("/submit", function (req, res) {
    res.status(512).send("Depreciated method");
});

function generateCode(length) {
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    if (!length || length < 0) length = 5;
    let code = '';
    for (let i = 0; i < length; i++) {
        code += alphabets[(Math.random() * (alphabets.length - 1)).toFixed()];
    }
    return code;
}

module.exports = router;