const appName = require('./../package').name;
const express = require('express');
const cors = require('cors');
const log4js = require('log4js');
const app = express();

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info';

// INFO Register middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/status', (req, res, next) => {
  res.status(200).send('Server is running');
});

const PORT = process.env.PORT || 3000;

const init = async function () {
  try {
    const db = require('./models/index');
    console.log(db);
    const connection = await db();
    if (!connection) {
      throw new Error('Connection to DB errors');
    }
    logger.info('is successfully connected to the DB');

    const port = process.env.PORT || 3000;
    app.listen(port, function () {
      logger.info(`emperor-backend listening on http://localhost:${port}`);
    });
  } catch (err) {
    throw err;
  }
};

init();
