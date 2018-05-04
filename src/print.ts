import {findWarden} from "./find-warden";
const cprint = require('color-print');
const fsp = require('fs-process');
const path = require('path');

export function printWardenInfo (in_directory: string): void {
    const wardenFile = findWarden(in_directory);

    if (wardenFile) {
        printWardenFile(wardenFile);
    } else {
        cprint.yellow('No warden for this area...');
    }
}

function printWardenFile (in_wardenFile: string, in_indent: string = ''): void {
    fsp.read(in_wardenFile, function (wardenFileContents: string) {
        const directory = path.dirname(in_wardenFile);
        try {
            const wardenData = JSON.parse(wardenFileContents);
            console.log(in_indent + cprint.toWhite(directory) + ' ' + cprint.toCyan('=>') + ' ' + cprint.toGreen(wardenData.name));
        } catch (e) {
            cprint.yellow('Invalid warden file: ' + in_wardenFile);
            return;
        }
    });
}