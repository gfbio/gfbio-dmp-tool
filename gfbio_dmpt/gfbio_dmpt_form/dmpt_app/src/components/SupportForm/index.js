import React, { useContext, useState } from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as QueryString from 'querystring';
import useSupportForm from './formHooks';
import RdmoContext from '../RdmoContext';
import { checkBackendParameters } from '../../utils/backend_context';

import { PROJECT_API_ROOT } from '../../constants/api/api_constants';

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

// TODO: add cancel function for this form
function SupportForm(props) {
    const {
        isLoggedIn,
        rmdoProjectId
    } = props;
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    const [issue, setIssue] = useState(false);

    const submitRequest = () => {
        const csrftoken = getCookie('csrftoken');
        // eslint-disable-next-line no-use-before-define
        inputs.rdmo_project_id = rmdoProjectId;
        // eslint-disable-next-line no-use-before-define
        inputs.user_id = rdmoContext.backend_context.user_id;
        axios.post(
            `${PROJECT_API_ROOT}support/`,
            // eslint-disable-next-line no-use-before-define
            QueryString.stringify(inputs),
            {
                headers: {
                    Authorization: `Token ${rdmoContext.backend_context.token}`,
                    'X-CSRFToken': csrftoken
                }
            }
        ).then((res) => {
            // console.log(res);
            rdmoContext.assignIssueCreated(true);
            setIssue(true);
        }).catch((error) => {
            console.log(error);
        });
    };

    const {
        inputs,
        handleInputChange,
        handleSubmit
    } = useSupportForm(submitRequest);

    // console.log('SUPPORT FORM ', isLoggedIn);

    let emailSection = (
        <div className='row mb-3'>
            <label htmlFor='email'
                className='col-sm-3 col-form-label'>
                Email
            </label>
            <div className='col-sm-9'>
                <input type='email' className='form-control'
                    id='email'
                    name='email'
                    placeholder=''
                    onChange={handleInputChange}
                    value={inputs.email}
                    required
                />
            </div>
        </div>
    );

    if (backendContext.user_email !== '') {
        emailSection = (
            <input type='hidden'
                id='email'
                name='email'
                value={backendContext.user_email}
            />
        );
        inputs.email = backendContext.user_email;
    }

    if (issue) {
        return (
            <Col lg={6} className='p-3'>
                <i className='mdi mdi-content-save-edit-outline' />
                <h6>
                    Your request was received !
                </h6>
                <p>You will soon be contacted by our helpdesk staff.</p>
            </Col>
        );
    }
    return (
        <Col lg={6} className='p-3' style={{ 'text-align': 'left' }}>
            <form onSubmit={handleSubmit}>
                {emailSection}
                <div className='row mb-3'>
                    <label htmlFor='message'
                        className='col-sm-3 col-form-label'>Message</label>
                    <textarea
                        className='col-sm-9'
                        rows='4'
                        id='message'
                        name='message'
                        placeholder=''
                        onChange={handleInputChange} value={inputs.message}
                        required
                    />
                </div>

                <fieldset className='row mb-3'>
                    <legend
                        className='col-form-label col-sm-5 pt-0'>What services
                        are you interested in ?
                    </legend>

                    <div className='col-sm-7'>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='data_collection_and_assurance'
                                name='data_collection_and_assurance'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='data_collection_and_assurance'>Data
                                Collection and
                                Assurance</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='data_curation'
                                name='data_curation'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='data_curation'>Data
                                Curation</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='data_archiving'
                                name='data_archiving'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='data_archiving'>Data
                                Archiving</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='data_visualization_and_analysis'
                                name='data_visualization_and_analysis'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='data_visualization_and_analysis'>Data
                                Visualization
                                and Analysis</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='terminology_service'
                                name='terminology_service'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='terminology_service'>Terminology
                                Service</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='data_publication'
                                name='data_publication'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='data_publication'>Data
                                Publication</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                id='data_management_training'
                                name='data_management_training'
                                onChange={handleInputChange}
                            />
                            <label className='form-check-label'
                                htmlFor='data_management_training'>Data
                                Management
                                Training</label>
                        </div>
                    </div>

                </fieldset>

                <div className='form-group'>
                    <div className='d-grid gap-2'>
                        <button type='submit'
                            className='btn btn-secondary btn-green'>Submit
                        </button>
                    </div>
                </div>
            </form>
        </Col>
    );
}

SupportForm.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    rmdoProjectId: PropTypes.number.isRequired
};

export default SupportForm;
