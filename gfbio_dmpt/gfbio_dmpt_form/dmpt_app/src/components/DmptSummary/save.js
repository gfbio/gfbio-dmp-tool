import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RdmoContext from '../RdmoContext';
import { URL_PREFIX } from '../api/constants';

function SaveDmpt(props) {
    const { rdmoProjectId, onSave, postResult, setPostResult } = props;
    const rdmoContext = useContext(RdmoContext);

    let buttonText = 'Save Project';
    let messageSection = <></>;
    if (postResult.processing) {
        buttonText = '... sending data';
    } else if (postResult.result !== {}) {
        // TODO: better error and retry handling
        if (postResult.result.status === 201) {
            buttonText = 'Your project has been saved';
            messageSection = (
                <p>
                    You can access a list of your saved data management plans
                    here: <Link to={URL_PREFIX}>DMPs</Link> with the option to
                    edit the content.
                </p>
            );
        }
        if (postResult.result.status >= 400) {
            buttonText = 'An error occurred. Please try again';
        }
    }

    return (
        <>
            <button
                type="button"
                className="list-group-item list-group-item-action "
                onClick={() =>
                    onSave(
                        rdmoContext.backend_context.token,
                        rdmoContext.backend_context.user_id,
                        rdmoProjectId,
                        setPostResult
                    )
                }
                disabled={postResult.processing || postResult.posted}
            >
                <h6 className="sidebar-list-item align-items-center">
                    <i className="mdi mdi-content-save-all-outline align-middle icon-green" />
                    {buttonText}
                </h6>
            </button>
            {messageSection}
        </>
    );
}

SaveDmpt.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    setPostResult: PropTypes.func.isRequired,
    postResult: PropTypes.shape({
        processing: PropTypes.bool.isRequired,
        posted: PropTypes.bool.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        result: PropTypes.object.isRequired,
    }).isRequired,
};

export default SaveDmpt;
