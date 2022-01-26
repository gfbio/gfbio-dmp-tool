import React, { useContext, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ScrollToTop from '../ScrollToTop';
import {
    PROJECT_API_ROOT,
    URL_PREFIX
} from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import {
    checkBackendParameters,
    resetContext
} from '../../utils/backend_context';

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

const saveProject = async (token, userId, projectId) => {
    try {
        const csrftoken = getCookie('csrftoken');
        const response = await axios.post(`${PROJECT_API_ROOT}dmptprojects/`, {
            'rdmo_project': projectId, 'user': userId
        }, {
            headers: {
                'Authorization': `Token ${token}`, 'X-CSRFToken': csrftoken
            }
        });
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

function Summary() {
    console.log('Summary ');
    console.log('-----------------------------');
    console.log('');
    const { projectId } = useParams();
    const rdmoContext = useContext(RdmoContext);
    checkBackendParameters(rdmoContext);

    const [saving, setSaving] = useState(false);
    const [savingDone, setSavingDone] = useState(false);
    const [dmptProjectId, setDmptProjectId] = useState(-1);

    const [discarding, setDiscarding] = useState(false);
    const [discardingDone, setDiscardingDone] = useState(false);

    // const [downloadPdf, setDownloadPdf] = useState(false);
    // const [downloadDone, setDownloadDone] = useState(false);

    console.log('RDOM CONTEXT');
    console.log(rdmoContext.project_id);
    console.log(projectId);
    console.log(dmptProjectId);

    // FIXME: no save for anonymous user (no user / not logged in user)
    const saveProjectHandler = () => {
        setSaving(true);
        if (dmptProjectId === -1) {
            saveProject(
                rdmoContext.backend_context.token,
                rdmoContext.backend_context.user_id,
                projectId).then((result) => {
                // console.log('saveProject handler. result');
                // console.log(result);
                rdmoContext.assignDmptProjectId(result.data.id);
                setSaving(false);
                setSavingDone(true);
                setDmptProjectId(result.data.id);
            });
            setSaving(false);
        }
    };

    let saveSection = (
        <Col lg={6} className='p-3'>
            <i className='mdi mdi-content-save-edit-outline' />
            <h6>
                Save Data Management Plan
            </h6>
            <div className='d-grid gap-2'>
                <Button
                    className='btn btn-secondary btn-green'
                    onClick={saveProjectHandler}
                >Save
                </Button>
            </div>
        </Col>
    );
    if (saving) {
        saveSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>
                    ... Saving Data Management Plan ...
                </h6>
            </Col>
        );
    } else if (savingDone) {
        saveSection = (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>
                    Saving completed successfully !
                </h6>
            </Col>
        );
    }

    const discardProjectHandler = () => {
        setDiscarding(true);
        // TODO: also delete rdmo project immediatly ?
        resetContext(rdmoContext);
        setDiscarding(false);
        setDiscardingDone(true);
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
                <h6>
                    ... Deleting data & prepare to exit ...
                </h6>
            </Col>
        );
    } else if (discardingDone) {
        return <Redirect push
                         to={`${URL_PREFIX}`} />;
    }

    // const downloadPdfHandler = (id) => {
    //     console.log('downloadPdfHandler ', id);
    //     console.log('to ', `${PROJECT_API_ROOT}export/${id}/pdf/`);
    //     setDownloadPdf(true);
    //     // TODO: add reset ?
    //     setDownloadPdf(false);
    //     setDownloadDone(true);
    // };
    let downloadPdfSection = (
        <Col lg={6} className='p-3'>
            <i className='mdi mdi-download-circle-outline' />
            <h6>
                Dowload PDF file
            </h6>
            <div className='d-grid gap-2'>
                <a href={`${PROJECT_API_ROOT}export/${projectId}/pdf/`}
                    className='btn btn-secondary btn-green'
                    // onClick={downloadPdfHandler}
                >Download
                </a>
            </div>
        </Col>
    );
    // if (downloadPdf) {
    //     downloadPdfSection = (
    //         <Col lg={6} className='p-3'>
    //             <i className='mdi mdi-location-exit' />
    //             <h6>
    //                 ... Preparing to download ...
    //             </h6>
    //         </Col>
    //     );
    // } else if (downloadDone) {
    //     // return <Redirect push
    //     //     to={`${URL_PREFIX}`} />;
    //     // return <Redirect
    //     //     push
    //     //     to={`${PROJECT_API_ROOT}export/${projectId}/pdf/`} />;
    //     downloadPdfSection = <a href={`${PROJECT_API_ROOT}export/${projectId}/pdf/`}>DOWNLOAD ?</a>;
    // }

    return (<div id='summary' className='text-center'>
        <ScrollToTop />

        <Row>
            <div className='col-12'>
                <h3>Summary</h3>
            </div>
        </Row>

        <Row className='mt-3'>
            <Col lg={12}>
                <h5>Send a DMP support request to GFBio, download your DMP
                    or save it to your personal account</h5>
            </Col>
        </Row>

        <Row className='mt-5'>

            <Col lg={6} className='p-3'>
                <i className='mdi mdi-email-send-outline' />
                <h6>
                    Request Data Management Plan Support
                </h6>
                <div className='d-grid gap-2'>
                    <Button className='btn btn-secondary btn-green'>Send
                        Request
                    </Button>
                </div>
            </Col>

            {downloadPdfSection}

        </Row>

        <Row className='mt-3'>
            {saveSection}
            {discardSection}
        </Row>

    </div>);
}

// Summary.defaultProps = {
//     projectId: 'notPropped'
// };
//
// Summary.propTypes = {
//     projectId: PropTypes.string
// };

export default Summary;
