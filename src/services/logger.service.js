const winston = require('winston');

const dotenv = require('dotenv');
dotenv.config();

// date + logger level + message
const dateFormat = () => {
  return new Date(Date.now()).toLocaleString();
};

class LoggerService {

    dateFormat (){
        return new Date(Date.now()).toLocaleString();
      };

  constructor(route) {
    this.route = route;
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.printf(
        (info) => `${this.dateFormat()} | ${info.level.toUpperCase()} | ${info.message} | ${info.obj ? `DATA: ${JSON.stringify(info.obj)} | ` : ''}`
      ),
      transports: [
       new winston.transports.Console(),
        new winston.transports.File({ filename: `${process.env.LOG_FILE_PATH}/${route}.log` }),
      ],
    });
    this.logger = logger;
  }

  async info(message, obj) {
    if (obj) {
      this.logger.log('info', message, { obj });
    } else {
      this.logger.log('info', message);
    }
  }

  async error(message, obj) {
    if (obj) {
      this.logger.log('error', message, { obj });
    } else {
      this.logger.log('error', message);
    }
  }

  async debug(message, obj) {
    if (obj) {
      this.logger.log('debug', message, { obj });
    } else {
      this.logger.log('debug', message);
    }
  }
}

module.exports = LoggerService;
// const winston = require('winston');

// // تكوين الـ logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'requests.log' })
//   ]
// });

// // تصدير الـ logger
// module.exports = logger;