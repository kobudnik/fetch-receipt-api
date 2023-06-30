import request from 'supertest';
import app from '../src/app';
import fs from 'fs';
import path from 'path';

import {
  validReceipt28,
  validReceipt109,
  validReceipt59,
  invalidDateFormat,
  invalidTimeFormat,
  missingProperties,
  missingItemsProperty,
  invalidDataType,
  invalidItemsPrice,
  invalidItemsDescription
} from '../src/data/mockReceipts';

describe('Receipt Endpoint Testing', () => {
  const pathToReceipts = path.resolve(
    __dirname,
    '../src/data/receipts.test.json'
  );

  function getReceipts() {
    try {
      const fileContents = fs.readFileSync(pathToReceipts, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading receipts:', error);
      return {};
    }
  }

  function resetReceipts() {
    fs.writeFileSync(pathToReceipts, JSON.stringify({}), 'utf-8');
  }

  describe('POST /receipts/process', () => {
    beforeAll(() => resetReceipts());

    it('should handle submitted receipts with missing properties', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(missingProperties)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'Malformed query: Missing properties or invalid data types'
      );
    });
    it('should handle properties with invalid data types', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidDataType)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'Malformed query: Missing properties or invalid data types'
      );
    });

    it('should ensure all objects in items array have required properties', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(missingItemsProperty)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'Malformed query: Missing properties or invalid data types'
      );
    });

    it('should handle invalid data type on item description', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidItemsDescription)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'Malformed query: Missing properties or invalid data types'
      );
    });

    it('should handle invalid data type on item price', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidItemsPrice)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'Malformed query: Missing properties or invalid data types'
      );
    });

    it('should handle improperly formatted dates', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidDateFormat)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid date formatting');
    });

    it('should handle improperly formatted times', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidTimeFormat)
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid time formatting');
    });

    it('should not save a receipt if a 200 status is not returned', () => {
      const receipts = getReceipts();
      expect(Object.keys(receipts).length).toEqual(0);
    });

    it('calculate points on valid submissions, add points to the receipt, save the receipt, and return a 200 status and generated ID', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(validReceipt28)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      const generatedID = response.body.id;
      expect(typeof generatedID).toBe('string');
      expect(generatedID).toHaveLength(36);
      const savedReceipts = getReceipts(); //
      expect(savedReceipts).toHaveProperty(generatedID);
      expect(savedReceipts[generatedID]).toEqual({
        ...validReceipt28,
        points: 28
      });
    });
    it('should add new receipts to the collection without overwriting', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(validReceipt109)
        .set('Accept', 'application/json');
      const generatedID = response.body.id;
      const savedReceipts = getReceipts();
      expect(savedReceipts).toHaveProperty(generatedID);
      expect(Object.keys(savedReceipts).length).toEqual(2);
      expect(savedReceipts[generatedID]).toEqual({
        ...validReceipt109,
        points: 109
      });
    });
  });
  describe('GET /receipts/{id}/points', () => {
    it('should handle requests for unknown ids', async () => {
      const randomID = 'ZskY90asS-7e2b-4328-b21d-600592dcbe7b';
      const response = await request(app)
        .get(`/receipts/${randomID}/points`)
        .send()
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('No receipt found for that id');
    });

    it('should return the calculated points associated with the receipt', async () => {
      //post a new receipt in order to get the id to query in our get request
      const submission = await request(app)
        .post(`/receipts/process`)
        .send(validReceipt59)
        .set('Accept', 'application/json');
      const id = submission.body.id;
      //Here is our GET request
      const response = await request(app).get(`/receipts/${id}/points`);
      expect(response.body).toHaveProperty('points');
      expect(response.body.points).toEqual(59);
      expect(response.status).toEqual(200);
    });
  });
  describe('Undefined routes', () => {
    it('should handle requests to routes that do not exist', async () => {
      const response = await request(app)
        .get('/receipts/hello/hi')
        .send()
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Route not found');
    });
  });
});
