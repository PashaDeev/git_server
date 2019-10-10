import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import Parser from '../utils/Parser';

export default function getCommitDiff(
  directory: string,
  commitHash: string,
): [ChildProcessWithoutNullStreams, Parser] {
  const parser = new Parser();

  const childProcess = spawn(`git`, [`diff`, commitHash, `${commitHash}~`], {
    cwd: directory,
  });
  return [childProcess, parser];
}
