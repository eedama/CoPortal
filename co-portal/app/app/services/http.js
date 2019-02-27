const http = require("http");
import store from "../store";
var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";

export default class API {

    async handleResponse(result) {
        if (result.statusCode == 401) {
            try {
                appSettings.remove("UserToken");
                var token = await this.getAuthToken();
                return token;
            } catch (err) {
                this.master.feedback.warning({
                    title: "Access denied",
                    message: err.message
                });
                return false;
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
    adminLogin(user) {
        return new Promise((resolve, reject) => {
            if (this.getInternetStatus() == connectivity.connectionType.none) {
                this.master.feedback.warning({
                    title: "No internet connection",
                    duration: 4000,
                    message: "Please connect to the internet to login."
                });
                reject(new Error("No internet connection."));
            } else {
                http
                    .request(this.makePost("/a/login", user))
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer == true) {
                                resolve(result);
                            } else {
                                return this.adminLogin(user);
                            }
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    }


    getInternetStatus() {
        return connectivity.getConnectionType();
    }



}