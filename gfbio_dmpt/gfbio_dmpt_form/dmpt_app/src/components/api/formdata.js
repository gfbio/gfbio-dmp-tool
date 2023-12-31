import axios from 'axios';
import { nanoid } from 'nanoid';
import { PROJECT_API_ROOT } from './constants';

const findProjectName = (formData) => {
    let projectName = '';
    Object.keys(formData).forEach((k) => {
        if (k.startsWith('project_name')) {
            projectName = formData[k];
        }
    });
    return projectName;
};

const postProject = async (token, catalogId, data) => {
    const res = {};
    res.rdmoProjectId = -1;
    const payload = {};
    payload.catalog = catalogId;

    const projectName = findProjectName(data);
    payload.title = projectName === '' ? `tmp_${nanoid()}` : projectName;

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
                res.statusText = error.message;
            }
            console.error(error.toJSON());
        });
    return res;
};

export const putProject = async (token, dmptProjectId, data) => {
    const res = {};
    const payload = {};
    payload.dmpt_project = dmptProjectId;

    const projectName = findProjectName(data);
    payload.title = projectName === '' ? `tmp_${nanoid()}` : projectName;

    payload.form_data = data;
    await axios
        .put(`${PROJECT_API_ROOT}projects/values/`, payload, {
            headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
            res.status = response.status;
            res.statusText = response.statusText;
            res.dmptProjectId = response.data.dmpt_project;
            res.rdmoProjectId = response.data.rdmo_project_id;
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

export default postProject;
