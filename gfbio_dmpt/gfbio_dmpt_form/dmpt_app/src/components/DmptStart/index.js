import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import Questions from '../Questions';
import ActionButton from '../ActionButton';

// FIXME: refactor move to general module
function getCookie(name) {
    // from https://docs.djangoproject.com/en/stable/ref/csrf/
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const createProject = async (token) => {
    try {
        // FIXME: refactor to use only once
        const csrftoken = getCookie('csrftoken');
        const response = await axios.post(
            `${API_ROOT}projects/projects/`,
            {
                'title': `tmp_${nanoid()}`,
                'description': `tmp_${nanoid()} temporary project`,
                'catalog': 18   // FIXME: gfbio catalog id hardcoded --> 18
            },
            {
                // token of super user (maweber)
                headers: {
                    'Authorization': `Token ${token}`,
                    'X-CSRFToken': csrftoken
                }
            }
        );
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

const postValue = (projectId, formItem, token) => {
    // FIXME: refactor to use only once
    const csrftoken = getCookie('csrftoken');
    return axios.post(
        `${API_ROOT}projects/projects/${projectId}/values/`,
        {
            'attribute': formItem.question.attribute,
            'text': formItem.value,
            'value_type': formItem.question.value_type,
            'unit': formItem.question.unit
        },
        {
            // token of super user (maweber)
            headers: {
                'Authorization': `Token ${token}`,
                'X-CSRFToken': csrftoken
            }
        }
    );
};

const putValue = (projectId, formItem, token) => {
    // FIXME: refactor to use only once
    const csrftoken = getCookie('csrftoken');
    return axios.put(
        `${API_ROOT}projects/projects/${projectId}/values/${formItem.valueId}/`,
        {
            'attribute': formItem.question.attribute,
            'text': formItem.value,
            'value_type': formItem.question.value_type,
            'unit': formItem.question.unit
        },
        {
            // token of super user (maweber)
            headers: {
                'Authorization': `Token ${token}`,
                'X-CSRFToken': csrftoken
            }
        }
    );
};

const submitValues = async (projectId, formData, token) => {
    try {
        // eslint-disable-next-line no-restricted-syntax
        for (const f in formData) {
            if (formData[f] !== undefined) {
                const formItem = formData[f];
                if (formItem.valueId !== undefined) {
                    // eslint-disable-next-line no-await-in-loop
                    await putValue(projectId, formItem, token).then((res) => {
                        console.log('\tput value res ');
                        console.log(res);
                    });
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    await postValue(projectId, formItem, token).then((res) => {
                        console.log('\tpost value res ');
                        console.log(res);
                    });
                }

            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        ;
    }
};
//
// const putValues = async (projectId, formData, token) => {
//     try {
//         // eslint-disable-next-line no-restricted-syntax
//         for (const f in formData) {
//             if (formData[f] !== undefined) {
//                 // eslint-disable-next-line no-await-in-loop
//                 await putValue(projectId, formData[f], token).then((res) => {
//                     console.log('\tput value res ');
//                     console.log(res);
//                 });
//
//             }
//         }
//     } catch (e) {
//         console.error(e);
//     } finally {
//         ;
//     }
// };

function useDmptStart(rdmoContext, token) {
    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    useEffect(() => {
        async function prepareDmptStart() {
            setProcessing(true);

            // FIXME: section for gfbio catalog id hardcoded --> 18
            const catalogId = '18';

            try {
                setStage('... fetch sections ...');
                const sectionResponse = await axios.get(
                    `${API_ROOT}questions/sections/?catalog=${catalogId}`,  // section for gfbio catalog id hardcoded
                    {
                        // FIXME: rdmo seems to allow only authenticated requests. solutions is to provide token of user or playground user
                        // local
                        // headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                        // prod
                        // headers: { 'Authorization': 'Token 329ced1de6ee34b19bd24c9b22ee73b64311ffc3' }
                        headers: { 'Authorization': `Token ${token}` }
                    }
                );
                rdmoContext.assignSections(sectionResponse.data);
                rdmoContext.assingSectionsSize(sectionResponse.data.length);

                setStage('... DONE ...');
                setProcessing(false);
            } catch (e) {
                console.error(e);
            } finally {
                ;
            }
        }

        prepareDmptStart();
    }, []);

    return [processing, stage];
}

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    console.log('DMPT start ', props);
    console.log('-----------------------------');
    console.log('');
    // console.log(props.match.params.projectId);
    // console.log('-----------------------------');
    const { isLoggedIn, userToken } = props;
    const rdmoContext = useContext(RdmoContext);

    if (props.match && props.match.params.projectId) {
        // console.log('ASSING PID from url match');
        rdmoContext.assignProjectId(props.match.params.projectId);
    }

    const [processing, stage] = useDmptStart(rdmoContext, userToken);

    const [nextText, setNextText] = useState('Next Section');
    const [prevText, setPrevText] = useState('Previous Section');

    const [submitOnNext, setSubmitOnNext] = useState(false);

    const nextSectionHandler = () => {
        if (rdmoContext.sections_index < rdmoContext.sections_size - 1) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index + 1);
            setNextText('Next Section');
            setSubmitOnNext(false);
        }
        if (rdmoContext.sections_index + 1 === rdmoContext.sections_size - 1) {
            if (rdmoContext.project_id > 0) {
                setNextText('Update DMP');
            } else {
                setNextText('Submit DMP');
            }
            setSubmitOnNext(true);
        }
    };

    const prevSectionHandler = () => {
        if (rdmoContext.sections_index > 0) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index - 1);
        }
        if (rdmoContext.sections_index <= rdmoContext.sections_size - 1) {
            setNextText('Next Section');
            setSubmitOnNext(false);
        }
    };

    // TODO: refactor to own compononent
    // TODO: add to component hook
    const submitAllHandler = () => {
        let projectId = rdmoContext.project_id;
        console.log('Submit HANDLER ', projectId);
        if (projectId < 0) {
            createProject(userToken).then((createResult) => {
                projectId = createResult.data.id;
                rdmoContext.assignProjectId(projectId);
                // TODO: set project id, if available do not create a new one
                // TODO: post answers to project
                // TODO: redirect to rdmo overview

                // -------------------------------------------------------------
                submitValues(projectId, rdmoContext.form_data, userToken).then((valueResult) => {
                    console.log(valueResult);
                }
                );
                // -------------------------------------------------------------
            });
        } else {
            submitValues(projectId, rdmoContext.form_data, userToken).then((valueResult) => {
                console.log(valueResult);
            }
            );
        }
    };

    const handleFormChange = (e, item) => {
        // TODO: manually detect checkbox changes, maybe improve form field or refactor this ...
        // TODO: maybe refactor to list of values for specific question
        // eslint-disable-next-line no-prototype-builtins
        console.log('handleChange: ');
        console.log(e.target.name, ' -- ', e.target.value.trim());
        let formData = rdmoContext.form_data;
        if (e.target.name.startsWith('checkbox') && formData.hasOwnProperty(e.target.name)) {
            delete formData[e.target.name];
        } else {
            formData = ({
                ...formData,
                // Trimming any whitespace
                [e.target.name]: {
                    'value': e.target.value,  // .trim(),
                    'question': item
                }
            });
        }
        rdmoContext.assignFormData(formData);
        console.log('formdata in context ');
        console.log(rdmoContext.form_data);
    };

    const status = (
        <div>
            <h2><i>{stage}</i></h2>
        </div>
    );
    let formFields = <></>;
    if (!processing) {

        const nextHandler = submitOnNext ? submitAllHandler : nextSectionHandler;

        formFields = <Questions
            userToken={userToken}
            sectionIndex={rdmoContext.sections_index}
            handleFormChange={handleFormChange}
            nextSection={<ActionButton text={nextText}
                onClickHandler={nextHandler} />}

            prevSection={<ActionButton text={prevText}
                onClickHandler={prevSectionHandler} />}
        />;

    }
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart<small> user
                logged in: {isLoggedIn}</small></h1>
            {status}
            {/* <Formik> */}

            {formFields}
            {/* </Formik> */}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects
DmptStart.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    userToken: PropTypes.string.isRequired
    // projectId: PropTypes.string,
};

export default DmptStart;
