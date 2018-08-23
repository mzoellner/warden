export type Human = {
    name: string;
    email: string;
}

export class WardenFile {
  public readonly filePath: string = '';
  public readonly contents: string = '';
  // public readonly humans: Array<Human>;

  constructor (_filePath: string) {
    this.filePath = _filePath;
  };
}