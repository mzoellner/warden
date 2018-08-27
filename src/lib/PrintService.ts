import WardenFile from './WardenFile';
const cprint = require('color-print');
const path = require('path');
const fs = require('fs');

export function printWardenFile (in_wardenFile: string, in_indent: string = '') {
    const wardenFileContents = readWardenFile(in_wardenFile);
    if (!wardenFileContents) {
        return;
    }
    const directory = path.dirname(in_wardenFile);
    const wardens = cprint.toGreen(wardenFileContents.humans.map(human => human.name).join('\n\t' + in_indent));
    console.log(in_indent + cprint.toGreen(directory) + ' ' + cprint.toCyan(' =>') + '\n\t' + in_indent + wardens);
}

export function readWardenFile (in_wardenFile: string): WardenFile|undefined {
    try {
        const wardenFileContents = require(in_wardenFile);
        if (!isWardenFileValid(wardenFileContents)) {
            cprint.yellow('Invalid warden file: ' + in_wardenFile);
            return;
        }
        return wardenFileContents;
    } catch (e) {
        cprint.yellow('Could not read warden file: ' + in_wardenFile);
    }
}

export function isWardenFileValid (wardenFileContents: WardenFile): boolean {
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

export function findWarden (in_directory: string = './'): string | false {
    let directory = path.resolve(process.cwd(), in_directory);
    let wardenFile = path.resolve(directory, '.warden');

    const maxUpwardsIteration = 100;
    let loopCount = 0;

    while (true) {
        if (fs.existsSync(wardenFile)) {
            break;
        }

        const oldDirectory = directory;
        directory = path.dirname(directory);
        if (directory === oldDirectory) {
            break;
        }

        if (loopCount++ > maxUpwardsIteration) {
            cprint.yellow('Too many loop iterations! Invalid top directory: ' + directory);
            break;
        }

        wardenFile = path.resolve(directory, '.warden');
    }

    if (! fs.existsSync(wardenFile)) {
        return false;
    }

    return wardenFile;
}