import axios from 'axios';
import { nanoid } from 'nanoid';
import { PROJECT_API_ROOT } from '../../constants/api/api_constants';

const postProject = async (token, catalogId, data) => {
    const res = {};
    res.rdmoProjectId = -1;
    const payload = {};
    payload.catalog = catalogId;
    payload.title =
        data.project_name === undefined ? `tmp_${nanoid()}` : data.project_name;
    payload.form_data = data;
    await axios
        .post(`${PROJECT_API_ROOT}projects/values/`, payload, {
            headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
            res.status = response.status;
            res.statusText = response.statusText;
            res.rdmoProjectId = response.data.rdmo_project_id;
        })
        .catch((error) => {
            if (error.response) {
                res.status = error.response.status;
                res.statusText = error.message
            }
            console.log(error.toJSON());
        });
    return res;
};

export default postProject;
