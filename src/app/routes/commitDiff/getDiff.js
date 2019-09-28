const util = require(`util`);
const childProcess = require(`child_process`);
const execFile = util.promisify(childProcess.execFile);
const { err: errorDebug } = require(`../../debug`);
const pump = require(`pump`);
const { spawn } = require(`child_process`);
const Transform = require(`stream`).Transform;
const debug = require(`debug`)(`router: `);


async function getCommitDiff(directory, commitHash, response, promise) {
  const parser = new Transform();
  parser._transform = function(data, encoding, done) {
    const res = data
      .toString()
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");

    const chunk = {
      raw: res
    };
    this.push(`${JSON.stringify(chunk)},`);
    done();
  };
  parser._flush = function (done) {
    this.push(`${JSON.stringify({"raw": ""})}`);
    done();
  };
  try {
    response.write(`{ "code": 200, "msg": [ `);
    const childProcess = spawn(`git`, [`diff`, commitHash, `${commitHash}~`], {
      cwd: `${directory}.git`
    });
    pump(
      childProcess.stdout,
      parser,
      response
    );
    childProcess.stdout.on(`end`, () => {
      response.write(`]}`)
    });
    childProcess.stderr.on(`error`, err => {
      console.log(`-------------------------`);
      console.log(`err`, err);
      console.log(`-------------------------`);
    });
  } catch (err) {
    if (err.code === `ENOENT`) {
      errorDebug(`no directory`);
      return await response.json({ code: 400, msg: `no directory` });
    }
    errorDebug(err);
    return await response.json({ code: 400, msg: `err` });
  }
  // return promise(false);
  // return { code: 200, msg: res.stdout.trim() };
}

module.exports = getCommitDiff;
