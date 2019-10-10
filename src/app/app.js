import debugInit from 'debug';

const express = require(`express`);
const programm = require(`commander`);
const fs = require(`fs-extra`);
const path = require(`path`);
const bodyParser = require('body-parser');
const { router } = require(`./routes`);

const errorDebug = debugInit('err: ');

programm.option(`-d, --dir <name>`, 'dir for git repos');

programm.parse(process.argv);

const ROOT_DIR = programm.dir || path.join(__dirname, '..', '..', `git_repo_tester`);
console.log(`-------------------------`);
console.log(`root`, ROOT_DIR);
console.log(`-------------------------`);
const app = express();

app.get(`/`, async (req, res) => {
  // const fileData = await fs.readFile(path.join(__dirname, `views/main/index.html`));
  res.json({ text: 'fi' });
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());

app.use(`/api/repos`, router(ROOT_DIR));

const ENOENT = 'ENOENT';
app.use((err, request, response, next) => {
  errorDebug(err);
  if (err.code === ENOENT) {
    response.status(400).end();
  } else {
    response.status(500).end();
  }
  next();
});

module.exports = app;
