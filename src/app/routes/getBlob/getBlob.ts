import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import Parser from '../utils/Parser';

export default function getBlob(
  dir: string,
  hash: string,
  innerPath: string,
): [ChildProcessWithoutNullStreams, Parser] {

  const parser = new Parser();

  const childProcess = spawn(`git`, [`show`, `${hash}:${innerPath}`], {
    cwd: dir,
  });

  return [childProcess, parser];
}
