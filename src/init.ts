const path = require('path');
import { Changeset } from './Changeset';
import { WardenFile } from './WardenFile';
const modifiled = require('modifiled');

export function init () {
    // Notes: This should basically just get the changes from modifiled,
    // and new up a changeset. The changeset should initialize and shape itself.
    // The changeset should make up WardenFiles data objects.
    // Then the changeset should be printed, from here (call print method on changeset.)

    // const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});

    // const _changeSet = new Changeset(_changedFiles);

    const filePath = 'C:\\Data\\Solutions\\TradeMe.FrEnd\\packages\\frend\\web\\client\\src\\app\\Main\\.warden';

    let wardenFile = new WardenFile(filePath);

    console.log('From Init() - wardenFile: ', wardenFile);

    // _changeSet.print();
}