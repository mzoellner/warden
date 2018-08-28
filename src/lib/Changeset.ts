const cprint = require('color-print');
const path = require('path');
const fs = require('fs');
import { WardenFile } from './WardenFile';
import { findWarden } from './findWarden';

export class Changeset {
    public readonly wardenMap: Map<WardenFile, Array<string>>;
    private readonly wardenFileLocationArray: Array<string> = [];
    private readonly wardenFileArray: Array<WardenFile> = [];

    constructor (
        _changedFilePaths: Array<string>
    ) {
        this.wardenMap = new Map();
        this.locateWardenForChangeAndBuildMap(_changedFilePaths);
    }

    public printWardenMap (): void {
        let sortedMap = this.sortMapByPathsLength(this.wardenMap);        
        sortedMap.forEach((filePaths, wardenFile) => {
            const names = wardenFile.humans.map(human => human.name).join(` , `);
            let formatName = cprint.toBackgroundMagenta(names.padEnd(48));
            let formatPaths = cprint.toLightGreen(filePaths.join('\n    '));
            console.log(
`    ${formatName} 
    ${formatPaths}
`
            );
        });
    }

    private sortMapByPathsLength (_map: Map<WardenFile, Array<string>>): Map<WardenFile, Array<string>> {
        let _sortedMap = new Map( 
            [..._map.entries()]
            .sort( (x, y) => x[1].length - y[1].length )
            .reverse()
        );
        
        return _sortedMap;
    }

    private locateWardenForChangeAndBuildMap (_changedFilePaths: Array<string>): void {
        for (let i = 0 ; i < _changedFilePaths.length ; i++) {
            const changedFilePath = _changedFilePaths[i];
            const _wardenFileLocation: string = this.findWardenFilePath(changedFilePath);
            if (!_wardenFileLocation) {
                continue;
            }
            let wardenFile = this.wardenFileArray.find(warden => warden.filePath === _wardenFileLocation);
            if (!wardenFile) {
                wardenFile = new WardenFile(_wardenFileLocation);
                this.wardenFileArray.push(wardenFile);
            }
            if (!this.wardenMap.has(wardenFile)) {
                this.wardenMap.set(wardenFile, []);
            }
            this.wardenMap.get(wardenFile).push(changedFilePath);
        }
    }

    private findWardenFilePath (_path:string): string {
        if (!_path) {
            return '';    
        }
        const location = findWarden(_path);
        if (!location) {
            return '';
        }
        return location;
    }
}
