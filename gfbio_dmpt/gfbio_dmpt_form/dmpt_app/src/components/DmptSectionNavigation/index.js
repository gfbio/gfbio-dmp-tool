import React from 'react';
import PropTypes from "prop-types";

function DmptSectionNavigation(props) {
    const {catalogId, token} = props;
}

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
};

export default DmptSectionNavigation;
