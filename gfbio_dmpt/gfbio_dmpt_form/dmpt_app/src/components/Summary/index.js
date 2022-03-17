import React, { useContext, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import ScrollToTop from '../ScrollToTop';
import { PROJECT_API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import {
    checkBackendParameters,
    resetContext
} from '../../utils/backend_context';
import UserLoggedInRouter from '../UserLoggedInRouter';
import SupportForm from '../SupportForm';
// import DmptStart from '../DmptStart';
// import UserLoggedInRouter from '../UserLoggedInRouter';

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

const saveProject = async (token, userId, projectId) => {
    try {
        const csrftoken = getCookie('csrftoken');
        const response = await axios.post(
            `${PROJECT_API_ROOT}dmptprojects/`,
            {
                rdmo_project: projectId,
                user: userId
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

function Summary(props) {
    const { rdmoProjectId } = props;
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    const [saving, setSaving] = useState(false);
    const [savingDone, setSavingDone] = useState(false);
    const [offerAccount, setOfferAccount] = useState(false);
    const [dmptProjectId, setDmptProjectId] = useState(-1);
    const [discarding, setDiscarding] = useState(false);
    const [discardingDone, setDiscardingDone] = useState(false);

    const [showSupportForm, setShowSupportForm] = useState(false);

    const loggedIn = backendContext.isLoggedIn !== 'false';
    const noSaveNeeded = rdmoContext.dmpt_project_id !== -1;

    // console.log('SUMMARY rdomProjIdParam ', rdmoProjectId);
    // console.log('context ');
    // console.log(rdmoContext);

    const saveProjectHandler = () => {
        if (loggedIn) {
            setSaving(true);
            setOfferAccount(false);
            if (dmptProjectId === -1 && rdmoContext.dmpt_project_id === -1 && rdmoContext.project_id !== -1) {
                saveProject(
                    rdmoContext.backend_context.token,
                    rdmoContext.backend_context.user_id,
                    rdmoProjectId).then((result) => {
                    rdmoContext.assignDmptProjectId(result.data.id);
                    setSaving(false);
                    setSavingDone(true);
                    setDmptProjectId(result.data.id);
                });
                setSaving(false);
            }
            setSaving(false);
        } else {
            setOfferAccount(true);
        }
    };

    let saveSection = (
        <Col lg={6} className='p-3'>
            <i className='mdi mdi-content-save-edit-outline' />
            <h6>Save Data Management Plan</h6>
            <div className='d-grid gap-2'>
                <Button
                    className='btn btn-secondary btn-green'
                    onClick={saveProjectHandler}
                >
                    Save
                </Button>
            </div>
        </Col>
    );
    if (noSaveNeeded) {
        saveSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>
                    Your plan was already successfully saved and update in the
                    previous step !
                </h6>
            </Col>
        );
    }
    if (saving) {
        saveSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>... Saving Data Management Plan ...</h6>
            </Col>
        );
    } else if (savingDone) {
        saveSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>Saving completed successfully !</h6>
            </Col>
        );
    } else if (offerAccount) {
        saveSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>
                    Please log in to save !
                </h6>
                <Row>
                    <Col lg={6}>
                        <a href='https://sso.gfbio.org/simplesaml/module.php/accountui/register.php'
                            className='btn btn-secondary btn-green'>Sign Up</a>
                    </Col>
                    <Col lg={6}>
                        <a href='/accounts/login/'
                            className='btn btn-secondary btn-green'>Sign In</a>
                    </Col>
                </Row>
            </Col>
        );
    }

    const discardProjectHandler = () => {
        setDiscarding(true);
        resetContext(rdmoContext);
        setDiscarding(false);
        setDiscardingDone(true);
        // console.log('discarding done');
    };
    let discardSection = (
        <Col lg={6} className='p-3'>
            <i className='mdi mdi-location-exit' />
            <h6>
                Finish
            </h6>
            <div className='d-grid gap-2'>
                <Button className='btn btn-secondary btn-green'
                    onClick={discardProjectHandler}>Discard
                    &
                    Exit
                </Button>
            </div>
        </Col>
    );
    if (discarding) {
        discardSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-location-exit' />
                <h6>... Deleting data & prepare to exit ...</h6>
            </Col>
        );
    } else if (discardingDone) {
        // console.log('Redirect from summary');
        // return <Redirect push
        //     to={`${URL_PREFIX}start`} />;
        return <UserLoggedInRouter />;
        // return <DmptStart />;
    }

    const downloadPdfSection = (
        <Col lg={6} className='p-3'>
            <i className='mdi mdi-download-circle-outline' />
            <h6>
                Dowload PDF file
            </h6>
            <div className='d-grid gap-2'>
                <a href={`${PROJECT_API_ROOT}export/${rdmoProjectId}/pdf/`}
                    className='btn btn-secondary btn-green'
                >Download
                </a>
            </div>
        </Col>
    );

    const supportHandler = () => {
        // console.log('support Handler');
        setShowSupportForm(true);
    };

    let supportSection = (
        <Col lg={6} className='p-3'>
            <i className='mdi mdi-email-send-outline' />
            <h6>Request Data Management Plan Support</h6>
            <div className='d-grid gap-2'>
                <Button className='btn btn-secondary btn-green'
                    onClick={supportHandler}>
                    Send Request
                </Button>
            </div>
        </Col>
    );
    if (showSupportForm) {
        supportSection = (
            <SupportForm isLoggedIn={loggedIn} rmdoProjectId={rdmoProjectId}/>
        );
    }

    return (
        <div id='summary' className='text-center'>
            <ScrollToTop />

            <Row>
                <div className='col-12'>
                    <h3>Summary</h3>
                </div>
            </Row>

            <Row className='mt-3'>
                <Col lg={12}>
                    <h5>
                        Send a DMP support request to GFBio, download your DMP
                        or save it to your personal account
                    </h5>
                </Col>
            </Row>

            <Row className='mt-5'>
                {supportSection}
                {downloadPdfSection}
            </Row>

            <Row className='mt-3'>
                {saveSection}
                {discardSection}
            </Row>
        </div>);
}

Summary.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired
};

export default Summary;
