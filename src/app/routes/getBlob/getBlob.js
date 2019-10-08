const util = require(`util`);
const { spawn } = require(`child_process`);
const pump = require(`pump`);
const Transform = require(`stream`).Transform;
const { err: errorDebug } = require(`../../debug`);

// const spawn = util.promisify(childProcess.spawn);
async function getBlob(dir, hash, innerPath) {
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
    this.push('{"raw": ""}]}');
    done();
  };
  console.log('-------------------------');
  console.log('dir', dir);
  console.log('inner', innerPath);
  console.log('-------------------------');
  try {
    parser.push(`{ "code": 200, "msg": [ `);
    const childProcess = spawn(`git`, [`show`, `${hash}:${innerPath}`], {
      cwd: dir
    });
    return [childProcess.stdout, parser];
    // pump(childProcess.stdout, parser);
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
}

module.exports = getBlob;
