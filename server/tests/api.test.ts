export { };
import mocha from 'mocha';
import smsProvider from "../services/SMSProvider"
import emailProvider from "../services/EmailProvider"
require('dotenv').config();

describe('Test sending EMAIL', () => {
    it('responds with json', async () => {
        // return emailProvider.sendEmail("mulavhe@gmail.com", `Coportal - ${process.env.COPORTAL_DEV}`, `Running a ${process.env.NODE_ENV} Travis test \n\n ${new Date()}`);
        return {}
    });
})

describe('Test sending SMS', () => {
    it('responds with json', async () => {
        // return smsProvider.sendSMS('+27760487292', `Running a Coportal ${process.env.NODE_ENV} Travis test \n\n ${new Date()}`);
        return {}
    });
})
