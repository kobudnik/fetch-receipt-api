import { Receipt, ReceiptController } from '../types';
import { v4 as generateID } from 'uuid';

const savedReceipts: { [key: string]: Receipt } = {};

const errorTemplate = {
  log: 'Error in receipt middleware',
  status: 400,
  message: 'Error in receipt middleware'
};

export const receiptController: ReceiptController = {
  processReceipt: (req, res, next) => {
    const id = generateID();
    res.locals.id = id;
    savedReceipts[id] = req.body;
    console.log(savedReceipts);
    return next();
  },
  validateReceipt: (req, res, next) => {
    const receipt: Receipt = req.body;
    if (
      !receipt.retailer ||
      !receipt.purchaseDate ||
      !receipt.purchaseTime ||
      !receipt.items ||
      !receipt.items[0].shortDescription ||
      !receipt.items[0].price ||
      !receipt.total
    ) {
      return next({
        ...errorTemplate,
        message: 'Receipt is missing properties'
      });
    } else if (
      typeof receipt.retailer !== 'string' ||
      typeof receipt.purchaseDate !== 'string' ||
      typeof receipt.purchaseTime !== 'string' ||
      !Array.isArray(receipt.items) ||
      typeof receipt.items[0].shortDescription !== 'string' ||
      typeof receipt.items[0].price !== 'string' ||
      typeof receipt.total !== 'string'
    ) {
      return next({ ...errorTemplate, message: 'Invalid data types' });
    } else {
      return next();
    }
  }
};
