import request from 'supertest';
import app from '../src/app';
import fs from 'fs';
import path from 'path';
import { v4 as generateID } from 'uuid';
import {
  validReceiptA,
  validReceiptB,
  invalidDateFormat,
  invalidTimeFormat,
  missingProperties,
  invalidItemsPrice,
  invalidItemsDescription
} from '../src/data/mockReceipts';

describe('Receipt Endpoint Testing', () => {
  const pathToReceipts = path.resolve(
    __dirname,
    '../src/data/receipts.test.json'
  );
  // Function to read the receipts from the JSON file
  const getReceipts = () => {
    try {
      const fileContents = fs.readFileSync(pathToReceipts, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading receipts:', error);
      return {};
    }
  };

  const resetReceipts = () => {
    // Write the empty data to the JSON file
    fs.writeFileSync(pathToReceipts, JSON.stringify({}), 'utf-8');
  };

  describe('POST /receipts/process', () => {
    beforeAll(() => {
      resetReceipts();
    });

    it('should return a 200 status, return a generated ID, calculate points, and save the receipt with points', async () => {
      // Create a mock receipt and save it to the JSON file

      const response = await request(app)
        .post(`/receipts/process`)
        .send(validReceiptA)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      const generatedID = response.body.id;
      expect(typeof generatedID).toBe('string');
      expect(generatedID).toHaveLength(36);
      const savedReceipts = getReceipts(); // Read the saved receipts from the JSON file
      expect(savedReceipts).toHaveProperty(generatedID); // Check if the generated ID is present in the saved receipts
      expect(savedReceipts[generatedID]).toEqual({
        ...validReceiptA,
        points: 28
      }); // Verify that the stored receipt matches the mock receipt
    });
    it('should add new receipts to the collection without overwriting', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(validReceiptB)
        .set('Accept', 'application/json');
      const generatedID = response.body.id;
      const savedReceipts = getReceipts();
      expect(savedReceipts).toHaveProperty(generatedID);
      expect(Object.keys(savedReceipts).length).toEqual(2);
      expect(savedReceipts[generatedID]).toEqual({
        ...validReceiptB,
        points: 109
      });
    });
  });
});
