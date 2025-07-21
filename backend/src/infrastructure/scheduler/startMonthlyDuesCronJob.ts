import cron from 'node-cron';
import { IGenerateMonthlyDuesUseCase } from '../../domain/useCase/IGenerateMonthlyDuesUseCase';
import logger from '../../logger';

export const startMonthlyDuesCronJob = (
  useCase: IGenerateMonthlyDuesUseCase
) => {
  cron.schedule('0 0 1 * *', async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.toISOString().slice(0, 7);
      await useCase.execute(currentMonth);
      logger.info(`Generated monthly dues for ${currentMonth}`);
    } catch (error) {
      logger.error('Error generating monthly dues:', error);
    }
  });
};
