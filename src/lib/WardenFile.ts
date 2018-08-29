const cprint = require('color-print');
const fs = require('fs');

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
    try {
        const wardenFileData: WardenFile = require(_filePath);
        if (!this.isWardenFileValid(wardenFileData)) {
            cprint.yellow('Invalid warden file: ' + _filePath);
            return null;
        }
        return wardenFileData;
    } catch (e) {
        cprint.yellow('Could not read warden file: ' + _filePath);
        return null;
    }
  }

  private isWardenFileValid (wardenFileData: WardenFile): boolean {
    if (!wardenFileData.humans || (!!wardenFileData.humans && !wardenFileData.humans.length)) {
        cprint.yellow('Warden file does not contain humans');
        return false;
    }
    const isHumansInvalid = wardenFileData.humans.some(human => !human.name || !human.email);
    if (isHumansInvalid) {
        cprint.yellow('Humans in warden file are not in valid format');
        return false;
    }
    return true;
  }
}
