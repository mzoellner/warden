const cprint = require('color-print');
const path = require('path');
const fs = require('fs');

export class Changeset {
    private readonly paths: Array<string>;
    public wardenFileArray: Array<string>;

    constructor (pathsArray: Array<string>) {
        this.paths = pathsArray;
    }

    public mapUniquePaths (): Array<string> {
        const changedPaths = this.paths.map((file:any) => path.dirname(file));
        const uniquePaths = changedPaths.map((file:any) => path.dirname(file)).filter(this.onlyUnique);

        return uniquePaths;
    }

    public sortByPaths (path: Array<string>): Array<string> {
        const sortedPaths = path
            .sort( path => path.length )
            .reverse();
        
        return sortedPaths;
    }

    public findWardenFilesForPaths (uniquePaths: Array<string>): Array<string> {
        let wardenFileArray: Array<string> = [];
        for ( let i = 0; i < uniquePaths.length; i++) {
            wardenFileArray.push(this.findWarden(uniquePaths[i]));
        }
        this.wardenFileArray = wardenFileArray;

        return this.wardenFileArray;
    }

    private findWarden (in_directory: string = './'): string {
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
                cprint.yellow('Too many loop iterations! Invalid top directory: ' + directory); // throw
                break;
            }
    
            wardenFile = path.resolve(directory, '.warden');
        }
    
        if (! fs.existsSync(wardenFile)) {
            return false;
        }
    
        return wardenFile;
    }

    private onlyUnique(value: any, index: number, self: Array<string>) {
        return self.indexOf(value) === index;
      }
}