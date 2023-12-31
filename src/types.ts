import { Request, Response, NextFunction } from 'express';

export interface ServerError {
  log: string;
  status: number;
  message: string;
}

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface ReceiptController {
  validateReceipt: MiddlewareFunction;
  processReceipt: MiddlewareFunction;
  getPoints: MiddlewareFunction;
  hasReceipt: MiddlewareFunction;
}

export interface SubmittedReceipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: {
    shortDescription: string;
    price: string;
  }[];
  total: string;
}

export interface ProcessedReceipt extends SubmittedReceipt {
  points: number;
}

export interface ReceiptsStore {
  [key: string]: ProcessedReceipt;
}
