import express, { Request, Response, NextFunction } from 'express';
import { ServerError } from './types';
import receiptRouter from './routes/receipts';

const app = express();
app.use(express.json());
app.use('/receipts', receiptRouter);

app.use(
  (err: ServerError, _req: Request, _res: Response, _next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'Global error handler invoked' }
    };
    const errorObj = { ...defaultErr, ...err };
    console.log(errorObj.log);
    return _res.status(errorObj.status).json(errorObj.message);
  }
);

export default app;
