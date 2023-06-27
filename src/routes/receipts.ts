import { Router, Request, Response } from 'express';
const receiptRouter = Router();
import { receiptController } from '../controllers/receiptController';
const { validateReceipt, processReceipt, getPoints } = receiptController;

receiptRouter.get('/:id/points', getPoints, (req, res) => {
  return res.status(200).json({ points: res.locals.points });
});

receiptRouter.post('/process', validateReceipt, processReceipt, (req, res) => {
  return res.status(200).json({ id: res.locals.id });
});

export default receiptRouter;
