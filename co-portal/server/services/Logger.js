
var winston = require('winston');
var expressWinston = require('express-winston');
require('winston-daily-rotate-file');
var fs = require('fs');

class logger{
    constructor(){
        require('dotenv').config();
        var logDirectory = '/tmp/' + process.env.API_NAME + '-log/';
        try{
            if (!fs.existsSync(logDirectory)) {
                fs.mkdirSync(logDirectory);
            }    
        }catch(ex){
            // This is just to cater for my windows boys
            var path = require("path");
            logDirectory = path.join(__dirname, "tmp");
            if (!fs.existsSync(logDirectory)) {
                fs.mkdirSync(logDirectory);
            }
        }
        this.consoling = winston.createLogger({
            transports: [
                new winston.transports.DailyRotateFile({
                    dirname: logDirectory,
                    filename: 'console-log-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '14d'
                })],
            format: winston.format.combine(
                winston.format.json()
            )}
        );
        console.log("Logging at : " + logDirectory);
    }
}

export default new logger().consoling;

