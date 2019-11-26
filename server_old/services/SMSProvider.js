const axios = require('axios');
const cron = require("node-cron");

class SMSProvider {
    constructor() {
        this.authToken = null;
        this.retries = [];
        this.refreshToken();
        cron.schedule("5 10,20 * * *", () => {
            this.refreshToken();
        })
    }

    refreshToken() {
        return new Promise((resolve, reject) => {
            axios({
                url: `https://rest.mymobileapi.com/v1/Authentication`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${process.env.SMS_REFRESH_TOKEN}`
                }
            }).then((result) => {
                if (result) {
                    this.authToken = result.data.token;
                    console.log(`Generated a new Token for the SMS sender : ${this.authToken}\n\n`);
                    return resolve(this.authToken);
                }
                console.log(`Could not generate a Token for the SMS sender\n\n`)
                return resolve(null);
            }).catch((err) => {
                console.log('Error : ', err);
                return resolve(null);
            })
        })
    }

    sendSMS(to, message) {
        return new Promise(async (resolve, reject) => {
            let messages = []
            if (typeof (to) == 'string') {
                to = [to];
            }
            if (to && to.length > 0) {
                messages = to.map(number => {
                    return {
                        'Content': message,
                        'Destination': number
                    }
                });
            }
            if (messages.length === 0) {
                return reject(new Error("Can not send SMS to no-one"));
            }
            console.log("Sending SMSs", messages);
            axios({
                url: `https://rest.mymobileapi.com/v1/bulkmessages`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                data: {
                    'Messages': messages
                }
            }).then((result) => {
                return resolve(result);
            }).catch((err) => {
                if (this.retries.filter(msg => msg === message).length > 3) {
                    console.log(`Error ${err.message}`);
                    console.log('Failed to send the sms');
                    this.retries = this.retries.filter(msg => msg !== message);
                    return reject(err);
                }
                setTimeout(async () => {
                    this.retries.push(message);
                    return resolve(this.sendSMS(to, message));
                }, this.retries.filter(msg => msg === message).length * 100);
            })
        })
    }
}

export default new SMSProvider();