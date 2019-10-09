const util = require(`util`);
const childProcess = require(`child_process`);
const execFile = util.promisify(childProcess.execFile);

export default async function getCommits(directory: string, hash: string, start = 0, count = 10) {
  const res = await execFile(`git`, [`log`, `--pretty=format:%H|%ad|%s`, `--date=short`, hash], {
    cwd: `${directory}`,
  });

  return res.stdout
    .trim()
    .split(`\n`)
    .slice(Number(start), Number(start) + Number(count))
    .map((commit: string) => {
      const [commitHash, date, name] = commit.split(`|`);
      return {
        hash: commitHash,
        date,
        commitMsg: name,
      };
    });
}
