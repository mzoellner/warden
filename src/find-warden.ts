const cprint = require('color-print');
const path = require('path');
const fs = require('fs');
import {printWardenFile} from './print';
const modifiled = require('modifiled');

export function findWarden (in_directory: string = './') {
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

export function wardensForChangedAreas () {
  let changedFiles = modifiled.default(process.cwd(), {vcs:1});
  if (changedFiles) {
    const changedPaths = changedFiles.map((file:any) => path.dirname(file));
    const wardens = changedPaths.map((dir:any) => findWarden(dir)).filter(Boolean);
    wardens.forEach((dir:any) => printWardenFile(dir));
  }
}
