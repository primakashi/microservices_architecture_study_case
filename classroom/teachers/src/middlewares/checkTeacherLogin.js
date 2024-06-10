require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];

    const payload = jwt.verify(bearerToken, process.env.JWT_SECRET);
    console.log(payload);

    if (payload.type !== 'TEACHER') {
      return res.status(401).send({ error: 'You are not authorized' });
    }

    req.teacher = payload;

    next();
  } else {
    return res.status(401).send({ error: 'You are not authorized' });
  }
};
