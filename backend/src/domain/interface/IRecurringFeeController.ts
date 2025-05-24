import { Request, Response } from "express";

export interface IRecurringFeeController {
createRecurringFee(req: Request, res: Response): Promise<void>;
getAllRecurringFees(req: Request, res: Response): Promise<void>
}