import express from 'express';
import dotenv from 'dotenv';
import { logger } from '@swachhbuddy/utils';
dotenv.config({
    debug: false,
});
const app = express();
const PORT = process.env.PORT || 8000;
// Middleware to log requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});
app.get('/', (req, res) => {
    res.json('Welcome to the API Gateway');
});
app.listen(PORT, () => {
    logger.info(`API Gateway is running on http://localhost:${PORT}`);
});
