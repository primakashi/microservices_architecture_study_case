import React from 'react';

const PostList = ({ comments }) => {
    const renderedComments = Object.values(comments).map(comment => {
        let content;
        switch (comment.status) {
            case 'approved':
                content = comment.content;
                break;
            case 'pending':
                content = 'This comment is awaiting moderation.';
                break;
            case 'rejected':
                content = 'This comment has been rejected.';
                break;
            default:
                content = 'This comment has been rejected.';
        }


        return (
            <li key={comment.id}>
                {content}
            </li>
        );
    });

    return(
        <ul>
            {renderedComments}
        </ul>
    );
}

export default PostList;