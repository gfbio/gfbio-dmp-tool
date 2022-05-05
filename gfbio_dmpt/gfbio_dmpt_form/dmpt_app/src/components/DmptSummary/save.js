import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import postDmptProject from '../api/dmptProjects';
import RdmoContext from '../RdmoContext';

const saveDmpt = (token, userId, rdmoProjectId) => {
    postDmptProject(token, userId, rdmoProjectId).then((res) => {
        console.log('DmptSummary | save.js | saveDmpt | post res: ', res);
    });
};

function SaveDmpt(props) {
    const { rdmoProjectId } = props;
    const rdmoContext = useContext(RdmoContext);

    return (
        <button
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() =>
                saveDmpt(
                    rdmoContext.backend_context.token,
                    rdmoContext.backend_context.user_id,
                    rdmoProjectId
                )
            }
        >
            <h6 className="sidebar-list-item">
                <i className="mdi mdi-content-save-all-outline align-middle" />
                Save Project
            </h6>
        </button>
    );
}

SaveDmpt.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
};

export default SaveDmpt;
