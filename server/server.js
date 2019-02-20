import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import logger from './core/logger';
import config from './core/config/config.dev';
import initRoutes from './routes';
import connectToDb from './core/db/connect';
import initUser from './core/db/seed';
import { response } from './utils/common'

const host = config.serverHost;
const port = config.serverPort;

connectToDb();
initUser();

const app = express();
const server = http.Server(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message)
  }
}));

// http://localhost:8000/api
initRoutes(app);

// Index route
app.get('/', (req, res) => {
  res.send('Node API');
});

app.use((err, req, res, next) => {
  if (err) {
    if (err.isJoi) {
      console.log('errror: ', err)
      res.status(400).send(
        response(false, err.details[0].message)
      );
    } else if (err.name==='CastError' && err.kind==='ObjectId') {
      res.status(404).send(
        response(false, 'Can\'t find the ' + err.model.modelName.toLowerCase())
      );
    } else {
      res.status(err.status || 500).send(err);
    }
  } else {
    next();
  }
});

server.listen(port, host, () => {
  logger.info(`express server is running on ${host}:${port}`);
});
