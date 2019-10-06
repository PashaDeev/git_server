const util = require(`util`);
const childProcess = require(`child_process`);
const execFile = util.promisify(childProcess.execFile);
const { err: errorDebug } = require(`../../debug`);
const path = require("path");
const fs = require("fs-extra");

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

  let promises = [];

  if (Array.isArray(fileArr)) {
    for (const file of fileArr) {
      const p = path.join(innerPath, file);
      const prom = await execFile(
        "git",
        [
          "log",
          "--pretty=format:%H|%ar|%an|%s",
          commitHash,
          `--`,
          `${p}`,
          '-(1)'
        ],
        { cwd: dirPath }
      );
      promises.push(prom);
    }
  }

  await Promise.all(promises);

  const result = [];

  for (const item of promises) {
    const str = await item.stdout;
    result.push(str);
  }

  const info = result.map((item, index) => {
    console.log();
    const [hash, data, author, commitMessage] = item.split("|");
    const fileName = fileArr[index];
    return {
      file: fileName,
      hash,
      data,
      author,
      commitMessage: commitMessage.split('\n')[0],
      isDirectory: fileName.split(".").length <= 1
    };
  });

  return {
    code: 200,
    msg: info
  };
}

module.exports = getStaff;
