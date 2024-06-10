const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../knex-init');

const router = express.Router();

// Register a new user
router.post(
  '/auth/register',
  [
    body('type').isString().withMessage('Type is required'),
    body('name').isString().withMessage('Name is required'),
    body('email').isString().withMessage('Email is required'),
    body('password').isString().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, name, email, password } = req.body;

    try {
      // Hash the password
      const salt = await bcrypt.genSalt(6);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await knex('Users')
        .insert({ type, name, email, password: hashedPassword })
        .returning(['user_id', 'name', 'email', 'type']);

      const payload = newUser[0];

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res.status(201).send({ msg: 'User Created', token, user: newUser[0] });
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

module.exports = router;
