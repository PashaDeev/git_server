import { Request, Response, NextFunction } from 'express';
import initDebug from 'debug';
import pump from 'pump';
import { join } from 'path';
import getCommitDiff from './getDiff';

const debug = initDebug('rout: ');

export default function routWrapper(rootDir: string) {
  return async function(req: Request, res: Response, next: NextFunction) {
    debug(`GET get commit diff ${req.route.path}`);
    const { repositoryId, commitHash } = req.params;

    await res.setHeader("Content-Type", "application/json");
    await res.setHeader("Transfer-Encoding", "chunked");

    const [childProcess, parser] = getCommitDiff(join(rootDir, repositoryId), commitHash);

    const { stdout } = childProcess;

    childProcess.on('error', err => {
      next(err);
    });

    childProcess.on('close', (code: number) => {
      debug(`data: end with code ${code}`);
    });

    pump(stdout, parser, res);
  };
}
