const util = require(`util`);
const { spawn } = require(`child_process`);
const Transform = require(`stream`).Transform;
const pump = require(`pump`);
const { err: errorDebug } = require(`../../debug`);

// const spawn = util.promisify(childProcess.spawn);
async function getBlob(dir, hash, innerPath, response) {
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
  parser._flush = function(done) {
    this.push(`${JSON.stringify({ raw: "" })}`);
    done();
  };
  try {
    response.write(`{ "code": 200, "msg": [ `);
    const childProcess = spawn(`git`, [`show`, `${hash}:${innerPath}`], {
      cwd: dir
    });
    pump(childProcess.stdout, parser, response);
    childProcess.stdout.on(`end`, () => {
      response.write(`]}`);
    });
    childProcess.stderr.on(`error`, err => {
      console.log(`-------------------------`);
      console.log(`err`, err);
      console.log(`-------------------------`);
    });
  } catch (err) {
    if (err.code === `ENOENT`) {
      errorDebug(`no directory`);
      return { code: 400, msg: `no directory` };
    }

    if (err.code === 128) {
      return { code: 400, msg: err.stderr };
    }

    errorDebug(err);
    return { code: 500, msg: `err` };
  }
  return false;
  // return { code: 200, msg: res.stdout.trim() };
}

module.exports = getBlob;
