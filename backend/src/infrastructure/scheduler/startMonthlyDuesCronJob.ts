import cron from 'node-cron';
import { IGenerateMonthlyDuesUseCase } from '../../domain/useCase/IGenerateMonthlyDuesUseCase';

export const startMonthlyDuesCronJob = (
  useCase: IGenerateMonthlyDuesUseCase
) => {
  cron.schedule('0 0 1 * *', async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.toISOString().slice(0, 7);
      await useCase.execute(currentMonth);
      console.log(`Generated monthly dues for ${currentMonth}`);
    } catch (error) {
      console.error('Error generating monthly dues:', error);
    }
  });
};
