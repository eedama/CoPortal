const nodemailer = require("nodemailer");

export default class EmailProvider {
    constructor() {
        var password = "coportal12@21"
        var email = "coportal.reports@gmail.com";
        nodemailer.createTestAccount().then(account => {
            this.client = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: email, // generated ethereal user
                    pass: password // generated ethereal password
                }
            });
        }).catch(err => {
            console.log("Unable to set up an email sender");
        });
    }

    sendEmail(to, subject, html) {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: '"Coportal " <no-reply@coportal.net>',
                to: to,
                subject: subject,
                html: html
            };

            this.client.sendMail(mailOptions).then(res => {
                return resolve(res);
            }).catch(err => {
                return reject(err);
            });
        })
    }
}