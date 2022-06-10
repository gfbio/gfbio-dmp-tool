import React from 'react';
import PropTypes from 'prop-types';
import SupportRequest from '../DmptSummary/support';

function SupportModal(props) {
    const { target, rdmoProjectId, title, issueKey } = props;
    return (
        <div
            className="modal fade"
            id={target}
            tabIndex="-1"
            aria-labelledby={`${target}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title" id={`${target}Label`}>
                            {title}
                        </h6>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">
                        <SupportRequest
                            rdmoProjectId={rdmoProjectId}
                            issueKey={issueKey}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary btn-green-inverted"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

SupportModal.defaultProps = {
    issueKey: '',
};

SupportModal.propTypes = {
    target: PropTypes.string.isRequired,
    rdmoProjectId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    issueKey: PropTypes.string,
};

export default SupportModal;
