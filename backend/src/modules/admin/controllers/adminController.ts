import { Request, Response } from "express";
import { AdminRepository } from "../repositories/adminRepository";
import { LoginUseCase } from "../useCases/login/loginUseCase";

const adminRepository = new AdminRepository();
const loginUseCase = new LoginUseCase(adminRepository);

export class AdminController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const admin = await loginUseCase.execute(email, password);
      res.json( admin );
      return;
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
  }
}
