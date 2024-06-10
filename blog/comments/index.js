const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', async (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;

    const comments = commentsByPostId[postId] || [];

    const newComment = { 
        id: id,
        content: content,
        status: 'pending'
    };
    comments.push(newComment);
    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id,
            content,
            postId,
            status: 'pending'
        }
    })
        .catch(err => {
            console.log(err.message);
        });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Recieved event', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                postId,
                status
            }
        })
            .catch(err => {
                console.log(err.message);
            });
    }

    res.send({});
});

app.listen(4001, (req, res) => {
    console.log('Listening on port 4001');
});