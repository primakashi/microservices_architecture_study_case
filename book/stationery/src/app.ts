import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@kringel118/common';

import { indexStationeryRouter } from './routes/index';
import { updateStationeryRouter } from './routes/update';
import { retrieveStationeryRouter } from './routes/retrieve';
import { createStationeryRouter } from './routes/create';

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

app.use(indexStationeryRouter);
app.use(updateStationeryRouter);
app.use(retrieveStationeryRouter);
//app.use(createStationeryRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
