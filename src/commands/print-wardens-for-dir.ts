const cprint = require('color-print');
import { WardenFile } from '../lib/WardenFile';
import { findWarden } from '../lib/findWarden';

export function printWardenForDirectory (in_directory: string): void {
    try {
        const wardenFilePath = findWarden(in_directory);

        if (wardenFilePath) {
            const _wardenFile = new WardenFile(wardenFilePath);
            _wardenFile.printWardenFile();
        } else {
            throw new Error('No warden for this area...');
        }
    }
    catch (e) {
        prettyPrint(e.message);
    }
}

function prettyPrint(message: string) {
    cprint.yellow(message);
}
