import fs from 'fs-extra';
import { join } from 'path';

export default async function deleteRepository(id: string, rootDir: string) {
  await fs.remove(join(rootDir, id));
}
