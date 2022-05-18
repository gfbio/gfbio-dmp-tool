import axios from 'axios';
import * as QueryString from 'querystring';
import { PROJECT_API_ROOT } from './constants';
import getCookie from './cookie';

const postSupportRequest = async (data, token) => {
    const res = { issue_key: '', issue_url: '' };
    const csrftoken = getCookie('csrftoken');
    await axios
        .post(`${PROJECT_API_ROOT}support/`, QueryString.stringify(data), {
            headers: {
                Authorization: `Token ${token}`,
                'X-CSRFToken': csrftoken,
            },
        })
        .then((response) => {
            res.status = response.status;
            res.statusText = response.statusText;
            res.issue_key = response.data.issue_key;
            res.issue_url = response.data.issue_url;
        })
        .catch((error) => {
            if (error.response) {
                res.status = error.response.status;
                res.statusText = error.message;
            }
            console.error(error.toJSON());
        });
    return res;
};

export default postSupportRequest;
