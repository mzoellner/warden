const path = require('path');
import { printWardenMap } from './print';
import { getWardenMap } from './wardenMap';
import { Changeset } from './Changeset';
const modifiled = require('modifiled');

export async function init () {
    let _changedFiles = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(_changedFiles);

    const uniquePaths = _changeSet.mapUniquePaths();

    const wardenFileArray = _changeSet.findWardenFilesForPaths(uniquePaths);
    console.log(wardenFileArray);
}