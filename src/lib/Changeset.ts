const cprint = require('color-print');
const path = require('path');
const fs = require('fs');
import { WardenFile } from './WardenFile';
import { findWarden } from './PrintService';

export class Changeset {
    public readonly wardenMap: Map<WardenFile, Array<string>>;
    private readonly wardenFileLocationArray: Array<string> = [];
    private readonly wardenFileArray: Array<WardenFile> = [];

    constructor (
        _changedFiles: Array<string>,
    ) {
        this.wardenMap = new Map();
        this.locateWardenForChangeAndBuildMap(_changedFiles);
    }

    private locateWardenForChangeAndBuildMap (_changedFiles: Array<string>): void {
        for (let i = 0 ; i < _changedFiles.length ; i++) {
            const changedFilePath = _changedFiles[i];
            const _wardenFileLocation: string = this.findWardenFileAndCheckValidity(changedFilePath);
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

    private findWardenFileAndCheckValidity (_path:string): string {
        if (_path) {
            const location = findWarden(_path);
            if (!location) {
                return '';
            }
            return location;
        } else {
            return '';       
        }
    }
}