import express, { Request, Response, NextFunction } from 'express';
import { ServerError } from './types';
import receiptRouter from './routes/receipts';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/receipts', receiptRouter);
app.all('*', (req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: 'Global error handler invoked'
  };
  const errorObj = { ...defaultErr, ...err };
  return res.status(errorObj.status).json({ message: errorObj.message });
});
export default app;
