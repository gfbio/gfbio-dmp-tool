import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { Col, Row } from 'react-bootstrap';
import { SolarSystemLoading } from 'react-loadingg';
import { Redirect, useParams } from 'react-router-dom';
import {
    API_ROOT,
    PROJECT_API_ROOT,
    URL_PREFIX
} from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import Questions from '../Questions';
import ActionButton from '../ActionButton';
import ScrollToTop from '../ScrollToTop';
import { checkBackendParameters } from '../../utils/backend_context';

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

const createProject = async (token) => {
    try {
        // FIXME: refactor to use only once
        const csrftoken = getCookie('csrftoken');
        const response = await axios.post(
            `${API_ROOT}projects/projects/`,
            {
                title: `tmp_${nanoid()}`,
                description: `tmp_${nanoid()} temporary project`,
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
                // console.log('  ---  submitValues ', formItem, '  --- ', formItem.valueId);
                if (formItem.valueId !== undefined && formItem.valueId !== false) {
                    // console.log('PUT');
                    // eslint-disable-next-line no-await-in-loop
                    await putValue(projectId, formItem, token).then(
                        (res) => {
                        }
                    );
                } else {
                    // console.log('POST');
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
                // console.log('dmptProjectDetailResponse');
                // console.log(dmptProjectDetailResponse.data);
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
            }
        }

        prepareDmptStart();
    }, []);

    return [processing, stage];
}

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    console.log('DMPT start ');
    console.log('-----------------------------');

    // console.log('-----------------------------');
    // const { isLoggedIn, backendContext } = props;
    // console.log('BACKENDcontext aus props');
    // console.log(backendContext);
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    // rdmoContext.assignBackendContext(backendContext);
    console.log('rdmo context dmpt start');
    console.log(rdmoContext);
    console.log('backendcontext');
    console.log(backendContext);
    const { projectId } = useParams();
    console.log(projectId);

    const [submitted, setSubmitted] = useState(false);

    // TODO: 2. assign rdmo project id via dmptproject
    if (backendContext.isLoggedIn !== "false" && projectId) {
        // console.log('ASSING PID from url match ', projectId);
        // rdmoContext.assignProjectId(projectId);
        rdmoContext.assignDmptProjectId(projectId);
    }
    // if (props.match && props.match.params.projectId) {
    //     console.log('ASSING PID from url match ', props.match.params.projectId);
    //     rdmoContext.assignProjectId(props.match.params.projectId);
    // }
    console.log('#############################################');

    // TODO: projectId is pk of DMPTProject object
    const [processing, stage] = useDmptStart(rdmoContext, backendContext.token, projectId);

    const [nextText, setNextText] = useState('Next Section');
    const [prevText, setPrevText] = useState('Previous Section');
    const [previousButtonVisibility, setPreviousButtonVisibility] =
        useState(true);

    const [submitOnNext, setSubmitOnNext] = useState(false);

    const nextSectionHandler = () => {
        setPreviousButtonVisibility(
            rdmoContext.sections_index === -1 ? true : false
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
            rdmoContext.sections_index === 0 ? true : false
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
        let projectId = rdmoContext.project_id;
        // console.log('Submit HANDLER ', projectId);
        // console.log('will submit: ');
        // console.log(rdmoContext.form_data);
        // console.log('      ++++++++++++++++++++++++++++ ');
        if (projectId < 0) {
            createProject(backendContext.token).then((createResult) => {
                // console.log('CREATE PRJ RESULT');
                // console.log(createResult);
                projectId = createResult.data.id;
                rdmoContext.assignProjectId(projectId);
                // TODO: set project id, if available do not create a new one
                // TODO: post answers to project
                // TODO: redirect to rdmo overview

                // -------------------------------------------------------------
                submitValues(
                    projectId,
                    rdmoContext.form_data,
                    backendContext.token
                ).then(() => {
                    // console.log('Submit handler values result ');
                    // console.log(valueResult);
                    // return valueResult;
                    setSubmitted(true);
                });
                // -------------------------------------------------------------
            });
        } else {
            submitValues(
                projectId,
                rdmoContext.form_data,
                backendContext.token
            ).then(() => {
                // console.log(valueResult);
                setSubmitted(true);
            });
        }
    };

    const handleFormChange = (e, item) => {
        // TODO: manually detect checkbox changes, maybe improve form field or refactor this ...
        // TODO: maybe refactor to list of values for specific question
        // eslint-disable-next-line no-prototype-builtins
        // console.log('handleChange: ');
        // console.log(e.target.name, ' -- ', e.target.value.trim());
        let formData = rdmoContext.form_data;

        // FIXME: assingin formdata below overwrites valueId from first initialization from projectdata
        let vId = false;
        // if (formData.hasOwnProperty(e.target.name)) {
        //     vId = formData[e.target.name].valueId;
        //     if (e.target.name.startsWith('checkbox')) {
        //         delete formData[e.target.name];
        //     }
        // }
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
                // Trimming any whitespace
                [e.target.name]: {
                    value: e.target.value, // .trim(),
                    question: item,
                    valueId: vId
                    // valueId: vId
                }
            };
        }
        rdmoContext.assignFormData(formData);
        // console.log('formdata in context ');
        // console.log(rdmoContext.form_data);
    };

    let formFields = <></>;
    let header = 'Preparing Data Management Plan form fields';

    if (!processing) {
        // FIXME: for testing submit summary, only submitHandler is active
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

    // console.log('--- before return ', processing, '  | submitted ', submitted, ' return now. ...');
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

    // FIXME: for testing submit summary, only submitHandler is active  see line 307
    if (submitted) {
        // console.log('SUBMITTED : ', URL_PREFIX);
        // TODO: be careful not to confuse with dmptProject Id that can be in the detail version of this component
        return (
            <Redirect
                push
                to={`${URL_PREFIX}summary/${rdmoContext.project_id}`}
            />
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
            {/* <h1 style={{ textTransform: 'uppercase' }}>DmptStart<small> user */}
            {/*    logged in: {isLoggedIn}</small></h1> */}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects
DmptStart.propTypes = {
    // isLoggedIn: PropTypes.bool.isRequired,
    // backendContext: PropTypes.object.isRequired
    // projectId: PropTypes.string,
};

export default DmptStart;
