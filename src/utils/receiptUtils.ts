import fs from 'fs';
import path from 'path';
import { ReceiptsStore } from '../types';

export const pathToReceipts =
  process.env.NODE_ENV === 'test'
    ? path.resolve(process.cwd(), 'src/data/receipts.test.json')
    : path.resolve(process.cwd(), 'src/data/receipts.json');

export function getReceipts(): ReceiptsStore {
  try {
    const savedReceipts = JSON.parse(fs.readFileSync(pathToReceipts, 'utf-8'));
    return savedReceipts;
  } catch (error) {
    throw new Error('Error reading receipts: ' + error);
  }
}

export function resetReceipts() {
  fs.writeFileSync(pathToReceipts, JSON.stringify({}), 'utf-8');
}
