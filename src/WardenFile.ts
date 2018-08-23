export type Human = {
    name: string;
    email: string;
}

export class WardenFile {
  public readonly filePath: string = '';
  public readonly contents: string = '';
  // public readonly humans: Array<Human>;
  // const fileContents = fs.readFileSync(location, 'utf8']);
  // const _wardenFile = new WardenFile(fileContents, location);

  constructor (_filePath: string) {
    this.filePath = _filePath;
  };
}