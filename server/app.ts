import express from "express";
var path = require("path");
var fs = require('fs');
var favicon = require("express-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var winston = require('winston');
var expressWinston = require('express-winston');
require('winston-daily-rotate-file');

var app = express();
require('dotenv').config();

import mongoose from "mongoose";
import adminController from "./routes/AdminController";
import studentController from "./routes/StudentController";
import lecturerController from "./routes/LecturerController";
import moduleController from "./routes/ModuleController";
import accountController from "./routes/AccountController";
import notificationController from "./routes/NotificationController";
import surveyController from "./routes/SurveyController";
import rootController from "./routes/RootController";
import attendanceController from "./routes/AttendanceController";

import CronJob from './services/CronManager';
// view engine setup

app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger("dev"));
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({
    limit: "50mb"
}));
app.use(cookieParser());
app.use(function (req: express.Request, res: express.Response, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

mongoose
    .connect(`mongodb://${process.env.DB_ADDRESS}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`, {
        auth: {
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        useUnifiedTopology: true,
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 600, // Reconnect every 500ms
        dbName: process.env.DB_NAME
    })
    .then(answer => {
        console.log("Successfully connected to MONGO!");
        const cronJob = new CronJob();
        cronJob.fireJobs();
    });

const logDirectory = '/tmp/' + process.env.API_NAME + '-log/';
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: logDirectory + '/servererrors.log',
            level: 'error'
        }),
        new winston.transports.DailyRotateFile({
            dirname: logDirectory,
            filename: 'serverlogs-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ],
    format: winston.format.combine(
        winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "{{new Date()}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req: express.Request, res: express.Response) {
        return false;
    } // optional: allows to skip some log messages based on request and/or response
}));

app.use("/s", studentController);
app.use("/l", lecturerController);
app.use("/a", adminController);
app.use("/m", moduleController);
app.use("/acc", accountController);
app.use("/n", notificationController);
app.use("/survey", surveyController);
app.use("/attendance", attendanceController);
app.use("/", rootController);

/// catch 404 and forwarding to error handler
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    next({
        message: "Invalid Request",
        status: 404
    });
});

/// error handlers
app.use(function (err: { status: number, message: string }, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500).json(err);
});

if (process.env.MUST_HOST) {
    app.set('port', process.env.API_PORT);
    app.listen(app.get('port'), function () {
        console.log('############################################################################');
        console.log('############################################################################');
        console.log('############################################################################');
        console.log('##                                                                        ##');
        console.log('##                                                                        ##');
        console.log('##       Express server listening on port : ' + app.get('port'), process.env.API_NAME);
        console.log('##                                                                        ##');
        console.log('##                                                                        ##');
        console.log('############################################################################');
        console.log('############################################################################');
        console.log('############################################################################');
    });
} else {
    setTimeout(() => {
        console.log('############################################################################');
        console.log('############################################################################');
        console.log('############################################################################');
        console.log('##                                                                        ##');
        console.log('##                                                                        ##');
        console.log('##       BUILD SUCCESSFULL                                                ##');
        console.log('##                                                                        ##');
        console.log('##                                                                        ##');
        console.log('############################################################################');
        console.log('############################################################################');
        console.log('############################################################################');
        process.exit(0);
    }, 5000)
}

