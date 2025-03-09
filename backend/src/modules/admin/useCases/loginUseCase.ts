import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminRepository } from "../repositories/adminRepository";

import dotenv from "dotenv";
dotenv.config();

export class LoginUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Admin not found");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new Error("invalid userName or password");
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET as string;
    
    const token = jwt.sign({ id: admin.id, email: admin.email },jwtSecret, {
      expiresIn: "1h",
    });
    
    return {
      user: admin.email,  
      token
    }
      
  }
}
