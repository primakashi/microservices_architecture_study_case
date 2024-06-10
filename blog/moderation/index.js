const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

app.post('/events', async (req, res) => {
    const { data, type } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                content: data.content,
                postId: data.postId,
                status
            }
        })
            .catch(err => {
                console.log(err.message);
            });
    }

    res.send({});
});

app.listen(4003, (req, res) => {
    console.log('Listening on port 4003');
});