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
      res.statusCode = 400;
      return res.status(404).end('repository not exist');
    }
    const pathToDir = `${path.join(rootDir, repositoryId)}`;
    try {
      await create(pathToDir, body.url, rootDir);
      debug('data: success');
      res.end();
    } catch (err) {
      debug('data: error');
      next(err);
    }
  };
}
