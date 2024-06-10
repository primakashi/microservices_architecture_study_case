const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../knex-init');

const router = express.Router();

router.post(
  '/auth/login',
  [
    body('email').isString().withMessage('Email is required'),
    body('password').isString().withMessage('Password is required'),
    body('type').isString().withMessage('User type is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, type } = req.body;

    try {
      const existingUser = await knex('Users').select().where({ email, type });

      if (existingUser.length === 0) {
        return res
          .status(400)
          .send({ error: 'Unable to Login. Check credentials' });
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser[0].password
      );

      if (!validPassword) {
        console.log(password);
        return res
          .status(400)
          .send({ error: 'Unable to Login. Check credentials' });
      }

      //   Everything ok. Send jwt token
      delete existingUser[0].password;
      const payload = existingUser[0];

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res
        .status(200)
        .send({ msg: 'Login successful', token, user: existingUser[0] });
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

module.exports = router;
