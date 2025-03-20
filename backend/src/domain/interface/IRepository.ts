export interface IRepository<T> {
  insertMany(data: T[]): Promise<void>;
}
