import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RdmoContext from '../RdmoContext';
import postDmptProject from '../api/dmptProjects';

const saveDmpt = (token, userId, rdmoProjectId, setPostResult) => {
    setPostResult({ processing: true, posted: false, result: {} });
    postDmptProject(token, userId, rdmoProjectId).then((res) => {
        console.log('DmptSummary | save.js | saveDmpt | post res: ', res);
        setPostResult({ processing: false, posted: true, result: res });
    });
};

function SaveDmpt(props) {
    const { rdmoProjectId } = props;
    const rdmoContext = useContext(RdmoContext);

    const [postResult, setPostResult] = useState({
        processing: false,
        posted: false,
        result: {},
    });

    let buttonText = 'Save Project';
    let messageSection = <></>;
    if (postResult.processing) {
        buttonText = '... sending data';
    } else if (postResult.result !== {}) {
        if (postResult.result.status === 201) {
            buttonText = 'Your project has been saved';
            messageSection = (
                <p>
                    You can access a list of your saved data management plans
                    here: <Link to="/">DMPs</Link> with the option to edit the
                    content.
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
                    saveDmpt(
                        rdmoContext.backend_context.token,
                        rdmoContext.backend_context.user_id,
                        rdmoProjectId,
                        setPostResult
                    )
                }
                disabled={postResult.processing || postResult.posted}
            >
                <h6 className="sidebar-list-item">
                    <i className="mdi mdi-content-save-all-outline align-middle" />
                    {buttonText}
                </h6>
            </button>
            {messageSection}
        </>
    );
}

SaveDmpt.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
};

export default SaveDmpt;
