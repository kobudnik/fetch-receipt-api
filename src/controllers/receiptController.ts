import { Receipt, ReceiptController } from '../types';
import { v4 as generateID } from 'uuid';

const savedReceipts: { [key: string]: Receipt } = {};

const errorTemplate = {
  log: 'Error in receipt middleware',
  status: 400,
  message: 'Error in receipt middleware'
};

export const receiptController: ReceiptController = {
  getPoints: (req, res, next) => {
    if (!savedReceipts[req.params.id])
      return next({ ...errorTemplate, status: 404, message: 'Invalid ID' });
    res.locals.points = savedReceipts[req.params.id].points;
    return next();
  },
  processReceipt: (req, res, next) => {
    const id = generateID().replaceAll('-', '');
    res.locals.id = id;
    savedReceipts[id] = { ...req.body, points: 0 };
    calculatePoints(id);
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
        message: 'Malformed Query: Receipt is missing properties'
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
      return next({
        ...errorTemplate,
        message: 'Malformed query: Invalid data types'
      });
    } else {
      return next();
    }
  }
};

function calculatePoints(receiptID: string) {
  const receipt = savedReceipts[receiptID];
  receipt.points += calculatePointsFromRetailer(receipt.retailer);
  receipt.points += calculatePointsFromTotal(receipt.total);
  receipt.points += calculatePointsFromItems(receipt.items);
  receipt.points += calculatePointsFromDay(receipt.purchaseDate);
  receipt.points += calculatePointsFromTime(receipt.purchaseTime);
}

function calculatePointsFromRetailer(retailerName: string) {
  const alphanumericRegex = /[a-zA-Z0-9]+/g;
  const validLetters = retailerName.match(alphanumericRegex);
  if (!validLetters) return 0;
  return validLetters.join('').length;
}

function calculatePointsFromTotal(totalPrice: string) {
  let points = 0;
  if (Number(totalPrice) % 1 === 0) points += 50;
  if (Number(totalPrice) % 0.25 === 0) points += 25;
  return points;
}

function calculatePointsFromItems(
  items: { shortDescription: string; price: string }[]
) {
  let points = Math.floor(items.length / 2) * 5;
  for (let i = 0; i < items.length; i++) {
    if (validateTrimmedLength(items[i].shortDescription)) {
      points += Math.ceil(Number(items[i].price) * 0.2);
    }
  }
  return points;
}

function validateTrimmedLength(description: string) {
  return description.trim().length % 3 === 0;
}

function calculatePointsFromDay(purchaseDate: string) {
  const day = purchaseDate.split('-')[2];
  if (Number(day) % 2 !== 0) return 6;
  return 0;
}

function calculatePointsFromTime(purchaseTime: string) {
  const time = purchaseTime.split(':');
  const hour = Number(time[0]);
  const minute = Number(time[1]);
  if ((hour === 14 && minute > 0) || hour === 15) return 10;
  return 0;
}
