import debugInit from 'debug';
import { Request, Response, NextFunction } from 'express';

const debug = debugInit(`rout: `);
import path from 'path';
import create from './create';

export default function createRepository(rootDir: string) {
  return async function(req: Request, res: Response, next: NextFunction) {
    debug(`POST create ${req.route.path}`);
    const { repositoryId } = req.params;
    const { body } = req;
    if (!repositoryId || !body || !body.url) {
      return res.status(400).end();
    }

    try {
      await create(repositoryId, body.url, rootDir);
      debug('data: success');
      res.end();
    } catch (err) {
      debug('data: error');
      if (err._code === 'ENOENT') {
        res.end();
      } else {
        next(err);
      }
    }
  };
}
