const path = require('path');
import { printWardenMap } from './print';
import { getWardenMap } from './wardenMap';
import { Changeset } from './Changeset';
const modifiled = require('modifiled');

export function init () {
    // Notes: This should basically just get the changes from modifiled,
    // and new up a changeset. The changeset should initialize and shape itself.
    // The changeset should make up WardenFiles data objects.
    // Then the changeset should be printed, from here (call print method on changeset.)

    const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});

    const _changeSet = new Changeset(_changedFiles);

    // _changeSet.print();
}