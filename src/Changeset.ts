const cprint = require('color-print');
const path = require('path');
const fs = require('fs');

export class Changeset {
    private readonly paths: Array<string>;

    constructor (pathsArray: Array<string>) {
        this.paths = pathsArray;
        // this.changeList = this.paths.forEach( path => this.findWarden(path) );
    }

    public mapUniquePaths (): Array<string> {
        const changedPaths = this.paths.map((file:any) => path.dirname(file));
        const uniquePaths = changedPaths.map((file:any) => path.dirname(file)).filter(this.onlyUnique);
        console.log(uniquePaths);
        return uniquePaths;
        // ------->
    }

    public sortPaths (path: Array<string>): Array<string> {
        const sortedPaths = path
            .sort( path => path.length )
            .reverse();
        
        return sortedPaths;
    }

    private findWarden (in_directory: string = './'): string | false {
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