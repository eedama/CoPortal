var admin = require("firebase-admin");
import helper from '../services/Helper';

var serviceAccount = require("../firebase_service_account.json");

var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coportal-a770a.firebaseio.com"
});

var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
import Admin from '../models/Admin';
import Lecturer from '../models/Lecturer';
import Student from '../models/Student';

class FCM {
    getInstanceId() {
        try {
            return app.options.databaseURL;
        } catch (ex) {
            return null;
        }
    }

    sendToUser(adminID, title, body, link = '/', props = '') {

        const payload = helper.makePayload(title, body, {
            link: link,
            props: props
        });
        return this.sendToUser(adminID, payload);
    }

    sendToUser(adminID, payload) {
        return new Promise(async (resolve, reject) => {
            try {

                var user = await Admin.findById(adminID);
                if (user == null) {
                    user = await Lecturer.findById(adminID)
                    if (user == null) {
                        user = await Student.findById(adminID);
                        if (user == null) {
                            return reject("User of id " + adminID + " not found");
                        }
                    }
                }

                var tokens = user.deviceTokens.filter(v => !v.removed).map(v => v.token);
                if (tokens) {
                    for (let i = 0; i < tokens.length; i++) {
                        await this.sendToDevice(tokens[i], payload);
                    }
                    return resolve("Notification will be sent to " + tokens.length + " devices");
                } else {
                    return reject("User has no device");
                }
            } catch (err) {
                return reject(err);
            }
        });
    }

    sendToDevice(registrationToken, payload) {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .sendToDevice(registrationToken, payload, options)
                .then(function (response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(async function (error) {
                    if (error.filter && error.filter(e => JSON.stringify(e.error).indexOf("The provided registration token is not registered") >= 0)) {
                        var _admin = await Admin.findOne({
                            deviceTokens: {
                                $elemMatch: {
                                    token: registrationToken
                                }
                            }
                        });
                        if (_admin == null) {
                            _admin = await Lecturer.findOne({
                                deviceTokens: {
                                    $elemMatch: {
                                        token: registrationToken
                                    }
                                }
                            })
                            if (_admin == null) {
                                _admin = await Student.findOne({
                                    deviceTokens: {
                                        $elemMatch: {
                                            token: registrationToken
                                        }
                                    }
                                });
                                if (_admin == null) {
                                    return;
                                }
                            }
                        }
                        _admin.deviceTokens.forEach(deviceToken => {
                            if (deviceToken.token == registrationToken) {
                                deviceToken.removed = true;
                                deviceToken.dateRemoved = new Date();
                                _admin.save(function (err) {
                                    if (err) return reject(err);
                                    return resolve({
                                        message: "Token has expired , we unlinked it , " + registrationToken
                                    });
                                });
                            }
                        })
                    } else {
                        return reject(error);
                    }
                });
        });
    }

    sendToTopic(topic, payload) {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .sendToTopic(topic, payload)
                .then(function (response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function (error) {
                    return reject(error);
                });
        });
    }

    subscribeToTopic(registrationToken, topic) {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .subscribeToTopic(registrationToken, topic)
                .then(function (response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function (error) {
                    return reject(error);
                });
        });
    }

    subscribeToTopic(registrationToken, topic) {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .subscribeToTopic(registrationToken, topic)
                .then(function (response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function (error) {
                    return reject(error);
                });
        });
    }
};

export default new FCM();