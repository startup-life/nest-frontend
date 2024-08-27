import { getServerUrl, getCookie } from '../utils/function.js';

const getPosts = (offset, limit) => {
    const result = fetch(
        `${getServerUrl()}/post?offset=${offset}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
            noCORS: true,
        }
    );
    return result;
};

export default getPosts;
