import mongoose from 'mongoose';
import { IStudent } from '../types/interfaces';
import { Gender } from '../types/enums';

export class Student implements IStudent {
  id?: string;
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: Gender;
  age: number;
  class?: mongoose.Types.ObjectId | string | null;
  password?: string;
  profileImage?: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact?: string | null;
  };

  constructor(data: Partial<IStudent>) {
    this.id = data.id;
    this.name = data.name || 'Unknown';
    this.email = data.email || '';
    this.roleNumber = data.roleNumber || '';
    this.dob = data.dob || '';
    this.gender = data.gender || Gender.Male; // Use Gender enum
    this.age = data.age || 0;
    this.class = data.class || null;
    this.password = data.password;
    this.profileImage = data.profileImage || '';
    this.address = {
      houseName: data.address?.houseName || '',
      place: data.address?.place || '',
      district: data.address?.district || '',
      pincode: data.address?.pincode || 0,
      phoneNo: data.address?.phoneNo || 0,
      guardianName: data.address?.guardianName || '',
      guardianContact: data.address?.guardianContact ?? null,
    };
  }
}