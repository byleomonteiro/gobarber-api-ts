import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';

import routes from '@shared/infra/http/routes';

import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm/database';

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(5555, () => {
    console.log('🚀 Server running on port 5555');
});