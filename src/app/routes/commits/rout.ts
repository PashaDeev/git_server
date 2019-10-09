import { Request, Response, NextFunction } from 'express';
import debugInit from 'debug';
import { join } from 'path';
import getCommits from './commits';

const debug = debugInit('rout: ');

const ENONENT = 'ENOENT';

export default function routWrapper(rootDir: string) {
  return async function(req: Request, res: Response, next: NextFunction) {
    debug(`GET get commits ${req.route.path}`);
    const { repositoryId, commitHash } = req.params;
    const { start, count } = req.query;
    try {
      const result = await getCommits(join(rootDir, repositoryId), commitHash, start, count);
      debug(`data: __no more than 10__ > ${JSON.stringify(result.slice(0, 10))}`);
      await res.json({ msg: result });
    } catch (err) {
      if (err.code === ENONENT) {
        debug('data: error 400');
        return res.status(400).end();
      }
      debug('data: error');
      next(err);
    }
  };
}
