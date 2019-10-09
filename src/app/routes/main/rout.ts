import { Request, Response, NextFunction } from 'express';
import debugInit from 'debug';
import mainFunc from './main';

const debug = debugInit('rout: ');

export default function mainRout(rootDir: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    debug(`GET main ${req.route.path}`);
    try {
      const result = await mainFunc(rootDir);
      debug(`data: ${JSON.stringify(result)}`);
      res.send({ msg: result });
    } catch (err) {
      debug('data: error');
      next(err);
    }
  };
}
