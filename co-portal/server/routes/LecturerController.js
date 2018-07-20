var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

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

router.post("/add/questionaire", function (req, res) {
  var questionaire = new Questionaire({
    _id: mongoose.Types.ObjectId(),
    questions: req.body.questions,
    timeLimit: req.body.timeLimit
  });

  questionaire.save(function (err) {
    if (err) res.send(err);
    res.json(questionaire);
  });
});

module.exports = router;