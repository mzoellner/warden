export type Human = {
    name: string;
    email: string;
}

export class WardenFile {
    public readonly filePath: string;
    public readonly humans: Array<Human>;

    constructor (jsonString, filePath) {
        // This should take in paths, and get the humans array for a given path.
        // When printed, this file should put out 


        // parse .wardenfile from disk, assign properties to this class, validate etc.
        // const _parsedWardenFile = jsonString.parse();?
        // isWardenFileValid


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
        console.log(jsonString, filePath);
        // this.humans.push(jsonString.humans);
        };
    }

  //   private isWardenFileValid (wardenFileContents): boolean {
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
}