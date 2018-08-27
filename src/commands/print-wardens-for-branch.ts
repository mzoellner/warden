import { printWardenMap } from '../lib/PrintService';
import { Changeset } from '../lib/Changeset';
const path = require('path');
const modifiled = require('modifiled');

export function printWardensForBranch () {
    const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(_changedFiles);

    const print = printWardenMap(_changeSet.wardenMap);
}