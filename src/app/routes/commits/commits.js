const util = require(`util`);
const childProcess = require(`child_process`);
const execFile = util.promisify(childProcess.execFile);
const { err: errorDebug } = require(`../../debug`);

async function getCommits(directory, hash, start = 0, count = 10) {
  let res;
  try {
    res = await execFile(
      `git`,
      [`log`, `--pretty=format:%H|%ad|%s`, `--date=short`, hash],
      { cwd: `${directory}.git` }
    );
  } catch (err) {
    if (err.code === `ENOENT`) {
      errorDebug(`no directory`);
      return { code: `400`, msg: `no directory` };
    }
    return { code: 500, msg: `error` };
  }
  const commitArray = res.stdout
    .trim()
    .split(`\n`)
    .slice(Number(start), Number(start) + Number(count))
    .map(commit => {
      const [commitHash, date, name] = commit.split(`|`);
      return {
        hash: commitHash,
        date,
        commitMsg: name
      };
    });

    return {
      code: 200,
      msg: commitArray
    }
}

module.exports = getCommits;
