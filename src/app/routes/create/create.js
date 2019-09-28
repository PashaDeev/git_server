const util = require(`util`);
const path = require(`path`);
const childProcess = require(`child_process`);
const spawn = childProcess.spawn;
// const execFile = util.promisify(childProcess.execFile);
const { err: errorDebug } = require(`../../debug`);

async function create(repositoryId, url, pathToDir, promiseResovle) {
  let timeout;
  try {
    const process = spawn(`git`, [`clone`, `--bare`, url, repositoryId]);
    process.on(`exit`, () => {
    })
    process.stdout.on(`end`, () => {
      promiseResovle({code: 200})
    });
    process.stderr.on(`data`, (data) => {
      if (data.toString().match(`fatal`)) {
        promiseResovle({code: 400, msg: data.toString()});
        clearTimeout(timeout);
      }
    });
    timeout = setTimeout(() => {
      promiseResovle({code: 500, msg: `err`});
      process.kill()
    }, 20000);
  } catch (err) {
    if (err.code === 128) {
      // return { code: 400, msg: err.stderr };
    }
    errorDebug(`error in cloning ${err}`);
    // return { code: 500, msg: `error` };
  }
  // return { code: 200 };
}

module.exports = create;
