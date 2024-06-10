import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@kringel118/common';

import { createCheckoutRouter } from './routes/create';
import { successCheckoutRouter } from './routes/success';
import { cancelCheckoutRouter } from './routes/cancel';
import { indexCheckoutRouter } from './routes';
import { deleteCheckoutRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);
app.use(currentUser);

app.use(createCheckoutRouter);
app.use(successCheckoutRouter);
app.use(cancelCheckoutRouter);
app.use(indexCheckoutRouter);
app.use(deleteCheckoutRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
