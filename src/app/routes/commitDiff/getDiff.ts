import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Transform } from 'stream';

class Parser extends Transform {
  private firstChunk: boolean;

  constructor() {
    super();
    this.firstChunk = true;
  }
  _transform(data: Buffer, encoding: string, done: Function) {
    const res = data
      .toString()
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f');

    const chunk = {
      raw: res,
    };
    if (this.firstChunk) {
      this.push(JSON.stringify(`{ "msg": [ ${chunk}),`));
      this.firstChunk = false;
    } else {
      this.push(`${JSON.stringify(chunk)},`);
    }
    done();
  }

  _flush(done: Function) {
    this.push('{"raw": ""}]}');
    done();
  }
}

export default function getCommitDiff(
  directory: string,
  commitHash: string,
): [ChildProcessWithoutNullStreams, Transform] {
  const parser = new Parser();

  const childProcess = spawn(`git`, [`diff`, commitHash, `${commitHash}~`], {
    cwd: directory,
  });
  return [childProcess, parser];
}
