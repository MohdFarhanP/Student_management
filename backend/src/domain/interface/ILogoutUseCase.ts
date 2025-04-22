export interface ILogoutUseCase {
    execute(refreshToken: string): Promise<void>;
  }