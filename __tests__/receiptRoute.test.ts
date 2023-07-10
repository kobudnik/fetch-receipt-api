import request, { Response } from 'supertest';
import app from '../src/app';
import { getReceipts, resetReceipts } from '../src/utils/receiptUtils';
import { calculatePoints } from '../src/controllers/receiptController';
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

function assert400Error(
  response: Response,
  message = 'Malformed query: Missing properties or invalid data types'
) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', message);
}

describe('Receipt Endpoint Testing', () => {
  describe('POST /receipts/process', () => {
    beforeAll(() => resetReceipts());

    it('should handle submitted receipts with missing properties', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(missingProperties)
        .set('Accept', 'application/json');

      assert400Error(response);
    });

    it('should handle properties with invalid data types', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidDataType)
        .set('Accept', 'application/json');

      assert400Error(response);
    });

    it('should ensure all objects in items array have required properties', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(missingItemsProperty)
        .set('Accept', 'application/json');

      assert400Error(response);
    });

    it('should handle invalid data type on item description', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidItemsDescription)
        .set('Accept', 'application/json');

      assert400Error(response);
    });

    it('should handle invalid data type on item price', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidItemsPrice)
        .set('Accept', 'application/json');

      assert400Error(response);
    });

    it('should handle improperly formatted dates', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidDateFormat)
        .set('Accept', 'application/json');

      assert400Error(response, 'Invalid date formatting');
    });

    it('should handle improperly formatted times', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(invalidTimeFormat)
        .set('Accept', 'application/json');

      assert400Error(response, 'Invalid time formatting');
    });

    it('should not save a receipt if a 200 status is not returned', async () => {
      const receiptCount = Object.keys(getReceipts()).length;
      await request(app)
        .post(`/receipts/process`)
        .send(invalidTimeFormat)
        .set('Accept', 'application/json');

      const updatedCount = Object.keys(getReceipts()).length;
      expect(updatedCount).toEqual(receiptCount);
    });

    it('calculate points on valid submissions, add points to the receipt, save the receipt, and return a 200 status and generated ID', async () => {
      const response = await request(app)
        .post(`/receipts/process`)
        .send(validReceipt28)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      const { id } = response.body;
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(36);
      const savedReceipts = getReceipts();
      const points = calculatePoints(validReceipt28); //
      expect(savedReceipts).toHaveProperty(id, {
        ...validReceipt28,
        points
      });
    });

    it('should add new receipts to the collection without overwriting', async () => {
      const receiptCount = Object.keys(getReceipts()).length;

      const response = await request(app)
        .post(`/receipts/process`)
        .send(validReceipt109)
        .set('Accept', 'application/json');

      const { id } = response.body;

      const updatedReceipts = getReceipts();
      expect(updatedReceipts).toHaveProperty(id, {
        ...validReceipt109,
        points: 109
      });
      expect(Object.keys(updatedReceipts).length).toEqual(receiptCount + 1);
    });
  });

  describe('GET /receipts/{id}/points', () => {
    it('should handle requests for unknown ids', async () => {
      const randomID = 'ZskY90asS-7e2b-4328-b21d-600592dce7b';
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
      const { id } = submission.body;
      //Here is our GET request
      const response = await request(app).get(`/receipts/${id}/points`);
      const expectedPoints = calculatePoints(validReceipt59);
      expect(response.body).toHaveProperty('points', expectedPoints);
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
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
});
