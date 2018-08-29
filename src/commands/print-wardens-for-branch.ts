import { Changeset } from '../lib/Changeset';
const cprint = require('color-print');
const path = require('path');
const modifiled = require('modifiled');

export function printWardensForBranch () {
    try {
        const _changedFiles: Array<string> = modifiled.default(process.cwd(), {vcs:1});
        const _changeSet = new Changeset(_changedFiles);
        _changeSet.print();
    }
    catch (e) {
        prettyPrint(e.message);
    }
}

function prettyPrint(message: string) {
    cprint.yellow(message);
}
