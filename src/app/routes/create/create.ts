import {mkdirSync} from 'fs-extra';
import { spawn } from 'child_process';
import MyErr from '../utils/Error';

export default async function create(repositoryId: string, url: string, rooDir: string) {
  try {
    mkdirSync(rooDir);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw new Error(err);
    }
  }
  const process = spawn(`git`, [`clone`, `--bare`, url, repositoryId], { cwd: rooDir });

  return new Promise((resolve, reject) => {
    process.on('close', data => {
      if (data === 128) {
        const err = new MyErr('ENOENT');
        reject(err)
      } else {
        resolve(data);
      }
    });

    process.on('error', err => {
      reject(err);
    });
  });
}
