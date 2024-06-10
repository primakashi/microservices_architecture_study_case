import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@kringel118/common';

import { createBookRouter } from './routes/create';
import { retrieveBookRouter } from './routes/retrieve';
import { updateBookRouter } from './routes/update';
import { indexBookRouter } from './routes/index';
import { deleteBookRouter } from './routes/delete';

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

//app.use(createBookRouter);
//app.use(deleteBookRouter);

app.use(retrieveBookRouter);
app.use(indexBookRouter);
app.use(updateBookRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
