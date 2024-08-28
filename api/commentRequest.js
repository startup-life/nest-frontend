import { getCookie, getServerUrl } from '../utils/function.js';

export const deleteComment = async (postId, commentId) => {
    return fetch(`${getServerUrl()}/comment/post/${postId}/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
    });
};

export const updateComment = async (postId, commentId, commentContent) => {
    return fetch(`${getServerUrl()}/comment/post/${postId}/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        body: JSON.stringify(commentContent),
    });
};
