const cprint = require('color-print');
import { findWarden } from '../lib/PrintService';
import { printWardenFile } from '../lib/PrintService';

export function printWardenForDirectory (in_directory: string): void {
    console.log(in_directory);
    const wardenFile = findWarden(in_directory);

    if (wardenFile) {
        printWardenFile(wardenFile);
    } else {
        cprint.yellow('No warden for this area...');
    }
}