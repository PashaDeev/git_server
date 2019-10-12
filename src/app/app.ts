import debugInit from 'debug';
import express, { Request, Response, NextFunction, Errback } from 'express';
import programm from 'commander';
import { join } from 'path';
import bodyParser from 'body-parser';
import MyErr from './routes/utils/Error';
import { readFileSync } from 'fs-extra';

import router from './routes/router';

const errorDebug = debugInit('err: ');
const debugApp = debugInit('app: ');

programm.option(`-d, --dir <name>`, 'dir for git repos');

programm.parse(process.argv);

const ROOT_DIR = programm.dir || join(__dirname, '..', '..', '..', 'git_repo_tester');
debugApp(`root dir ${ROOT_DIR}`);

const app = express();

app.get(`/`, async (req, res) => {
  const index = readFileSync(join(__dirname, 'views', 'main', 'index.html'));
  res.end(index);
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());

app.use(`/api/repos`, router(ROOT_DIR));

const ENOENT = 'ENOENT';
app.use((err: MyErr, request: Request, response: Response, next: NextFunction) => {
  errorDebug(err);
  if (err.code === ENOENT || err._code === ENOENT) {
    response.status(400).end();
  } else {
    response.status(500).end();
  }
  next();
});

export default app;
