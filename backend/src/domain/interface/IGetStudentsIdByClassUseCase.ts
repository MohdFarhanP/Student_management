import { StudentIdsDTO } from "../types/interfaces";

export interface IGetStudentsIdByClassUseCase{
 execute(classId: string): Promise<StudentIdsDTO>
}
