export interface IUserRepository {
  findByEmailAndRole(
    email: string,
    role: string
  ): Promise<{ id: string; email: string; password: string } | null>;
  updatePassword(id: string, password: string): Promise<void>;
}
