import initDebug from 'debug';
import deleteRepository from './delete';
import { Request, Response, NextFunction } from 'express';

const debug = initDebug(`rout: `);

export default function routWrapper(rootDir: string) {
  return async function(req: Request, res: Response, next: NextFunction) {
    debug(`DELETE delete repo ${req.route.path}`);
    const { repositoryId } = req.params;
    if (!repositoryId) {
      return res.status(400).end();
    }

    try {
      await deleteRepository(repositoryId, rootDir);
      debug('data: success');
      res.end();
    } catch (err) {
      debug('data: error');
      next(err);
    }
  };
}
