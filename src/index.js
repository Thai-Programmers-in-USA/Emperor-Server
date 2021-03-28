const appName = require('./../package').name;
const express = require('express');
const cors = require('cors');
const log4js = require('log4js');
const http = require('http');

const app = express();
const server = http.createServer(app);

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info';

// INFO Register middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// INFO Status route (will be moved to its file)
app.use('/status', (req, res, next) => {
  res.status(200).send('Server is running');
});

// INFO Register all routes
require('./routes')(app, server);

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.msg = error.message || 'Internal server errors'
  logger.error("Something went wrong:", error);
  res.status(error.statusCode).json({ error: error });
});

const PORT = process.env.PORT || 3000;

init = async function () {
  try {
    const db = require('./models/index');
    const connection = await db();
    if (!connection) {
      throw new Error('Connection to DB errors');
    }
    logger.info('is successfully connected to the DB');

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'testLocal')
      app.listen(PORT, function () {
        logger.info(`emperor-backend listening on http://localhost:${PORT}`);
      });

    return app;
  } catch (err) {
    throw err;
  }
};

init();

module.exports = init;
