import mongoose from 'mongoose';
import { IRecurringFeeRepository } from '../../domain/repositories/IRecurringFeeRepository';
import { RecurringFee } from '../../domain/entities/RecurringFee';
import { RecurringFeeModel } from '../database/mongoos/models/RecurringFeeModel';
import { populate } from 'dotenv';

export class MongoRecurringFeeRepository implements IRecurringFeeRepository {
  async create(fee: RecurringFee): Promise<void> {
    try {
      const classId = fee.getClassId();
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        throw new Error(`Invalid classId: ${classId}`);
      }
      const feeModel = new RecurringFeeModel({
        title: fee.getTitle(),
        amount: fee.getAmount(),
        startMonth: fee.getStartMonth(),
        endMonth: fee.getEndMonth(),
        classId,
        recurring: fee.isRecurring(),
      });
      await feeModel.save();
    } catch (error) {
      console.log('error getting on recurring fee repository', error);
    }
  }

  async findActiveFees(currentMonth: string): Promise<RecurringFee[]> {
    const feeModels = await RecurringFeeModel.find({
      recurring: true,
      startMonth: { $lte: currentMonth },
      $or: [
        { endMonth: { $gte: currentMonth } },
        { endMonth: { $exists: false } },
      ],
    }).lean();

    return feeModels.map(
      (model) =>
        new RecurringFee(
          model._id.toString(),
          model.title,
          model.amount,
          model.startMonth,
          model.classId.toString(),
          model.recurring,
          model.endMonth
        )
    );
  }

  async findAll(): Promise<RecurringFee[]> {
    const feeModels = await RecurringFeeModel.find()
      .populate('classId', 'name')
      .lean();
    return feeModels.map((model) => {
      const classData = model.classId as {
        _id: mongoose.Types.ObjectId;
        name: string;
      };
      return new RecurringFee(
        model._id.toString(),
        model.title,
        model.amount,
        model.startMonth,
        classData._id.toString(),
        model.recurring,
        model.endMonth,
        classData.name
      );
    });
  }
}
