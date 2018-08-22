const path = require('path');
import { printWardenMap } from './print';
import { getWardenMap } from './wardenMap';
import { Changeset } from './Changeset';
const modifiled = require('modifiled');

export async function init () {
    let changedFiles = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(changedFiles);

    if (_changeSet) {
      const changedPaths = changedFiles.map((file:any) => path.dirname(file)).filter(onlyUnique);
      console.log('changedPaths: ', changedPaths);

      // new WardenFile(changeSet);
      const wardenMap = await getWardenMap(changedPaths);
      
      
      printWardenMap(wardenMap);
    }
}