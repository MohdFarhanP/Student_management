import { ObjectId } from '../../types/index.js';

export interface IRepository<T> {
  insertMany(data: T[]): Promise<void>;
  getAllByLimit(
    page: number,
    limit: number
  ): Promise<{ data: T[]; totalCount: number }>;
  getAll(): Promise<{ data: T[] }>;
  getById(id: ObjectId): Promise<T>;
}
