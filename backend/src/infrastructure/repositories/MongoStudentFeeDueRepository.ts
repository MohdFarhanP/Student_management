import mongoose from 'mongoose';
import { IStudentFeeDueRepository } from '../../domain/repositories/IStudentFeeDueRepository';
import { StudentFeeDue } from '../../domain/entities/StudentFeeDue';
import { StudentFeeDueModel } from '../database/mongoos/models/StudentFeeDueModel';
import logger from '../../logger';

function isValidObjectId(id: any): boolean {
  return mongoose.Types.ObjectId.isValid(id) && String(id).length === 24;
}

export class MongoStudentFeeDueRepository implements IStudentFeeDueRepository {
  async createMany(dues: StudentFeeDue[]): Promise<void> {
    const models = dues.map((due) => ({
      studentId: new mongoose.Types.ObjectId(due.getStudentId()),
      feeTitle: due.getFeeTitle(),
      month: due.getMonth(),
      dueDate: due.getDueDate(),
      amount: due.getAmount(),
      isPaid: due.isPaidStatus(),
      paymentId: due.getPaymentId()
        ? new mongoose.Types.ObjectId(due.getPaymentId())
        : undefined,
    }));
    await StudentFeeDueModel.insertMany(models);
  }

  async findUnpaidByStudentId(studentId: string): Promise<StudentFeeDue[]> {
    const models = await StudentFeeDueModel.find({
      studentId: new mongoose.Types.ObjectId(studentId),
      isPaid: false,
    }).lean();

    return models.map(
      (model) =>
        new StudentFeeDue(
          model._id.toString(),
          model.studentId.toString(),
          model.feeTitle,
          model.month,
          model.dueDate,
          model.amount,
          model.isPaid
        )
    );
  }

  async update(feeDue: StudentFeeDue): Promise<void> {
    try {
      const paymentIdRaw = feeDue.getPaymentId();
      let paymentIdObj;

      if (paymentIdRaw) {
        if (isValidObjectId(paymentIdRaw)) {
          paymentIdObj = new mongoose.Types.ObjectId(paymentIdRaw);
        } else {
          logger.error(`Invalid paymentId provided: ${paymentIdRaw}`);
          paymentIdObj = undefined;
        }
      } else {
        paymentIdObj = undefined;
      }

      await StudentFeeDueModel.updateOne(
        { _id: feeDue.getId() },
        {
          feeTitle: feeDue.getFeeTitle(),
          month: feeDue.getMonth(),
          dueDate: feeDue.getDueDate(),
          amount: feeDue.getAmount(),
          isPaid: feeDue.isPaidStatus(),
          paymentId: paymentIdObj,
        }
      );
    } catch (error) {
      logger.error('form update on mongostddrrdue repo', error);
      throw error;
    }
  }

  async findAll(): Promise<StudentFeeDue[]> {
    const models = await StudentFeeDueModel.find().lean();
    return models.map(
      (model) =>
        new StudentFeeDue(
          model._id.toString(),
          model.studentId.toString(),
          model.feeTitle,
          model.month,
          model.dueDate,
          model.amount,
          model.isPaid,
          model.paymentId?.toString()
        )
    );
  }
}
