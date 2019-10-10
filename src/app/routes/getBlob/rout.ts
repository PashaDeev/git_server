import { Request, Response, NextFunction } from 'express';
import initDebug from 'debug';
import { join } from 'path';
import getBlob from './getBlob';
import pump from 'pump';

const debug = initDebug('rout: ');

const myErr = class extends Error {
  set code(code: string) {
    this.code = code;
  }
}

export default function routWrapper(rootDir: string) {
  return async function(req: Request, res: Response, next: NextFunction) {
    debug(`GET get blob ${req.route.path}`);

    const { repositoryId, commitHash, pathToFile } = req.params;
    const dir = join(rootDir, repositoryId);
    const innerPath = pathToFile ? `${pathToFile}${req.params[0]}` : `.`;
    const hash = commitHash || `master`;

    await res.setHeader('Content-Type', 'application/json');
    await res.setHeader('Transfer-Encoding', 'chunked');

    const [childProcess, parser] = getBlob(dir, hash, innerPath);

    const { stdout } = childProcess;

    childProcess.on('error', err => {
      next(err);
    });

    stdout.on('end', () => {
      if (!parser.isData) {
        const err = new myErr('ENOENT');
        err.code = 'ENOENT';
        // fixme если оставить ответ на хэндлер, то ответ не отправляется
        res.status(400).end();
        next(err)
      }
    })

    childProcess.on('close', (code: number) => {
      debug(`data: end with code ${code}`);
    });

    pump(stdout, parser, res);
  };
}
