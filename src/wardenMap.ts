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

    // Sort wardenFileContents? 
    // wardenFileContents.sort({});
    // Add 'count', sort by count.

    console.log(wardenFileContents);

    wardenFileContents.humans.forEach((human) => {
      if (wardenMap.has(human.name)) {
        wardenMap.get(human.name).push(path);
      } else {
        wardenMap.set(human.name, [path]);
      }
    });
  }

  // let sortedMap = sortWardenMap(wardenMap);

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

function sortWardenMap (_map: any ): any {
  let _sortedMap = new Map([..._map.entries()].sort());
  return _sortedMap;
}