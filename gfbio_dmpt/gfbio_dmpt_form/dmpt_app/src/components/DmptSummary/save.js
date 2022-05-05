import React from 'react';
import PropTypes from 'prop-types';

const saveDmpt = (rdmoProjectId) => {
    console.log('DmptSummary | save.js | saveDmpt | prj id: ', rdmoProjectId);
};

function SaveDmpt(props) {
    const { rdmoProjectId } = props;

    return (
        <button
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => saveDmpt(rdmoProjectId)}
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
