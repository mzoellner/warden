import { findWarden } from './find-warden';
import { WardenFile } from './warden-file';
const cprint = require('color-print');
const path = require('path');

export function printWardenInfo (in_directory: string): void {
    const wardenFile = findWarden(in_directory);

    if (wardenFile) {
        printWardenFile(wardenFile);
    } else {
        cprint.yellow('No warden for this area...');
    }
}

export async function printWardenFile (in_wardenFile: string, in_indent: string = '') {
    const wardenFileContents = await readWardenFile(in_wardenFile);
    if (!wardenFileContents) {
        return;
    }
    const directory = path.dirname(in_wardenFile);
    const wardens = cprint.toGreen(wardenFileContents.humans.map(human => human.name).join('\n\t' + in_indent));
    console.log(in_indent + cprint.toGreen(directory) + ' ' + cprint.toCyan(' =>') + '\n\t' + in_indent + wardens);
}

export async function printWardenMap (_map:Map<string, Array<string>>): Promise<void> {
    let sortedMap = sortMapByPathsLength(_map);
    
    sortedMap.forEach((paths, name) => {
        let formatName = cprint.toBackgroundMagenta(name.padEnd(48));
        let formatPaths = cprint.toLightGreen(paths.join('\n    '));
console.log(
`    ${formatName} 
    ${formatPaths}
`
);
    });
}

function sortMapByPathsLength (_map: Map<string, Array<string>>): Map<string, Array<string>> {
    let _sortedMap = new Map( 
        [..._map.entries()]
        .sort( (x, y) => x[1].length - y[1].length )
        .reverse()
    );
    
    return _sortedMap;
}

export async function readWardenFile (in_wardenFile: string): Promise<WardenFile|undefined> {
    try {
        const wardenFileContents = require(in_wardenFile);
        if (!isWardenFileValid(wardenFileContents)) {
            cprint.yellow('Invalid warden file: ' + in_wardenFile);
            return;
        }
        return Promise.resolve(wardenFileContents);
    } catch (e) {
        cprint.yellow('Could not read warden file: ' + in_wardenFile);
    }
}

function isWardenFileValid (wardenFileContents: WardenFile): boolean {
    if (!wardenFileContents.humans ||
        Array.isArray(wardenFileContents) ||
        (!!wardenFileContents.humans && !wardenFileContents.humans.length)) {
        cprint.yellow('Warden file does not contain humans');
        return false;
    }
    const isHumansInvalid = wardenFileContents.humans.some(human => !human.name || !human.email);
    if (isHumansInvalid) {
        cprint.yellow('Humans in warden file are not in valid format');
        return false;
    }
    return true;
}
