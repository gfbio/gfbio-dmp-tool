import React from 'react';
import PropTypes from "prop-types";

function DmptSummary(props) {
    const {rdmoProjectId} = props;
    return (
        <h1>Summary: {rdmoProjectId}</h1>
    );
}

DmptSummary.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
};

export default DmptSummary;
