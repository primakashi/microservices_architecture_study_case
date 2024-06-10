const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
const checkTeacherLogin = require('./src/middlewares/checkTeacherLogin');
const { body, validationResult } = require('express-validator');
const knex = require('./src/knex-init');

async function connect() {
  try {
    const connection = await amqp.connect(
      'amqps://pdqppjsm:nFT_4ykBmcyoPuLc3KmucqlS9N0N5Rhm@puffin.rmq2.cloudamqp.com/pdqppjsm'
    );

    const channel = await connection.createChannel();
    await channel.assertQueue('comment_created');

    channel.consume(
      'comment_created',
      async (msg) => {
        console.log(msg.content.toString());
        const newComment = JSON.parse(msg.content.toString());

        await knex('Comments').insert(newComment);

        console.log('TEACHER comment created', newComment);
      },
      { noAck: true }
    );

    const app = express();

    app.use(express.json());
    app.use(cors());

    // Create new Announcement
    app.post(
      '/api/teachers/ann/new',
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

          const msgToStudent = {
            ...newAnn[0],
            teacher_name: req.teacher.name,
          };
          delete msgToStudent.teacher_id;

          // Send this message via RabbitMQ to Students
          channel.sendToQueue(
            'announcement_created',
            Buffer.from(JSON.stringify(msgToStudent))
          );

          res.status(201).send(newAnn[0]);
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: 'Something went wrong' });
        }
      }
    );

    // Get all announcements for a given teacher
    app.get('/api/teachers/ann', checkTeacherLogin, async (req, res) => {
      try {
        const annsList = await knex('Announcements')
          .select()
          .where({ teacher_id: req.teacher.user_id });

        res.send(annsList);
      } catch (error) {
        return res.status(500).send({ error: 'Something went wrong' });
      }
    });

    // Get all comments for an announcement
    app.get(
      '/api/teachers/comments/:annId',
      checkTeacherLogin,
      async (req, res) => {
        try {
          const commentsList = await knex('Comments')
            .select()
            .where({ ann_id: req.params.annId });

          res.send(commentsList);
        } catch (error) {
          return res.status(500).send({ error: 'Something went wrong' });
        }
      }
    );

    // Delete a particular comment
    app.delete(
      '/api/teachers/comment/del/:commentId',
      checkTeacherLogin,
      async (req, res) => {
        try {
          const { commentId } = req.params;

          await knex('Comments').where({ comment_id: commentId }).del();

          channel.sendToQueue(
            'comment_deleted',
            Buffer.from(String(commentId))
          );

          res.send({ msg: 'Comment deleted successfully' });
        } catch (error) {
          return res.status(500).send({ error: 'Something went wrong' });
        }
      }
    );

    const port = process.env.PORT || 8001;
    app.listen(port, () => console.log(`TEACHERS Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

connect();
