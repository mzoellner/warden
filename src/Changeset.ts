const path = require('path');
const fs = require('fs');
import { WardenFile } from './WardenFile';

export class Changeset {
    private readonly changedFilesArray: Array<string>;
    private readonly wardenFileLocationArray: Array<string> = [];
    private readonly wardenFileArray: Array<WardenFile> = [];

    constructor (_changedFiles: Array<string>) {
        // In this constructor, the changedFilesArray array should be initialized and shaped.
        // It should new up WardenFiles as needed.
        // All of these should be private methods referenced by the constructor.
        // The consumer shouldn't worry about anything to do with shaping the data.

        this.changedFilesArray = _changedFiles;
        this.buildWardenFileLocationArray();
        this.buildWardenFileArray();
    }

    private buildWardenFileLocationArray (): void {
        for (let i = 0 ; i < this.changedFilesArray.length ; i++) {
            const _wardenFileLocation: string = this.findWardenFileAndCheckValidity(this.changedFilesArray[i]);
            if (_wardenFileLocation) {
                this.wardenFileLocationArray.push(_wardenFileLocation);
            } else {
                continue
            }
        }
    }

    private buildWardenFileArray (): void {
        if (this.wardenFileLocationArray.length) {
            for ( let i = 0 ; i < this.wardenFileLocationArray.length ; i++ ) {
                const wardenFile = new WardenFile(this.wardenFileLocationArray[i]);
                this.wardenFileArray.push(wardenFile);
            }
        } else {
            // Handle empty location array case
        }
    }

    // private getWardenMap (_changedFilesArray:any): any {
    //     let wardenMap = new Map();
      
    //     for (let i=0 ; i < _changedFilesArray.length ; i++) {
    //       let path = _changedFilesArray[i];
    //       let wardenLocation = this.findWardenFileAndCheckValidity(path);
    //       if (!wardenLocation) {
    //         continue;
    //       }
      
    //       wardenLocation.humans.forEach((human) => {
    //         if (wardenMap.has(human.name)) {
    //           wardenMap.get(human.name).push(path);
    //         } else {
    //           wardenMap.set(human.name, [path]);
    //         }
    //       });
    //     }
      
    //     return wardenMap;
    //   }

    // private sortBychangedFilesArray (path: Array<string>): Array<string> {
    //     const sortedchangedFilesArray = path
    //         .sort( path => path.length )
    //         .reverse();
        
    //     return sortedchangedFilesArray;
    // }

    private findWardenFileAndCheckValidity (_path:string): string {
        if (_path) {
            const location = this.findWarden(_path);
            if (!location) {
                return '';
            }
            return location;
        } else {
            return '';       
        }
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
    
        if (!fs.existsSync(wardenFile)) {
            return undefined;
        }
    
        return wardenFile;
    }
}