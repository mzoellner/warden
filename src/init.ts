const path = require('path');
import { Changeset } from './Changeset';
import { WardenFile } from './WardenFile';
const modifiled = require('modifiled');

export function init () {
    const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(_changedFiles);

    const print = _changeSet.printWardenMap();
}