import { StudentFeeDue } from "../../../domain/entities/StudentFeeDue";
import { IStudentRepository } from "../../../domain/interface/admin/IStudentRepository";
import { IGenerateMonthlyDuesUseCase } from "../../../domain/interface/IGenerateMonthlyDuesUseCase";
import { IRecurringFeeRepository } from "../../../domain/interface/IRecurringFeeRepository";
import { IStudentFeeDueRepository } from "../../../domain/interface/IStudentFeeDueRepository";

export class GenerateMonthlyDuesUseCase implements IGenerateMonthlyDuesUseCase {
    constructor(
    private recurringFeeRepository: IRecurringFeeRepository,
    private studentRepository: IStudentRepository,
    private studentFeeDueRepository: IStudentFeeDueRepository
    ){}

    async execute(currentMonth: string): Promise<void> {
        const currentDate = new Date(currentMonth);
        const fees = await this.recurringFeeRepository.findActiveFees(currentMonth);

        for(const fee of fees) {
            if(!fee.isActiveForMonth(currentMonth)) continue;

            const students = await this.studentRepository.getStudentsByClass(fee.getClassId());
            const dues: StudentFeeDue[] = students.map((student)=>{
                const dueDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
                return new StudentFeeDue(
                    new Date().getTime().toString(), // Temporary ID
                    student.id,
                    fee.getTitle(),
                    currentMonth,
                    dueDate,
                    fee.getAmount()
                );
            });
            
            await this.studentFeeDueRepository.createMany(dues)
        }

    }
}