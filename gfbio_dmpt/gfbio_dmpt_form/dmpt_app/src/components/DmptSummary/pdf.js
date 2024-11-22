import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import { PROJECT_API_ROOT } from '../api/constants';

function PdfExport(props) {
    const { rdmoProjectId } = props;
    const rdmoContext = useContext(RdmoContext);

    return (
        <>
            <a
                className="btn list-group-item list-group-item-action"
                href={`${PROJECT_API_ROOT}export/${rdmoProjectId}/pdf?username=${rdmoContext.backend_context.user_name}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <h6 className="sidebar-list-item align-items-center">
                    <i className="mdi mdi-file-pdf-box align-middle icon-green" />
                    Export to PDF
                </h6>
            </a>
        </>
    );
}

PdfExport.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
};

export default PdfExport;
