import { spawn } from 'child_process';

export default async function create(repositoryId: string, url: string, rooDir: string) {
  const process = spawn(`git`, [`clone`, `--bare`, url, repositoryId], { cwd: rooDir });

  return new Promise((resolve, reject) => {
    process.on('exit', data => {
      resolve(data);
    });

    process.on('error', err => {
      reject(err);
    });
  });
}
