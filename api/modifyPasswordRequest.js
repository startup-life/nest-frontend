import { getCookie, getServerUrl } from '../utils/function.js';

const changePassword = async (userId, password) => {
    return fetch(`${getServerUrl()}/user/${userId}/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        body: JSON.stringify({
            password,
        }),
    });
};

export default changePassword;
