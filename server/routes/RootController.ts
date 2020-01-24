import express from "express";
var router = express.Router();

import mongoose from "mongoose";
import FCM from "../services/FirebaseManager";
import CronJob from "../services/CronManager";
const cronJob = new CronJob();
import moment from "moment";

router.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let dbActive = "";
    let fcmID = null;
    let jobs = null;
    let serverName = null;
    let school = null;
    try {
        switch (mongoose.connection.readyState) {
            case 0:
                dbActive = 'disconnected'
                break;
            case 1:
                dbActive = 'connected'
                break;
            case 2:
                dbActive = 'connecting'
                break;
            case 3:
                dbActive = 'disconnecting'
                break;
        }
    } catch (ex) {

    }

    try {
        fcmID = FCM.getInstanceId();
    } catch (ex) {

    }

    try {
        jobs = cronJob.getTasks()
    } catch (ex) {

    }

    try {
        serverName = process.env.API_NAME;
    } catch (ex) {

    }

    try {
        school = process.env.SCHOOL;
    } catch (ex) {

    }

    var upTime = moment().subtract(process.uptime(), 'seconds').fromNow();

    res.json({
        api: true,
        serverName: serverName,
        db: dbActive,
        school: school,
        fcmId: fcmID,
        dateTime: new Date(),
        lastBuild: upTime,
        jobs
    });
});

export default router;
