import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import accountRouter from './routes/account.routes';
import transactionRouter from './routes/transactions.routes';
import authRouter from './routes/auth.routes';
import uploadRouter from './routes/uploads.routes'

const port = 3000;

const fileUpload = require('express-fileUpload');

const app = express();

app.set('port', port);

app.use(json());
app.use(cors());
app.use(morgan('dev'));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath:true
}));

app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/auth/login', authRouter);

module.exports = app;