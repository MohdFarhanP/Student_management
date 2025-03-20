import { AdminModel } from '../database/models/adminModel.js';

export class AdminRepository {
  async findByEmail(
    email: string
  ): Promise<{ id: string; email: string; password: string } | null> {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return null;
    return {
      id: admin.id,
      email: admin.email,
      password: admin.password,
    };
  }
}
