import { Gender } from '../types/enums';

export class StudentEntity {
  id?: string;
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: Gender;
  age: number;
  class?: string | null;
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

  constructor(data: {
    id?: string;
    name: string;
    email: string;
    roleNumber: string;
    dob: string;
    gender: Gender;
    age: number;
    class?: string | null;
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
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.roleNumber = data.roleNumber;
    this.dob = data.dob;
    this.gender = data.gender;
    this.age = data.age;
    this.class = data.class || null;
    this.password = data.password;
    this.profileImage = data.profileImage || '';
    this.address = {
      houseName: data.address.houseName,
      place: data.address.place,
      district: data.address.district,
      pincode: data.address.pincode,
      phoneNo: data.address.phoneNo,
      guardianName: data.address.guardianName,
      guardianContact: data.address.guardianContact ?? null,
    };
  }
}
