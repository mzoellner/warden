const path = require('path');
const modifiled = require('modifiled');
import { Changeset } from '../lib/Changeset';

export function printWardensForBranch () {
    const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(_changedFiles);

    const print = _changeSet.printWardenMap();
}