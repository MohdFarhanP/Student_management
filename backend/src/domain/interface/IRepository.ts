export interface IRepository<T> {
  insertMany(data: T[]): Promise<void>;
  getAll(
    page: number,
    limit: number
  ): Promise<{ data: T[]; totalCount: number }>;
}
