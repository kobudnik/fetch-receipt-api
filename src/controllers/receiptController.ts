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
    savedReceipts[id] = { ...req.body, points: 0 };
    calculatePoints(id);
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

const calculatePoints = (receiptID: string) => {
  const receipt = savedReceipts[receiptID];
  receipt.points += calculatePointsFromRetailer(receipt.retailer);
  receipt.points += calculatePointsFromTotal(receipt.total);
  receipt.points += calculatePointsFromItems(receipt.items);
};

const calculatePointsFromRetailer = (retailerName: string) => {
  const alphanumericRegex = /[a-zA-Z0-9]+/g;
  const validLetters = retailerName.match(alphanumericRegex);
  if (!validLetters) return 0;
  return validLetters[0].length;
};

const calculatePointsFromTotal = (totalPrice: string) => {
  let points = 0;
  if (Number(totalPrice) % 1 === 0) points += 50;
  if (Number(totalPrice) % 0.25 === 0) points += 25;
  return points;
};

const calculatePointsFromItems = (
  items: { shortDescription: string; price: string }[]
) => {
  let points = Math.floor(items.length / 2);
  for (let i = 0; i < items.length; i++) {
    if (validateTrimmedLength(items[i].shortDescription)) {
      const pointsEarned = Math.ceil(Number(items[i].price) * 0.2);
      points += pointsEarned;
    }
  }

  return points;
};

const validateTrimmedLength = (description: string) => {
  return description.trim().length % 3 === 0;
};
