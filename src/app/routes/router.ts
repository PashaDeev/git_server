import express from 'express';
import main from './main/rout';
import create from './create/rout';
import deleteRepository from './delete/rout';
import getCommits from './commits/rout';
import getCommitDiff from './commitDiff/rout';
import getStaff from './getRepositoryStaff/rout';
import getBlob from './getBlob/rout';

const router = express.Router();

export default function mainRout(dir: string) {
  const rootDir = dir;

  router.post('/:repositoryId', create(rootDir));

  router.delete('/:repositoryId', deleteRepository(rootDir));

  router.get('/', main(rootDir));

  router.get('/:repositoryId/commits/:commitHash', getCommits(rootDir));

  router.get('/:repositoryId/commits/:commitHash/diff', getCommitDiff(rootDir));

  router.get('/:repositoryId/tree/:commitHash?/:pathFromUrl*?', getStaff(rootDir));

  router.get('/:repositoryId/blob/:commitHash/:pathToFile*', getBlob(rootDir));

  return router;
}
