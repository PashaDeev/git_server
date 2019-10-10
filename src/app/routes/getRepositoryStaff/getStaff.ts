import util from 'util';
import { execFile as exec } from 'child_process';
import { join } from 'path';

const execFile = util.promisify(exec);

export default async function getStaff(dirPath: string, commitHash: string, innerPath: string) {
  const res = await execFile(
    `git`,
    [`ls-tree`, `--full-tree`, commitHash, innerPath, `--name-only`],
    {
      cwd: dirPath,
    },
  );

  const fileArr = res.stdout.trim().length
    ? res.stdout
        .trim()
        .split(`\n`)
        .map(elem => {
          return elem.split(`/`).pop();
        })
    : null;

  let promises = [];

  if (Array.isArray(fileArr)) {
    for (const file of fileArr) {
      const p = join(innerPath, file ? file : '');
      const prom = await execFile(
        'git',
        ['log', '--pretty=format:%H|%ar|%an|%s', commitHash, `--`, `${p}`, '-(1)'],
        { cwd: dirPath },
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

  return result.map((item, index) => {
    console.log();
    const [hash, data, author, commitMessage] = item.split('|');
    const fileName = fileArr && fileArr[index];
    return {
      file: fileName,
      hash,
      data,
      author,
      commitMessage: commitMessage.split('\n')[0],
      isDirectory: fileName && fileName.split('.').length <= 1,
    };
  });
}
