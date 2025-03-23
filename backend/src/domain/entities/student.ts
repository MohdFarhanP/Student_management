import mongoose from 'mongoose';

export class Student {
  id?: string;
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: 'Male' | 'Female';
  age: number;
  class?: string | mongoose.Types.ObjectId | null;
  subjectIds?: (string | mongoose.Types.ObjectId)[];
  password?: string;
  profileImage?: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact: string | null;
  };

  constructor(data: Partial<Student>) {
    this.id = data.id;
    this.name = data.name || 'Unknown';
    this.email = data.email || '';
    this.roleNumber = data.roleNumber || '';
    this.dob = data.dob || '';
    this.gender = data.gender || 'Male';
    this.age = data.age || 0;
    this.class = data.class || null;
    this.profileImage = data.profileImage || '';
    this.address = {
      houseName: data.address?.houseName || '',
      place: data.address?.place || '',
      district: data.address?.district || '',
      pincode: data.address?.pincode || 0,
      phoneNo: data.address?.phoneNo || 0,
      guardianName: data.address?.guardianName || '',
      guardianContact: data.address?.guardianContact || null,
    };
  }
}
