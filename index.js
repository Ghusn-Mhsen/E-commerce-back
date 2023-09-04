const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const paypalConfiguration = require('./src/config/Payment/PayPal');
const LoggerService = require('./src/services/logger.service');
const loggerInfoApp = new LoggerService('info');
const loggerErrorApp = new LoggerService('error');
const mongoDB = require('./src/databases/mongodb/database');
const {loadData, testModel} = require('./src/middlewares/recSys/recommandationSystem');
const web3Controller = require('./src/controllers/Web3Controller/web3Controller.Js');


const PORT =  3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
 
  const originalSend = res.json;
  res.json = function (body) {
    const urlPath = req.url.substring(6);
    const message = `Request ${req.method} received with status [ ${res.statusCode} ] on ( ${urlPath} )`;
    loggerInfoApp.info(message, body.data);
    originalSend.call(res, body);
  };
  next();
});

app.use('/',require('./src/routes'))


// Error handling middleware
app.use((err, req, res, next) => {
  const urlPath = req.url.substring(6);
  loggerErrorApp.error(`Request ${req.method} received on ( ${urlPath} )`, {
    message: 'Unhandled error',
    error: err,
    stack: err.stack,
  });
  res.status(500).json({message:'Something went wrong!',status:false,error:err.toString()});
});

// Unhandled rejection handling
process.on('unhandledRejection', (reason, promise) => {
  loggerErrorApp.error('Unhandled rejection', {
    reason: reason,
    promise: promise,
  });
});

// Uncaught exception handling
process.on('uncaughtException', (error) => {
  loggerErrorApp.error('Unhandled exception', {
    error: error,
    stack: error.stack,
  });
  process.exit(1);
});




loadData().then(async () => {

  
  

   app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  

  
    
  })
  .catch((error) => {
    console.error('Error training the recommendation model:', error);
  });

