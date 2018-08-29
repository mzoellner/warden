const cprint = require('color-print');

export type Human = {
    name: string;
    email: string;
}

export class WardenFile {
    public readonly filePath: string = '';
    public readonly humans: Array<Human> = [];

    constructor (_filePath: string) {
        this.filePath = _filePath;
        const wardenFileData = this.readWardenFile(_filePath);
        if (wardenFileData) {
            this.humans = wardenFileData.humans;
        }
    };

    public printWardenFile (in_indent: string = '') {
        if (!this.humans) {
            return;
        }
        const wardens = cprint.toGreen(this.humans.map(human => human.name).join('\n\t' + in_indent));
        console.log(in_indent + cprint.toGreen(this.filePath) + ' ' + cprint.toCyan(' =>') + '\n\t' + in_indent + wardens);
    }

    private readWardenFile (_filePath: string): WardenFile | null {
            const wardenFileData: WardenFile = require(_filePath);
            if (!this.isWardenFileValid(wardenFileData, _filePath)) {
                throw new Error('Invalid warden file: ' + _filePath);
            }
            return wardenFileData;
    }

    private isWardenFileValid (wardenFileData: WardenFile, _filePath: string): boolean {
        if (!wardenFileData.humans || (!!wardenFileData.humans && !wardenFileData.humans.length)) {
            throw new Error('Warden file does not contain humans: ' + _filePath);
        }
        const isHumansInvalid = wardenFileData.humans.some(human => !human.name || !human.email);
        if (isHumansInvalid) {
            throw new Error('Humans in warden file are not in valid format: ' + _filePath);
        }
        return true;
    }
}
