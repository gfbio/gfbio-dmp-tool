import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { Col, Row } from 'react-bootstrap';
import { SolarSystemLoading } from 'react-loadingg';
import { useParams } from 'react-router-dom';
import { API_ROOT, PROJECT_API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import Questions from '../Questions';
import ActionButton from '../ActionButton';
import ScrollToTop from '../ScrollToTop';
import { checkBackendParameters } from '../../utils/backend_context';
import Summary from '../Summary';

// FIXME: refactor move to general module
function getCookie(name) {
    // from https://docs.djangoproject.com/en/stable/ref/csrf/
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === `${name}=`) {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}

const createProject = async (token, optionalProjectName = '') => {

    try {

        // FIXME: refactor to use only once
        const csrftoken = getCookie('csrftoken');

        let projectName = `tmp_${nanoid()}`;
        if (optionalProjectName !== '') {
            if (optionalProjectName.length > 36) {
                projectName = `${optionalProjectName.substring(0, 30)} (...)`;
            } else {
                projectName = optionalProjectName;
            }
        }
        const response = await axios.post(
            `${API_ROOT}projects/projects/`,
            {
                title: `${projectName}`,
                description: `${projectName}`,
                catalog: 18 // FIXME: gfbio catalog id hardcoded --> 18
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
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
            attribute: formItem.question.attribute,
            text: formItem.value,
            value_type: formItem.question.value_type,
            unit: formItem.question.unit
        },
        {
            headers: {
                Authorization: `Token ${token}`,
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
            attribute: formItem.question.attribute,
            text: formItem.value,
            value_type: formItem.question.value_type,
            unit: formItem.question.unit
        },
        {
            headers: {
                Authorization: `Token ${token}`,
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
                if (formItem.valueId !== undefined && formItem.valueId !== false) {
                    // eslint-disable-next-line no-await-in-loop
                    await putValue(projectId, formItem, token).then(
                        (res) => {
                        }
                    );
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    await postValue(projectId, formItem, token).then(
                        (res) => {
                        }
                    );
                }
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        ;
    }
};

function useDmptStart(rdmoContext, token, dmptProjectId) {
    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    useEffect(() => {
        async function prepareDmptStart() {
            setProcessing(true);
            try {
                const dmptProjectDetailResponse = await axios.get(
                    `${PROJECT_API_ROOT}dmptprojects/${dmptProjectId}/`,
                    {
                        headers: { Authorization: `Token ${token}` }
                    }
                );
                rdmoContext.assignProjectId(dmptProjectDetailResponse.data.rdmo_project);
            } catch (e) {
                console.error(e);
            }

            // FIXME: section for gfbio catalog id hardcoded --> 18
            const catalogId = '18';

            try {
                setStage('... fetch sections ...');
                const sectionResponse = await axios.get(
                    `${API_ROOT}questions/sections/?catalog=${catalogId}`, // section for gfbio catalog id hardcoded
                    {
                        headers: { Authorization: `Token ${token}` }
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
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);
    const { projectId } = useParams();

    const [submitted, setSubmitted] = useState(false);

    if (backendContext.isLoggedIn !== 'false' && projectId) {
        rdmoContext.assignDmptProjectId(projectId);
    }

    const [processing, stage] = useDmptStart(rdmoContext, backendContext.token, projectId);

    const [nextText, setNextText] = useState('Next Section');
    const [prevText, setPrevText] = useState('Previous Section');
    const [previousButtonVisibility, setPreviousButtonVisibility] =
        useState(true);

    const [submitOnNext, setSubmitOnNext] = useState(false);

    const nextSectionHandler = () => {
        setPreviousButtonVisibility(
            rdmoContext.sections_index === -1
        );
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
        setPreviousButtonVisibility(
            rdmoContext.sections_index === 0
        );
        if (rdmoContext.sections_index > 0) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index - 1);
        }
        if (rdmoContext.sections_index <= rdmoContext.sections_size - 1) {
            setNextText('Next Section');
            setSubmitOnNext(false);
        }
    };

    // FIXME: prevent submitting empty dmp
    // TODO: refactor to own compononent
    // TODO: add to component hook
    const submitAllHandler = () => {
        let contextProjectId = rdmoContext.project_id;
        let name = '';
        // eslint-disable-next-line no-prototype-builtins
        if (rdmoContext.form_data.hasOwnProperty('project_name') && rdmoContext.form_data.project_name.hasOwnProperty('value')) {
            name = rdmoContext.form_data.project_name.value;
        }
        if (contextProjectId < 0) {
            createProject(backendContext.token, name).then((createResult) => {
                contextProjectId = createResult.data.id;
                rdmoContext.assignProjectId(contextProjectId);
                submitValues(
                    contextProjectId,
                    rdmoContext.form_data,
                    backendContext.token
                ).then(() => {
                    setSubmitted(true);
                });
            });
        } else {
            submitValues(
                contextProjectId,
                rdmoContext.form_data,
                backendContext.token
            ).then(() => {
                setSubmitted(true);
            });
        }
    };

    const handleFormChange = (e, item) => {
        // TODO: manually detect checkbox changes, maybe improve form field or refactor this ...
        // TODO: maybe refactor to list of values for specific question
        // eslint-disable-next-line no-prototype-builtins
        let formData = rdmoContext.form_data;

        // FIXME: assingin formdata below overwrites valueId from first initialization from projectdata
        let vId = false;
        if (formData.hasOwnProperty(e.target.name) && formData[e.target.name].hasOwnProperty('valueId')) {
            vId = formData[e.target.name].valueId;
        }

        if (
            e.target.name.startsWith('checkbox') &&
            formData.hasOwnProperty(e.target.name)
        ) {
            delete formData[e.target.name];
        } else {
            formData = {
                ...formData,
                [e.target.name]: {
                    value: e.target.value,
                    question: item,
                    valueId: vId
                }
            };
        }
        rdmoContext.assignFormData(formData);
    };

    let formFields = <></>;
    let header = 'Preparing Data Management Plan form fields';

    if (!processing) {
        // TODO: for testing submit summary, only submitHandler is active
        // const nextHandler = submitAllHandler;
        const nextHandler = submitOnNext
            ? submitAllHandler
            : nextSectionHandler;

        formFields = (
            <Questions
                userToken={backendContext.token}
                sectionIndex={rdmoContext.sections_index}
                handleFormChange={handleFormChange}
                prevSection={
                    <ActionButton
                        text={prevText}
                        onClickHandler={prevSectionHandler}
                        align='left'
                        hide={previousButtonVisibility}
                    />
                }
                nextSection={
                    <ActionButton
                        text={nextText}
                        onClickHandler={nextHandler}
                        align='right'
                        hide={false}
                    />
                }
            />
        );

        header = 'Data Management Plan';
    }

    if (processing) {
        return (
            <Row>
                <Col lg={12}>
                    <SolarSystemLoading color='#345AA2' size='large' speed={8}>
                        Loading
                    </SolarSystemLoading>
                </Col>
            </Row>
        );
    }

    // TODO: for testing submit summary, only submitHandler is active  see line 307
    if (submitted) {
        return (
            <Summary rdmoProjectId={rdmoContext.project_id} />
        );
    }

    return (
        <div id='projectDetail'>
            <ScrollToTop />
            <Row>
                <Col lg={12}>
                    <h3>{header}</h3>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col lg={12}>{formFields}</Col>
            </Row>
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects
DmptStart.propTypes = {};

export default DmptStart;
