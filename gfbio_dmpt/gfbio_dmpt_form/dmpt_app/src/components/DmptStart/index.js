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
import useDmptForm from './dmptFormHooks';

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

const createProject = async (token, rdmoContext, optionalProjectName = '') => {
    try {
        // FIXME: refactor to use only once
        const csrftoken = getCookie('csrftoken');

        let projectName = `tmp_${nanoid()}`;
        if (optionalProjectName !== '') {
            projectName = optionalProjectName;
        }
        const response = await axios.post(
            `${API_ROOT}projects/projects/`,
            {
                title: `${projectName}`,
                description: `${projectName}`,
                catalog: rdmoContext.catalog_id,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'X-CSRFToken': csrftoken,
                },
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
            unit: formItem.question.unit,
        },
        {
            headers: {
                Authorization: `Token ${token}`,
                'X-CSRFToken': csrftoken,
            },
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
            unit: formItem.question.unit,
        },
        {
            headers: {
                Authorization: `Token ${token}`,
                'X-CSRFToken': csrftoken,
            },
        }
    );
};

// TODO: reset formdata after submit/put/post ?
//   But this means formdata will not be reset when no submit happens
const submitValues = async (projectId, rdmoContext, token) => {
    // console.log('DmptStart | submitValues | ');
    try {
        // eslint-disable-next-line no-restricted-syntax
        for (const f in rdmoContext.form_data) {
            if (rdmoContext.form_data[f] !== undefined) {
                const formItem = rdmoContext.form_data[f];
                if (
                    formItem.valueId !== undefined &&
                    formItem.valueId !== false
                ) {
                    // eslint-disable-next-line no-await-in-loop
                    await putValue(projectId, formItem, token).then((res) => {
                        // console.log('DmptStart | submitValues | PUT | ', projectId, ' ', formItem, ' ', res);
                    });
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    await postValue(projectId, formItem, token).then((res) => {
                        // console.log('DmptStart | submitValues | POST | ', projectId, ' ', formItem, ' ', res);
                    });
                }
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        // console.log('DmptStart | submitValues | finally: reset form ');
        // rdmoContext.assignFormData({});#
    }
};

function useDmptStart(rdmoContext, token, catalogId, dmptProjectId) {
    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    useEffect(() => {
        // console.log('use dmpt start  |  dmpt project id ', dmptProjectId);
        async function prepareDmptStart() {
            setProcessing(true);
            if (dmptProjectId) {
                try {
                    const dmptProjectDetailResponse = await axios.get(
                        `${PROJECT_API_ROOT}dmptprojects/${dmptProjectId}/`,
                        {
                            headers: { Authorization: `Token ${token}` },
                        }
                    );
                    // console.log('use dmpt start | assgign rdmo project id  ', dmptProjectDetailResponse.data.rdmo_project);
                    rdmoContext.assignProjectId(
                        dmptProjectDetailResponse.data.rdmo_project
                    );
                } catch (e) {
                    console.error(e);
                }
            }

            try {
                setStage('... fetch sections ...');
                const sectionResponse = await axios.get(
                    `${API_ROOT}questions/sections/?catalog=${catalogId}`, // section for gfbio catalog id hardcoded
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
                rdmoContext.assignSections(sectionResponse.data);
                rdmoContext.assingSectionsSize(sectionResponse.data.length);

                setStage('... DONE ...');
                setProcessing(false);
            } catch (e) {
                console.error(e);
            } finally {
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

    // console.log('\n\nDMPT Start ', projectId, ' loggedIn ', backendContext.isLoggedIn);

    const [submitted, setSubmitted] = useState(false);

    if (backendContext.isLoggedIn !== 'false' && projectId) {
        // console.log('assing p id to context ', projectId);
        rdmoContext.assignDmptProjectId(projectId);
    }

    const [processing, stage] = useDmptStart(
        rdmoContext,
        backendContext.token,
        backendContext.catalog_id,
        projectId
    );

    const [nextText, setNextText] = useState('Next Section');
    const [prevText, setPrevText] = useState('Previous Section');
    const [previousButtonVisibility, setPreviousButtonVisibility] =
        useState(true);

    const [submitOnNext, setSubmitOnNext] = useState(false);

    const nextSectionHandler = () => {
        console.log('DmptStart | nextSectionHandler | ', inputs);
        setPreviousButtonVisibility(rdmoContext.sections_index === -1);
        if (rdmoContext.sections_index < rdmoContext.sections_size - 1) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index + 1);
            setNextText('Next Section');
            setSubmitOnNext(false);
        }
        if (rdmoContext.sections_index + 1 === rdmoContext.sections_size - 1) {
            if (rdmoContext.project_id > 0) {
                setNextText('Update');
            } else {
                setNextText('Finish');
            }
            setSubmitOnNext(true);
        }
    };

    const prevSectionHandler = () => {
        console.log('DmptStart | prevSectionHandler |');
        setPreviousButtonVisibility(rdmoContext.sections_index === 0);
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
        // console.log('DmptStart | submitAllHandler |');
        let contextProjectId = rdmoContext.project_id;
        let name = '';
        if (
            // eslint-disable-next-line no-prototype-builtins
            rdmoContext.form_data.hasOwnProperty('project_name') &&
            // eslint-disable-next-line no-prototype-builtins
            rdmoContext.form_data.project_name.hasOwnProperty('value')
        ) {
            name = rdmoContext.form_data.project_name.value;
        }
        if (contextProjectId < 0) {
            createProject(backendContext.token, name).then((createResult) => {
                contextProjectId = createResult.data.id;
                rdmoContext.assignProjectId(contextProjectId);
                submitValues(
                    contextProjectId,
                    rdmoContext,
                    backendContext.token
                ).then(() => {
                    setSubmitted(true);
                });
            });
        } else {
            submitValues(
                contextProjectId,
                rdmoContext,
                backendContext.token
            ).then(() => {
                setSubmitted(true);
            });
        }
    };

    let formFields = <></>;
    let header = 'Preparing Data Management Plan form fields';

    // TODO: for testing submit summary, only submitHandler is active
    // const nextHandler = submitAllHandler;
    const nextHandler = submitOnNext ? submitAllHandler : nextSectionHandler;

    const { inputs, handleInputChange, handleSubmit } =
        useDmptForm(nextHandler);

    if (!processing) {
        formFields = (
            <Questions
                userToken={backendContext.token}
                sectionIndex={rdmoContext.sections_index}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                prevSection={
                    <ActionButton
                        text={prevText}
                        name="previous"
                        onClickHandler={prevSectionHandler}
                        align="left"
                        hide={previousButtonVisibility}
                    />
                }
                nextSection={
                    <ActionButton
                        text={nextText}
                        name="next"
                        align="right"
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
                    <SolarSystemLoading color="#345AA2" size="large" speed={8}>
                        Loading
                    </SolarSystemLoading>
                </Col>
            </Row>
        );
    }

    // TODO: for testing submit summary, only submitHandler is active  see line 307
    if (submitted) {
        return <Summary rdmoProjectId={rdmoContext.project_id} />;
    }

    return (
        <div id="projectDetail">
            <ScrollToTop />
            <Row>
                <Col lg={12}>
                    <h3>{header}</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col lg={12}>{formFields}</Col>
            </Row>
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects
DmptStart.propTypes = {};

export default DmptStart;
