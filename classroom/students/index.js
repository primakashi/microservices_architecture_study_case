const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');
const { body, validationResult } = require('express-validator');
const knex = require('./src/knex-init');
const checkStudentLogin = require('./src/middlewares/checkStudentLogin');

async function connect() {
  try {
    const connection = await amqp.connect(
      'amqps://pdqppjsm:nFT_4ykBmcyoPuLc3KmucqlS9N0N5Rhm@puffin.rmq2.cloudamqp.com/pdqppjsm'
    );

    const channel = await connection.createChannel();
    await channel.assertQueue('announcement_created');
    await channel.assertQueue('comment_deleted');

    channel.consume(
      'announcement_created',
      async (msg) => {
        const newAnn = JSON.parse(msg.content.toString());

        await knex('Announcements').insert(newAnn);

        console.log('STUDENT new announcement', newAnn);
      },
      { noAck: true }
    );

    channel.consume(
      'comment_deleted',
      async (msg) => {
        const commentId = parseInt(msg.content.toString());

        await knex('Comments').where({ comment_id: commentId }).del();

        console.log('STUDENT comment deleted', commentId);
      },
      { noAck: true }
    );

    const app = express();

    app.use(express.json());
    app.use(cors());

    // Route for creating new Comment
    app.post(
      '/api/students/comment/new',
      checkStudentLogin,
      [
        body('annId').isInt().withMessage('Announcement Id is required'),
        body('comment').isString().withMessage('Comment text is required'),
      ],
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { annId, comment } = req.body;

        const newComment = await knex('Comments')
          .insert({
            ann_id: annId,
            student_id: parseInt(req.student.user_id),
            comment,
            student_name: req.student.name,
          })
          .returning([
            'comment_id',
            'ann_id',
            'student_id',
            'comment',
            'student_name',
          ]);

        const msgToTeacher = {
          ...newComment[0],
        };
        delete msgToTeacher.student_id;

        channel.sendToQueue(
          'comment_created',
          Buffer.from(JSON.stringify(msgToTeacher))
        );

        res.status(201).send(newComment[0]);
      }
    );

    // Get all announcements
    app.get('/api/students/ann', checkStudentLogin, async (req, res) => {
      try {
        const annsList = await knex('Announcements').select();

        res.send(annsList);
      } catch (error) {
        return res.status(500).send({ error: 'Something went wrong' });
      }
    });

    // Get all comments for an announcement
    app.get(
      '/api/students/comments/:annId',
      checkStudentLogin,
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

    const port = process.env.PORT || 8002;
    app.listen(port, () => console.log(`STUDENTS Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

connect();
