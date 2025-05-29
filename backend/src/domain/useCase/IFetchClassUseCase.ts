export interface IFetchClassUseCase {
  execute(): Promise<{ _id: string; name: string }[]>;
}
