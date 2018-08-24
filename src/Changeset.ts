const cprint = require('color-print');
const path = require('path');
const fs = require('fs');
import { WardenFile } from './WardenFile';

export class Changeset {
    private readonly changedFilesArray: Array<string>;
    private readonly wardenFileLocationArray: Array<string> = [];
    private readonly wardenFileArray: Array<WardenFile> = [];
    private readonly wardenMap: Map<string, Array<string>>;

    constructor (_changedFiles: Array<string>) {
        this.changedFilesArray = _changedFiles;
        this.buildWardenFileLocationArray();
        this.buildWardenFileArray();
        this.wardenMap = this.buildWardenMap();
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

    private buildWardenMap (): Map<string, Array<string>> {
        let _wardenMap = new Map();
      
        for (let i = 0 ; i < this.wardenFileArray.length ; i++) {    
            this.wardenFileArray[i].humans.humans.forEach((human) => {
            if (_wardenMap.has(human.name)) {
              _wardenMap.get(human.name).push(this.wardenFileArray[i].filePath);
            } else {
              _wardenMap.set(human.name + `   -    ` + human.email, [this.wardenFileArray[i].filePath]);
            }
          });
        }
      
        return _wardenMap;
    }

    public printWardenMap (): void {
        // let sortedMap = this.sortMapByPathsLength(_map);
        
        this.wardenMap.forEach((paths, name) => {
            let formatName = cprint.toBackgroundMagenta(name.padEnd(48));
            let formatPaths = cprint.toLightGreen(paths.join('\n    '));
console.log(
`    ${formatName} 
    ${formatPaths}
`
);
        });
    }

    private sortMapByPathsLength (path: Array<string>): Array<string> {
        const sortedchangedFilesArray = path
            .sort( path => path.length )
            .reverse();
        
        return sortedchangedFilesArray;
    }

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