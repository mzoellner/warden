const cprint = require('color-print');
const path = require('path');
const fs = require('fs');

export function findWarden (in_directory: string) {
    if (!in_directory) {
        in_directory = './';
    }

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