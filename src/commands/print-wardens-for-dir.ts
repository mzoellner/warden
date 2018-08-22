const cprint = require('color-print');
import { WardenFile } from '../lib/WardenFile';
import { findWarden } from '../lib/findWarden';

export function printWardenForDirectory (in_directory: string): void {
    const wardenFilePath = findWarden(in_directory);

    if (wardenFilePath) {
        const _wardenFile = new WardenFile(wardenFilePath);
        _wardenFile.printWardenFile();
    } else {
        cprint.yellow('No warden for this area...');
    }
}
