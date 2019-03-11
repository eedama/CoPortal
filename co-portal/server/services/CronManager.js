const cron = require("node-cron");
import helper from "../services/Helper";
import FCM from "./FirebaseManager";
import mongoose from "mongoose";

import Notification from "../models/Notification";

export default class CronJob {
    constructor() {
        this.tasks = [];
    }

    schedule(
        interval,
        registrationToken,
        payload,
        toTopic = false,
        notificationID = null
    ) {
        console.log(
            "cron",
            `Scheduled a job (${interval}) to ${registrationToken}`
        );
        let task = cron.schedule(interval, () => {
            console.log("cron", "Performing the cron job....");
            if (toTopic) {
                FCM.sendToTopic(registrationToken, payload)
                    .then(v => {
                        if (notificationID) {
                            Notification.findById(notificationID)
                                .then(notification => {
                                    if (notification == null)
                                        throw "Scheduled notification does not exist (anymore) , " +
                                            notificationID;
                                    notification.status = "SENT";
                                    notification.save(function(err) {
                                        if (err)
                                            throw "Unable to save notification status change , " +
                                                err.message;
                                    });
                                })
                                .catch(err => {
                                    console.log("Notification status change", err);
                                });
                        }
                        console.log("cron", "Cron job done....");
                    })
                    .catch(err => {
                        console.log("cron", err);
                    });
            } else {
                FCM.sendToDevice(registrationToken, payload)
                    .then(v => {
                        if (notificationID) {
                            Notification.findById(notificationID)
                                .then(notification => {
                                    if (notification == null)
                                        throw "Scheduled notification does not exist (anymore) , " +
                                            notificationID;
                                    notification.status = "SENT";
                                    notification.save(function(err) {
                                        if (err)
                                            throw "Unable to save notification status change , " +
                                                err.message;
                                    });
                                })
                                .catch(err => {
                                    console.log("Notification status change", err);
                                });
                        }
                    })
                    .catch(err => {
                        console.log("cron", err);
                    });
            }
        });
        this.tasks.push(task);
    }

    getTasks() {
        return this.tasks;
    }

    // This is called on app.js (everytime the server starts)
    fireJobs() {
        //this.clearTargets();
    }

}