import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
const keys = require("../data/g_suite_auth_key.json");

class EmailProvider {
    client: Mail
    constructor() {
        this.client = nodemailer.createTransport({
            service: "Gmail",
            secure: true,
            port: 465,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_ADDRESS,
                serviceClient: keys.client_id,
                privateKey: keys.private_key
            }
        });
    }

    sendEmail(to: string, subject: string, html: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.client.verify();
                await this.client.sendMail({
                    from: '"Coportal " <no-reply@jmrsquared.com>',
                    to: to,
                    subject: subject,
                    html: html
                });
                return resolve(true);
            } catch (err) {
                console.log(`Unable to send email: ${subject}`, err);
                return resolve(false);
            }
        });
    }
}

export default new EmailProvider();