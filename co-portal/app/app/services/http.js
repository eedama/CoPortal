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
        message: "Server error, please try again later"
      }
    }else {
      return true;
    }
  }

  getAuthToken() {
    return new Promise((resolve, reject) => {
      resolve();
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

  addUserDeviceToken(adminID, deviceToken) {
    return new Promise((resolve, reject) => {
      http
        .request(
          this.makePost("/a/device/token/add", {
            adminID: adminID,
            deviceToken: deviceToken,
            deviceInfo: this.master.deviceInfo
          })
        )
        .then(result => {
          var answer = this.handleResponse(result);
          if (answer) {
            resolve(result);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

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


  getStudentList() {
    return new Promise((resolve, reject) => {
      if (!userID) {
        reject(new Error("User Not Defined"));
      } else {
        http
          .request(this.makeGet("/s/students/all/"))
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
            return reject(new Error("Failed to retrieve studedents try again later"));
          });
      }
    })
  }

  getStudentTimetable(userID) {
    return new Promise((resolve, reject) => {
      if (!userID) {
        c
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

  getModuleQuestions(moduleID)
  {
    return new Promise((resolve, reject) => {
      if (!moduleID) {
        reject(new Error("Module not found"));
      } else {
        http
          .request(this.makeGet("/m/get/questionaire/solutions/for/module/" + moduleID))
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
  getQuizStudents(quizID)
  {
    return new Promise((resolve, reject) => {
      if (!quizID) {
        reject(new Error("Question"));
      } else {
        http
        .request(this.makeGet("/m/get/questionaire/solutions/for/all/students/" + quizID))
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
          return reject(new Error("Unable to retreive the questionaire marks , try again later"));
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
