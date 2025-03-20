export class Admin {
  constructor(
    public id: string,
    public email: string,
    public password: string
  ) {}

  static create(id: string, email: string, password: string) {
    return new Admin(id, email, password);
  }
}
