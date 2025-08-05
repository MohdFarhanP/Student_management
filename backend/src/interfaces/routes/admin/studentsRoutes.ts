import express from 'express';
import { IStudentController } from '../../controllers/admin/student/IStudentController';
import { authenticateUser } from '../../middleware/authenticateUser';
import { IRecurringFeeController } from '../../controllers/admin/fees/IRecurringFeeController';
import { IPaymentController } from '../../controllers/admin/payment/IPaymentController';

const router = express.Router();

let studentController: IStudentController | null = null;
let recurringFeeController: IRecurringFeeController | null = null;
let paymentController: IPaymentController | null = null;

export const setStudentController = (controllers: {
  studentController: IStudentController;
  recurringFeeController: IRecurringFeeController;
  paymentController: IPaymentController;
}) => {
  studentController = controllers.studentController;
  recurringFeeController = controllers.recurringFeeController;
  paymentController = controllers.paymentController;
};

router.get('/students', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.getStudents.bind(studentController)(req, res, next);
});

router.post('/student', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.addStudent.bind(studentController)(req, res, next);
});

router.post('/fees/recurring', authenticateUser, (req, res, next) => {
  if (!recurringFeeController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  recurringFeeController.createRecurringFee.bind(recurringFeeController)(
    req,
    res,
    next
  );
});

router.get('/fees/recurring', authenticateUser, (req, res, next) => {
  if (!recurringFeeController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  recurringFeeController.getAllRecurringFees.bind(recurringFeeController)(
    req,
    res,
    next
  );
});

router.get('/payments', authenticateUser, (req, res, next) => {
  if (!paymentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  paymentController.getPaymentStatuses.bind(paymentController)(req, res, next);
});

router.patch('/:studentId', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.editStudent.bind(studentController)(req, res, next);
});

router.delete('/:studentId', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.deleteStudent.bind(studentController)(req, res, next);
});

router.get('/profile/:email', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.getProfile.bind(studentController)(req, res, next);
});

router.get('/sessions/:userId', authenticateUser, (req, res, next) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.getSessions.bind(studentController)(req, res, next);
});

router.get('/search', authenticateUser, (req, res) => {
  if (!studentController) {
    throw new Error(
      'StudentController not initialized. Dependency injection failed.'
    );
  }
  studentController.searchStudents(req, res);
});

export default router;
