import { Request, Response, NextFunction } from 'express';
import initDebug from 'debug';
import { join } from 'path';
import getStaff from './getStaff';

const debug = initDebug('rout: ');

const ENOENT = 'ENOENT';

export default function routWrapper(rootDir: string) {
  return async function(req: Request, res: Response, next: NextFunction) {
    debug(`GET get repository staff ${req.route.path}`);

    const { repositoryId, commitHash, pathFromUrl } = req.params;
    const dir = join(rootDir, repositoryId);
    const innerPath = pathFromUrl ? `./${pathFromUrl}${req.params[0] + '/' || `.`}` : `.`;
    const hash = commitHash || `master`;

    try {
      const result = await getStaff(dir, hash, innerPath);

      debug(`data: __no more than 10__ > ${JSON.stringify(result.slice(0, 10))}`);
      await res.json({ msg: result });
    } catch (err) {
      if (err.code === ENOENT) {
        debug('data: error 400');
        return res.status(400).end();
      }
      debug('data: error');
      next(err);
    }
  };
}
