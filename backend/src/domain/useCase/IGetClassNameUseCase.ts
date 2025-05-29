export interface IGetClassNameUseCase {
  execute(): Promise<{ grade: string }[]>;
}
