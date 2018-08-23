const cprint = require('color-print');
const path = require('path');
const fs = require('fs');
import { WardenFile } from './WardenFile';

export class Changeset {
    private readonly paths: Array<string>;
    private readonly wardenMap;
    private readonly wardenFileArray;

    constructor (pathsArray: Array<string>) {
        // In this constructor, the paths array should be initialized and shaped.
        // It should new up WardenFiles as needed.
        // All of these should be private methods referenced by the constructor.
        // The consumer shouldn't worry about anything to do with shaping the data.

        // const uniquePaths = _changeSet.mapUniquePaths();?
        this.paths = pathsArray;
        this.wardenFileArray = this.findWardenFilesForPaths(this.paths);
        this.wardenMap = this.getWardenMap(this.wardenFileArray);

        // Changeset.printWardenMap();
    }

    private mapUniquePaths (): Array<string> {
        const uniquePaths = this.paths.map((file:any) => path.dirname(file)).filter(this.onlyUnique);

        return uniquePaths;
    }

    private sortByPaths (path: Array<string>): Array<string> {
        const sortedPaths = path
            .sort( path => path.length )
            .reverse();
        
        return sortedPaths;
    }

    private findWardenFilesForPaths (uniquePaths: Array<string>): Array<string> {
        let wardenFileArray: Array<string> = [];
        for ( let i = 0; i < uniquePaths.length; i++) {
            wardenFileArray.push(this.findWarden(uniquePaths[i]));
        }

        return wardenFileArray;
    }

    private getWardenMap (_changedPaths:any): any {
        let wardenMap = new Map();
      
        for (let i=0 ; i < _changedPaths.length ; i++) {
          let path = _changedPaths[i];
          let wardenFileContents = this.parseWardenFileName(path);
          if (!wardenFileContents) {
            continue;
          }
      
          wardenFileContents.humans.forEach((human) => {
            if (wardenMap.has(human.name)) {
              wardenMap.get(human.name).push(path);
            } else {
              wardenMap.set(human.name, [path]);
            }
          });
        }
      
        return wardenMap;
      }

    private findWarden (in_directory: string = './'): string | undefined {
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
            return undefined;
        }
    
        return wardenFile;
    }

    private parseWardenFileName (_path:string | undefined): WardenFile | undefined {
        if (_path) {
            const location = this.findWarden(_path);
            if (!location) {
            return;
            }
            const parsedWardenFile = this.readWardenFile(location);
            return parsedWardenFile;
        }        
    }

    private readWardenFile (in_wardenFile: string): WardenFile|undefined {
        const fileContents = fs.readFileSync(in_wardenFile);
        
        new WardenFile(fileContents, in_wardenFile);
        
        
        // try {
        //     const wardenFileContents = in_wardenFile;
        //     if (!this.isWardenFileValid(wardenFileContents)) {
        //         cprint.yellow('Invalid warden file: ' + in_wardenFile);
        //         return;
        //     }
        //     return wardenFileContents;
        // } catch (e) {
        //     cprint.yellow('Could not read warden file: ' + in_wardenFile);
        // }
    }

    // private isWardenFileValid (wardenFileContents: WardenFile): <boolean> {
    //     if (!wardenFileContents.humans ||
    //         Array.isArray(wardenFileContents) ||
    //         (!!wardenFileContents.humans && !wardenFileContents.humans.length)) {
    //         cprint.yellow('Warden file does not contain humans');
    //         return false;
    //     }
    //     const isHumansInvalid = wardenFileContents.humans.some(human => !human.name || !human.email);
    //     if (isHumansInvalid) {
    //         cprint.yellow('Humans in warden file are not in valid format');
    //         return false;
    //     }
    //     return true;
    // }

    private onlyUnique(value: any, index: number, self: Array<string>) {
        return self.indexOf(value) === index;
      }
}