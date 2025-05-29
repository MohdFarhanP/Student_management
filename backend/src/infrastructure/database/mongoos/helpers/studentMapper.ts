import { IStudent } from '../../../../domain/types/interfaces';
import { Gender } from '../../../../domain/types/enums';

export const mapToFullStudent = (data: any): IStudent => ({
  id: data._id?.toString(),
  name: data.name,
  email: data.email,
  roleNumber: data.roleNumber,
  dob: data.dob,
  gender: data.gender === 'Male' ? Gender.Male : Gender.Female,
  age: data.age,
  class:
    typeof data.class === 'string'
      ? data.class
      : data.class?.name || data.class?.toString() || '',
  password: data.password ?? '',
  profileImage: data.profileImage ?? '',
  address: {
    houseName: data.address?.houseName || '',
    place: data.address?.place || '',
    district: data.address?.district || '',
    pincode: data.address?.pincode || 0,
    phoneNo: data.address?.phoneNo || 0,
    guardianName: data.address?.guardianName || '',
    guardianContact: data.address?.guardianContact ?? '',
  },
});
