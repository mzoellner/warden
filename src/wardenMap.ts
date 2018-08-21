import { findWarden } from './find-warden'
import { readWardenFile } from './print'
import { WardenFile } from './warden-file';

export async function getWardenMap (_changedPaths:any): Promise<Map<string, Array<string>>> {
  let wardenMap = new Map();

  for (let i=0 ; i < _changedPaths.length ; i++) {
    let path = _changedPaths[i];
    let wardenFileContents = await parseWardenFileName(path);
    if (!wardenFileContents) {
      continue;
    }

    wardenFileContents.humans.forEach((human) => {
      if (wardenMap.has(human.name)) {
        wardenMap.get(human.name).push(path);
      } else {
        wardenMap.set(human.name, [path]);
      }
    });
  }

  return wardenMap;
}

async function parseWardenFileName (_path:string): Promise<WardenFile | undefined> {
  const location = findWarden(_path);
  if (!location) {
    return;
  }
  const parsedWardenFile = await readWardenFile(location);
  return parsedWardenFile;
}