const express = require('express');
const { body, validationResult } = require('express-validator');
const knex = require('../knex-init');
const checkTeacherLogin = require('../middlewares/checkTeacherLogin');

const router = express.Router();

// Create new Announcement
router.post(
  '/teachers/ann/new',
  checkTeacherLogin,
  [
    body('title').isString().withMessage('Title is required'),
    body('desc').isString().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, desc } = req.body;

    try {
      const newAnn = await knex('Announcements')
        .insert({ title, desc, teacher_id: req.teacher.user_id })
        .returning(['ann_id', 'title', 'desc', 'teacher_id', 'created_at']);

      res.status(201).send(newAnn);
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// Get all announcements for a given teacher
router.get('/teachers/ann', checkTeacherLogin, async (req, res) => {
  try {
    const annsList = await knex('Announcements')
      .select()
      .where({ teacher_id: req.teacher.user_id });

    res.send(annsList);
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong' });
  }
});

module.exports = router;
