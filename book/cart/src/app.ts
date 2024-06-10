import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@kringel118/common';

import { indexCartRouter } from './routes';
import { createCartRouter } from './routes/create';
import { updateCartRouter } from './routes/update';
import { deleteCartRouter } from './routes/delete';
import { retrieveCartRouter } from './routes/retrieve';

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

app.use(indexCartRouter);
app.use(createCartRouter);
app.use(updateCartRouter);
app.use(deleteCartRouter);
app.use(retrieveCartRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
