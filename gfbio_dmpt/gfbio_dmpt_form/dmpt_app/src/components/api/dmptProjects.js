import axios from 'axios';
import { PROJECT_API_ROOT } from './constants';

// from https://docs.djangoproject.com/en/stable/ref/csrf/
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i += 1) {
//             const cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === `${name}=`) {
//                 cookieValue = decodeURIComponent(
//                     cookie.substring(name.length + 1)
//                 );
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

const postDmptProject = async (token, userId, rdmoProjectId) => {
    const res = { data: {} };
    console.log('postDmptProject | token: ', token);
    await axios
        .post(
            `${PROJECT_API_ROOT}dmptprojects/`,
            {
                rdmo_project: rdmoProjectId,
                user: userId,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                    // 'X-CSRFToken': csrftoken,
                },
            }
        )
        .then((response) => {
            res.status = response.status;
            res.statusText = response.statusText;
            res.data = response.data;
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

export default postDmptProject;
