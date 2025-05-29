export class FileEntity {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly size: number,
    public readonly content?: Buffer | Blob
  ) {}
}
