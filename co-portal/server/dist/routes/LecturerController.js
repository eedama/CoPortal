"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Questionaire = require("../models/Questionaire");

var _Questionaire2 = _interopRequireDefault(_Questionaire);

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
    questions: req.body.questions,
    timeLimit: req.body.timeLimit
  });

  questionaire.save(function (err) {
    if (err) res.send(err);
    res.json(questionaire);
  });
});

module.exports = router;