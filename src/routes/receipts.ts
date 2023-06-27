import { Router, Request, Response } from 'express';
const receiptRouter = Router();

receiptRouter.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ this: 'works' });
});

export default receiptRouter;
