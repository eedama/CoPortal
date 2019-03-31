var master = {};

import {
    Couchbase
} from "nativescript-couchbase";
import {
    Feedback,
    FeedbackType,
    FeedbackPosition
} from "nativescript-feedback";
import API from "./http";
import store from "../store";
import {
    device,
    screen,
    isAndroid,
    isIOS
} from "tns-core-modules/platform";

var firebase = require("nativescript-plugin-firebase");

master.couchDB = new Couchbase("coportaldb");
master.feedback = new Feedback();
master.appSettings = require("application-settings");
master.firebase = firebase;
master.device_token = null;
master.store = store;
master.deviceInfo = {
    deviceType: device.deviceType,
    screen: {
        width: screen.mainScreen.widthDIPs,
        height: screen.mainScreen.heightDIPs,
        scale: screen.mainScreen.scale,
        widthPixels: screen.mainScreen.widthPixels,
        heightPixels: screen.mainScreen.heightPixels
    },
    model: device.model,
    manufacturer: device.manufacturer,
    /* uuid:device.uuid,
     */
    os: device.os,
    osVersion: device.osVersion,
    sdkVersion: device.sdkVersion,
    language: device.language
};

master.http = new API(store.state.settings.baseLink, master);

master.ChangeLog = {
    GetLogs: version => {
        return {
            version: "0.3",
            text: ``
        };
    }
};

master.initFCM = function (self) {
    return new Promise((resolve, reject) => {
        firebase
            .init({
                onMessageReceivedCallback: message => {
                    if(message.foreground){
                        console.log('message', message);
                        master.feedback.success({
                            title: message.title,
                            duration: 10000,
                            message: message.body,
                            onTap: () => {
                                if (message.data && message.data.link) {
                                    self.navigate(message.data.link, message.data.props);
                                }
                            }
                        });
                    }
                },
                onPushTokenReceivedCallback: token => {
                    master.appSettings.setString("device_token", token);
                    master.http.getAuthToken();
                    // master.http.getAuthToken();
                    master.device_token = token;
                }
            })
            .then(() => {
                if (master.appSettings.getString("device_token") == null) {
                    firebase.getCurrentPushToken().then(token => {
                        master.appSettings.setString("device_token", token);
                        master.device_token = token;
                    });
                }
                resolve(firebase);
            })
            .catch(err => {
                if (err.message.indexOf("already") >= 0) {
                    if (master.appSettings.getString("device_token") == null) {
                        firebase.getCurrentPushToken().then(token => {
                            console.log("push instance ..... ", token);
                            master.appSettings.setString("device_token", token);
                            master.device_token = token;
                        });
                    }
                    resolve(firebase);
                } else {
                    reject(err);
                }
            });
    });
};

export default master;