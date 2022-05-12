import axios from 'axios';
import { PROJECT_API_ROOT } from './constants';

export const postDmptProject = async (token, userId, rdmoProjectId) => {
    const res = { data: {} };
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

// export const getDmptProjects = async (token) => {
//     const res = { data: {} };
//     console.log('getDmptProjects | token: ', token);
//     await axios
//         .get(`${PROJECT_API_ROOT}dmptprojects/`, {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         })
//         .then((response) => {
//             res.status = response.status;
//             res.statusText = response.statusText;
//             res.data = response.data;
//         })
//         .catch((error) => {
//             if (error.response) {
//                 res.status = error.response.status;
//                 res.statusText = error.message;
//             }
//             console.error(error.toJSON());
//         });
// };

// export default postDmptProject;
