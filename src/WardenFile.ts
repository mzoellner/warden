export type Human = {
    name: string;
    email: string;
}

export class WardenFile {
    public readonly filePath: string;
    public readonly humans: Array<Human>;

    constructor (jsonString) {
        // parse .wardenfile from disk, assign properties to this class, validate etc.
        const _parsedWardenFile = jsonString.parse();
        if ( _parsedWardenFile ) {
                this.humans.push(_parsedWardenFile.humans);
        };
    }

    public getWardenMap (_changedPaths:any): Promise<Map<string, Array<string>>> {
        let wardenMap = new Map();
      
        for (let i=0 ; i < _changedPaths.length ; i++) {
          let path = _changedPaths[i];
          let wardenFileContents = await parseWardenFileName(path);
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
}