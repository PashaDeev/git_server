const util = require(`util`);
const childProcess = require(`child_process`);
const execFile = util.promisify(childProcess.execFile);
const { err: errorDebug } = require(`../../debug`);

async function getStaff(dirPath, commitHash, innerPath) {
  let res;
  try {
    res = await execFile(
      `git`,
      [`ls-tree`, `--full-tree`, commitHash, innerPath, `--name-only`],
      { cwd: dirPath }
    );
  } catch (err) {
    if (err.code === `ENOENT`) {
      errorDebug(`no directory`);
      return { msg: `no directory`, code: 400 };
    }
    errorDebug(err);
    return { code: 400, msg: `err` };
  }

  const fileArr = !res.stdout.trim().length
    ? "empty"
    : res.stdout
        .trim()
        .split(`\n`)
        .map(elem => {
          return elem.split(`/`).pop();
        });

  return {
    code: 200,
    msg: fileArr
  };
}

module.exports = getStaff;
