import { Admin } from "../entities/admin";
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

const AdminModel = mongoose.model("Admin",AdminSchema);



export class AdminRepository {
  // Find admin by email
  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return null;
    return Admin.create(admin.id, admin.email, admin.password);
  }

}
