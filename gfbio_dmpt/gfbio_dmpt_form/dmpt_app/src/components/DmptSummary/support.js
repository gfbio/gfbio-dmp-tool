// I dont know why the linter is still complaining about this, all lablels and
// inputs are related by id & htmlFor
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useSupportForm from '../DmptHooks/supportFormHooks';
import postSupportRequest from '../api/support';
import RdmoContext from '../RdmoContext';
import { HELPDESK_ROOT } from '../api/constants';
import DmptLoading from '../DmptLoading';

function SupportRequest(props) {
    const { rdmoProjectId, issueKey } = props;
    const rdmoContext = useContext(RdmoContext);

    const [issue, setIssue] = useState({
        status: -1,
        issue_key: '',
        issue_url: '',
    });
    const [processing, setProcessing] = useState(false);

    const submitRequest = (inputs) => {
        const data = inputs;
        data.rdmo_project_id = rdmoProjectId;
        postSupportRequest(
            data,
            rdmoContext.backend_context.token,
            setProcessing
        ).then((res) => {
            setIssue({
                status: res.status,
                issue_key: res.issue_key,
                issue_url: res.issue_url,
            });
        });
    };

    const { inputs, handleInputChange, handleSubmit } = useSupportForm(
        submitRequest,
        {
            email: rdmoContext.backend_context.user_email,
        }
    );

    if (processing) {
        return <DmptLoading text="Processing request for support ..." />;
    }

    let message = <></>;
    if (issue.status >= 400) {
        message = <h5>An error occurred, please try again later ...</h5>;
    } else if (issue.status >= 200 && issue.status < 300) {
        return (
            <div>
                <h6 className="sidebar-list-item">
                    <i className="mdi mdi-account-voice align-middle" />
                    Request DMP Support
                </h6>
                <h5>Your request was received</h5>
                <p>You will soon be contacted by our helpdesk staff.</p>
                <p>
                    Your issue key is <b>{issue.issue_key}</b>. Please refer to
                    it in any future communication. To access your issue, please
                    visit <a href={issue.issue_url}>{issue.issue_url}</a>
                </p>
            </div>
        );
    }

    if (issueKey !== '') {
        return (
            <div>
                <h6 className="sidebar-list-item">
                    <i className="mdi mdi-account-voice align-middle" />
                    Request DMP Support
                </h6>
                <h5>You have already send a request for Support !</h5>
                <p>
                    Your issue key is <b>{issueKey}</b>. Please refer to it in
                    any future communication. To access your issue, please visit{' '}
                    <a
                        href={`${HELPDESK_ROOT}${issueKey}`}
                    >{`${HELPDESK_ROOT}${issueKey}`}</a>
                </p>
            </div>
        );
    }

    return (
        <div className="accordion" id="supportAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingSupport">
                    <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSupport"
                        aria-expanded="false"
                        aria-controls="collapseSupport"
                    >
                        <i className="mdi mdi-account-voice align-middle me-2"/>
                        Request DMP Support
                    </button>
                </h2>
                <div
                    id="collapseSupport"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSupport"
                    data-bs-parent="#supportAccordion"
                >
                    <div className="accordion-body">
                        {message}
                        <form
                            id="supportForm"
                            className="text-start"
                            onSubmit={handleSubmit}
                        >
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    aria-describedby="emailHelp"
                                    onChange={handleInputChange}
                                    value={inputs.email}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="message"
                                    className="col-sm-3 col-form-label"
                                >
                                    Message
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    id="message"
                                    name="message"
                                    onChange={handleInputChange}
                                    value={inputs.message}
                                    required
                                />
                            </div>
                            <fieldset className="mb-3">
                                <legend className="col-form-label">
                                    What services are you interested in?
                                </legend>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="data_collection_and_assurance"
                                                name="data_collection_and_assurance"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="data_collection_and_assurance"
                                            >
                                                Data Collection and Assurance
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="data_curation"
                                                name="data_curation"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="data_curation"
                                            >
                                                Data Curation
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="data_archiving"
                                                name="data_archiving"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="data_archiving"
                                            >
                                                Data Archiving
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="data_visualization_and_analysis"
                                                name="data_visualization_and_analysis"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="data_visualization_and_analysis"
                                            >
                                                Data Visualization and Analysis
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="terminology_service"
                                                name="terminology_service"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="terminology_service"
                                            >
                                                Terminology Service
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="data_publication"
                                                name="data_publication"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="data_publication"
                                            >
                                                Data Publication
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="data_management_training"
                                                name="data_management_training"
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="data_management_training"
                                            >
                                                Data Management Training
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-secondary btn-green"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

SupportRequest.defaultProps = {
    issueKey: '',
};
SupportRequest.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
    issueKey: PropTypes.string,
};

export default SupportRequest;
