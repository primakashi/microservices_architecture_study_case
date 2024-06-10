const express = require('express');
const cors = require('cors');
const registerRouter = require('./src/routes/register');
const loginRouter = require('./src/routes/login');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', registerRouter);
app.use('/api', loginRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`AUTH Listening on port ${port}`));
