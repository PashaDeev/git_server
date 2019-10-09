import express from 'express';
import main from './main/rout.ts';
import create from './create/rout.ts';

const router = express.Router();

const { deleteRepository } = require('./delete');
const { getCommits } = require('./commits');
const { getCommitDiff } = require('./commitDiff');
const { getStaff } = require('./getRepositoryStaff');
const { getBlob } = require('./getBlob');

function mainRout(dir) {
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

module.exports = { router: mainRout };
