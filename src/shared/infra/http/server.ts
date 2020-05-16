import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/RateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);
app.use(rateLimiter);
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(routes);
app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('🚀 server started on port 3333');
});
