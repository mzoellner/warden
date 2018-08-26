const path = require('path');
const modifiled = require('modifiled');
import * as Changeset from '../Changeset';
import * as WardenFile from '../Wardenfile';

export function printWardensForBranch () {
    const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(_changedFiles);

    const print = _changeSet.printWardenMap();
}