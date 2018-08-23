const cprint = require('color-print');
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
        this.buildWardenFileLocationArray(this.changedFilesArray);
        this.buildWardenFileArray(this.wardenFileLocationArray);
    }

    private buildWardenFileLocationArray (_changedFilesArray: Array<string>): void {
        for (let i = 0 ; i < _changedFilesArray.length ; i++) {
            const _wardenFileLocation: string = this.findWardenFileAndCheckValidity(_changedFilesArray[i]);
            if (_wardenFileLocation) {
                this.wardenFileLocationArray.push(_wardenFileLocation);
            } else {
                continue
            }
            
        }
    }

    private buildWardenFileArray (_wardenFileLocationArray: Array<string>): void {
        if (this.wardenFileLocationArray.length) {
            for ( let i = 0 ; i < this.wardenFileLocationArray.length ; i++ ) {
                const wardenFile = new WardenFile(this.wardenFileLocationArray[i]);
                this.wardenFileArray.push(wardenFile);
            }
            console.log(this.wardenFileArray);
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

    private findWardenFileAndCheckValidity (_path:string): string {
        if (_path) {
            const location = this.findWarden(_path);
            if (!location) {
            return '';
            }
            const wardenLocation = this.checkWardenFileValidity(location);
            return wardenLocation;
        }
        return '';    
    }

    

    private checkWardenFileValidity (location: string): string {

        return location;     
        // try {
        //     const wardenLocation = location;
        //     // if (!this.isWardenFileValid(wardenLocation)) {
        //     //     cprint.yellow('Invalid warden file: ' + location);
        //     //     return;
        //     // }
        //     return wardenLocation;
        // } catch (e) {
        //     console.log('error: ', e);
        //     cprint.yellow('Could not read warden file: ' + location);
        // }
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
    
    private isWardenFileValid (wardenLocation: string): boolean {
        console.log('wardenLocation: ', wardenLocation);
        // if (!wardenLocation.humans || Array.isArray(wardenLocation) || (!!wardenLocation.humans && !wardenLocation.humans.length)) {
        //     cprint.yellow('Warden file does not contain humans');
        //     return false;
        // }
        // const isHumansInvalid = wardenLocation.humans.some(human => !human.name || !human.email);
        // if (isHumansInvalid) {
        //     cprint.yellow('Humans in warden file are not in valid format');
        //     return false;
        // }
        return true;
    }

    // private sortBychangedFilesArray (path: Array<string>): Array<string> {
    //     const sortedchangedFilesArray = path
    //         .sort( path => path.length )
    //         .reverse();
        
    //     return sortedchangedFilesArray;
    // }
}