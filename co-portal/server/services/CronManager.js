const cron = require("node-cron");
import helper from "../services/Helper";
import moment from "moment";
import FCM from "./FirebaseManager";
import mongoose from "mongoose";

import Notification from "../models/Notification";
import Student from "../models/Student";
import Lecturer from "../models/Lecturer";
import consoling from '../services/Logger';

const tasks = [];
const dailyTasks = [];
export default class CronJob {
    constructor() {
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
        consoling.info({key:'h523h4wrehrgewwfjjhg5vrfe54',input:payload,message:`Scheduled a job (${interval}) to ${registrationToken}`});
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
        tasks.push(task);
    }

    getTasks() {
        return tasks.map(m =>  m.status);
    }

    // This is called on app.js (everytime the server starts)
    fireJobs() {
        this.syncDailyTasks();
    }

    syncDailyTasks(){
        if(!dailyTasks.some(d => d == 'students-morning-text')){
            dailyTasks.push('students-morning-text');
            consoling.info({key:'students-morning-text',input:moment().toString(),message: "students-morning-text cron is set up"});
            let task = cron.schedule("00 23 * * 1-5", () => { // Rans every morning weekday at 9AM
                Student.find({
                    active:true
                }).then(students =>{
                    if(students != null){
                        var when = moment().add(1,'day').format("00 08 DD MM *"); // tomorrow at 8AM
                        var victims = students.filter(s => Math.random()*10 > 8);
                        if(victims){
                            for(var user of victims.filter(v => v && v.deviceTokens)){
                                try{
                                    var tokens = user.deviceTokens.filter(v => !v.removed && v.token).map(v => v.token);
                                    if (tokens) {
                                        var title = "Morning " + user.username ? user.username : "" + ", Have a productive day";
                                        var body = "Make use of our app to increase your productivity";
                                        const payload = helper.makePayload(title, body, {
                                            link: null,
                                            props: null
                                        });
                                        for (let i = 0; i < tokens.length; i++) {
                                            this.schedule(when,token[i],payload)
                                        }
                                    }
                                }catch(ex){ 
                                    consoling.info({key:'students-morning-text',input:user._id,message: ex});   
                                }
                            }
                        }
                    }
                })
            });
            tasks.push(task);
        }
    }
}