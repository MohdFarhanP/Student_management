export interface IUserRepository {
  findByEmailAndRole(
    email: string,
    role: string
  ): Promise<{ id: string; email: string; password: string } | null>;
  findByRefreshToken(
    token: string,
    role: string
  ): Promise<{ id: string; email: string; role: string } | null>;
  updatePassword(id: string, password: string): Promise<void>;
  updateRefreshToken(id: string, token: string | null): Promise<void>;
}
