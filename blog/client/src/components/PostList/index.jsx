import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from '../CommentCreate';
import CommentList from '../CommentList';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const postData = await axios.get('http://34.135.47.250/posts');
        setPosts(postData.data);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const renderedPosts = Object.values(posts).map(post => {
        return (
            <div 
                className="card post" 
                style={{width: '30%', marginBottom: '20px' }}
                key={post.id}
            >
                <div className="card-body">
                    <h3 className="card-title">{post.title}</h3>
                    <CommentList comments={post.comments} />
                    <CommentCreate postId={post.id} />
                </div>
            </div>
        );
    });

    return(
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    );
}

export default PostList;