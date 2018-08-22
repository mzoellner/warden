const cprint = require('color-print');
const path = require('path');
const fs = require('fs');

export function findWarden (in_directory: string = './'): string | false {
    let directory = path.resolve(process.cwd(), in_directory);
    let wardenFilePath = path.resolve(directory, '.warden');

    const maxUpwardsIteration = 100;
    let loopCount = 0;

    while (true) {
        if (fs.existsSync(wardenFilePath)) {
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

        wardenFilePath = path.resolve(directory, '.warden');
    }

    if (! fs.existsSync(wardenFilePath)) {
        return false;
    }

    return wardenFilePath;
}
