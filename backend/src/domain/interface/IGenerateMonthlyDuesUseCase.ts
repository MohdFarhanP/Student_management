export interface IGenerateMonthlyDuesUseCase {
    execute(currentMonth: string): Promise<void>
}