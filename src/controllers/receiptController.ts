import { SubmittedReceipt, ReceiptController } from '../types';
import { getReceipts, pathToReceipts } from '../utils/receiptUtils';
import { v4 as generateID } from 'uuid';
import fs from 'fs';

export const receiptController: ReceiptController = {
  getPoints: (req, res, next) => {
    const savedReceipts = getReceipts();
    res.locals.points = savedReceipts[req.params.id].points;
    return next();
  },

  hasReceipt: (req, res, next) => {
    const savedReceipts = getReceipts();
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
    const savedReceipts = getReceipts();
    const id = generateID();
    res.locals.id = id;
    const points = calculatePoints(req.body as SubmittedReceipt);
    savedReceipts[id] = { ...req.body, points };

    fs.writeFileSync(pathToReceipts, JSON.stringify(savedReceipts), 'utf-8');
    return next();
  },

  validateReceipt: (req, res, next) => {
    const receipt: SubmittedReceipt = req.body;
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
    if (isNaN(hour) || isNaN(minute) || time[1].length === 0) {
      return next({ ...errorTemplate, message: 'Invalid time formatting' });
    }

    return next();
  }
};

export function calculatePoints(receipt: SubmittedReceipt) {
  let points = 0;
  points += calculatePointsFromRetailer(receipt.retailer);
  points += calculatePointsFromTotal(receipt.total);
  points += calculatePointsFromItems(receipt.items);
  points += calculatePointsFromDay(receipt.purchaseDate);
  points += calculatePointsFromTime(receipt.purchaseTime);
  return points;
}

export function calculatePointsFromRetailer(retailerName: string) {
  const alphanumericRegex = /[a-zA-Z0-9]+/g;
  const validLetters = retailerName.match(alphanumericRegex);
  if (!validLetters) return 0;
  return validLetters.join('').length;
}

export function calculatePointsFromTotal(totalPrice: string) {
  let points = 0;
  if (Number(totalPrice) % 1 === 0) points += 50;
  if (Number(totalPrice) % 0.25 === 0) points += 25;
  return points;
}

export function calculatePointsFromItems(
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

export function isQualifyingLength(description: string) {
  return description.trim().length % 3 === 0;
}

export function calculatePointsFromDay(purchaseDate: string) {
  const day = Number(purchaseDate.split('-')[2]);
  if (day % 2 !== 0) return 6;
  return 0;
}

export function calculatePointsFromTime(purchaseTime: string) {
  const time = purchaseTime.split(':');
  const hour = Number(time[0]);
  const minute = Number(time[1]);
  if ((hour === 14 && minute > 0) || hour === 15) return 10;
  return 0;
}

const errorTemplate = {
  log: 'Error in receipt middleware',
  status: 400,
  message: 'Error in receipt middleware'
};
