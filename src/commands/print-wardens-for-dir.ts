const cprint = require('color-print');
import { WardenFile } from '../lib/WardenFile';
import { findWarden } from '../lib/findWarden';

export function printWardenForDirectory (in_directory: string): void {
    console.log(in_directory);
    const wardenFile = findWarden(in_directory);

    if (wardenFile) {
        const _wardenFile = new WardenFile(in_directory);
        _wardenFile.printWardenFile();
    } else {
        cprint.yellow('No warden for this area...');
    }
}
