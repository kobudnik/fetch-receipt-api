import { Receipt, ReceiptController } from '../types';
import { v4 as generateID } from 'uuid';

const errorTemplate = {
  log: 'Error in receipt middleware',
  status: 400,
  message: 'Error in receipt middleware'
};

const savedReceipts: { [key: string]: Receipt } = {};

export const receiptController: ReceiptController = {
  getPoints: (req, res, next) => {
    res.locals.points = savedReceipts[req.params.id].points;
    return next();
  },

  hasReceipt: (req, res, next) => {
    if (!savedReceipts[req.params.id]) {
      return next({
        ...errorTemplate,
        status: 404,
        message: 'No receipt found for that id'
      });
    }
    return next();
  },
  processReceipt: (req, res, next) => {
    const id = generateID();
    res.locals.id = id;
    savedReceipts[id] = { ...req.body, points: 0 };
    calculatePoints(id);
    return next();
  },

  validateReceipt: (req, res, next) => {
    const receipt: Receipt = req.body;
    if (
      typeof receipt.retailer !== 'string' ||
      typeof receipt.purchaseDate !== 'string' ||
      typeof receipt.purchaseTime !== 'string' ||
      !Array.isArray(receipt.items) ||
      receipt.items.some(
        (item) =>
          typeof item.shortDescription !== 'string' ||
          typeof item.price !== 'string' ||
          isNaN(Number(item.price))
      ) ||
      typeof receipt.total !== 'string' ||
      isNaN(Number(receipt.total))
    ) {
      return next({
        ...errorTemplate,
        log: 'Error validating receipt',
        message: 'Malformed query: Missing properties or invalid data types'
      });
    }
    //Validate date and time string formatting
    const day = Number(receipt.purchaseDate.split('-')[2]);
    if (isNaN(day)) {
      return next({ ...errorTemplate, message: 'Invalid date formatting' });
    }
    const time = receipt.purchaseTime.split(':');
    const hour = Number(time[0]);
    const minute = Number(time[1]);
    if (isNaN(hour) || isNaN(minute)) {
      return next({ ...errorTemplate, message: 'Invalid time formatting' });
    }

    return next();
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
    if (isQualifyingLength(items[i].shortDescription)) {
      points += Math.ceil(Number(items[i].price) * 0.2);
    }
  }
  return points;
}

function isQualifyingLength(description: string) {
  return description.trim().length % 3 === 0;
}

function calculatePointsFromDay(purchaseDate: string) {
  const day = Number(purchaseDate.split('-')[2]);
  if (day % 2 !== 0) return 6;
  return 0;
}

function calculatePointsFromTime(purchaseTime: string) {
  const time = purchaseTime.split(':');
  const hour = Number(time[0]);
  const minute = Number(time[1]);
  if ((hour === 14 && minute > 0) || hour === 15) return 10;
  return 0;
}
