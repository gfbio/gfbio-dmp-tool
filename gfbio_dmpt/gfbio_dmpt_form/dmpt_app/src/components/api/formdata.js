import axios from 'axios';
import { PROJECT_API_ROOT } from '../../constants/api/api_constants';

const createProject = async (token, data) => {
    let projectId = -1;
    try {
        const response = await axios.post(
            `${PROJECT_API_ROOT}projects/`,
            data,
            {
                headers: { Authorization: `Token ${token}` },
            }
        );
        projectId = response.data.id;
    } catch (error) {
        console.error(error);
    }
    return projectId;
};
