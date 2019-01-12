const nodemailer = require("nodemailer");

export default class EmailProvider {
    constructor() {
        nodemailer.createTestAccount().then(account => {
            this.client = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass // generated ethereal password
                }
            });
        }).catch(err => {
            console.log("Unable to set up an email sender");
        });
    }

    sendEmail(to, subject, message) {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: '"Coportal " <no-reply@coportal.net>',
                to: to,
                subject: subject,
                text: message
            };

            this.client.sendMail(mailOptions).then(res => {
                return resolve(res);
            }).catch(err => {
                return reject(err);
            });
        })
    }
}