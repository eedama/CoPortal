const http = require("http");
import store from "../store";
var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";

export default class API {
    constructor(base, master) {
        this.baseUrl = base;
        this.master = master;
        this.auth_token = appSettings.getString("auth_token");
    }

    async handleResponse(result) {
        if (result.statusCode == 401) {
            try {
                appSettings.remove("UserToken");
                var token = await this.getAuthToken();
                return token;
            } catch (err) {
                this.master.feedback.warning({
                    title: "Access denied",
                    message: "Please contact admin."
                });
                return false;
            }
        } else if (result.statusCode == 512) {
            return {
                isError: true,
                message: result.content
            }
        } else if (result.statusCode == 503) {
            return {
                isError: true,
                message: "Server connection error, please contact admin"
            }
        } else {
            return true;
        }
    }

    getAuthToken() {
        return new Promise((resolve, reject) => {
            var isNewUser = true;
            var random = this.randomString() + "_" + Date.now();
            var user = appSettings.getString("UserToken");
            var adminID = appSettings.getString("CurrentUserID");
            if (!user) {
                user = {
                    email: random + "@jmrapp.com",
                    password: this.randomString(),
                    adminID: adminID,
                    device_token: appSettings.getString("device_token")
                };
                appSettings.setString("UserToken", JSON.stringify(user));
            } else {
                isNewUser = false;
                user = JSON.parse(user);
                if (!user.adminID && adminID) {
                    isNewUser = true;
                    user = {
                        email: random + "@jmrapp.com",
                        password: this.randomString(),
                        adminID: adminID,
                        device_token: appSettings.getString("device_token")
                    };
                    appSettings.setString("UserToken", JSON.stringify(user));
                }
            }
            console.log("New user", user);
            http
                .request(
                    this.makePost(isNewUser ? "/auth/register" : "/auth/login", {
                        user: user
                    })
                )
                .then(result => {
                    if (result.statusCode == 200) {
                        var _user = result.content.toJSON();
                        appSettings.setString("auth_token", _user.token);
                        resolve(_user.token);
                    } else if (result.statusCode == 512) {
                        appSettings.remove("auth_token");
                        appSettings.remove("UserToken");
                        throw new Error(result.content.toString());
                    } else {
                        throw new Error("Invalid response from the Auth provider");
                    }
                })
                .catch(err => {
                    console.log("error", err);
                    reject(err);
                });
        });
    }

    makeGet(url) {
        return {
            url: this.makeURL(url),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + appSettings.getString("auth_token"),
                CurrentUserID: appSettings.getString("CurrentUserID"),
                device_token: appSettings.getString("device_token")
            },
            method: "GET"
        };
    }

    makePost(url, content = {}) {
        return {
            url: this.makeURL(url),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + appSettings.getString("auth_token"),
                CurrentUserID: appSettings.getString("CurrentUserID"),
                device_token: appSettings.getString("device_token")
            },
            method: "POST",
            content: JSON.stringify(content)
        };
    }

    makeURL(url) {
        return this.baseUrl + url;
    }

    // All calls
    loginUser(username, password) {
        return new Promise((resolve, reject) => {
            if (!username || !password) {
                reject(new Error("User Unknown"));
            } else {
                http
                    .request(
                        this.makePost("/acc/login", {
                            username: username,
                            password: password
                        })
                    )
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Unable to log you in, try again later"));
                    });
            }
        });
    }

    sendLinkToResetPassword(username) {
        return new Promise((resolve, reject) => {
            if (!username) {
                return reject(new Error("Email Not Found"));
            } else {
                http
                    .request(
                        this.makePost("/acc/forgot/password", {
                            email: username,
                        })
                    )
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Can not process your request, try again later"));
                    });
            }
        });
    }

    getProfile(userID) {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makeGet("/s/" + userID + "/get"))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Can not load the requested profile,try again later"));
                    });
            }
        });
    }

    getModuleInformation(userID) {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makeGet("/m/modules/all/for/" + userID + "/student"))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Failed to retrieve modules try again later"));
                    });
            }
        })
    }

    getStudentTimetable(userID) {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makeGet("/s/timetable/for/" + userID + "/student"))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Failed to retrieve timetable please try again later"));
                    });
            }
        })
    }

    getModuleMarks(userID, moduleID) {
        return new Promise((resolve, reject) => {
            if (!userID || !moduleID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makeGet("/m/marksheet/for/" + userID + "/moduleID/" + moduleID))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        console.log(answer);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Can not retrieve marks at this time"));
                    });
            }
        })
    }

    submitQuiz(studentId, solution) {
        return new Promise((resolve, reject) => {
            if (!studentId || !solution) {
                reject(new Error("Invalid request"));
            } else {
                http
                    .request(this.makePost("/l/submit/questionaire", {
                        studentId,
                        solution
                    }))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Unable to submit your quiz, Try again later"));
                    });
            }
        })
    }

    getSolutions(solutionId) {
        return new Promise((resolve, reject) => {
            if (!solutionId) {
                reject(new Error("Invalid request"));
            } else {
                http
                    .request(this.makeGet("/l/get/solutions/" + solutionId))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Unable to retreive the solution , try again later"));
                    });
            }
        })
    }

    sendNotification(lectureID, type, moduleID, notification) {
        return new Promise((resolve, reject) => {
            if (!lectureID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makePost("/n/announcements/add/for/" + moduleID + "/by/" + type + "/of/id/" + lectureID, {
                        announcement: notification
                    }))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Can not load your notifications, Try again later"));
                    });


            }
        })
    }

    getLectureNotificationModule(lectureID, type, moduleID) {
        return new Promise((resolve, reject) => {
            if (!lectureID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makePost("/n/announcements/get/for/" + lectureID, {
                        userType: type,
                        moduleID: moduleID
                    }))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Can not load your notifications, Try again later"));
                    });
            }
        })
    }

    getStudentNotification(userID) {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject(new Error("User Not Defined"));
            } else {
                http
                    .request(this.makeGet("/n/announcements/get/all/for/student/" + userID))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer.isError) {
                                return reject(new Error(answer.message));
                            } else if (answer == true) {
                                return resolve(result.content);
                            } else {
                                return reject(new Error("Authorization error, please contact admin."));
                            }
                        }
                    })
                    .catch(err => {
                        return reject(new Error("Can not load your notifications, Try again later"));
                    });
            }
        })
    }

    getInternetStatus() {
        return connectivity.getConnectionType();
    }
}