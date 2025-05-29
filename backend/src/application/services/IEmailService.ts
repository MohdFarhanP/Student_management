export interface IEmailService {
  sendDefaultPasswordEmail(to: string, password: string): Promise<void>;
}
