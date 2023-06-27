import { Router, Request, Response } from 'express';
const receiptRouter = Router();
import { receiptController } from '../controllers/receiptController';
const { validateReceipt, processReceipt } = receiptController;

receiptRouter.get('/', (req, res) => {
  return res.status(200).json({ this: 'works' });
});

receiptRouter.post('/process', validateReceipt, processReceipt, (req, res) => {
  return res.status(200).json({ id: res.locals.id });
});

export default receiptRouter;
