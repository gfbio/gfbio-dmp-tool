import React from 'react';
import PropTypes from 'prop-types';
import SaveDmpt from './save';
import DiscardAndExit from './discard';

function DmptSummary(props) {
    const { rdmoProjectId } = props;
    return (
        <div id={`summary-${rdmoProjectId}`} className="text-center">
            <div className="row">
                <div className="col-12">
                    <h1>Summary: {rdmoProjectId}</h1>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-6">
                    <SaveDmpt rdmoProjectId={rdmoProjectId} />
                </div>
                <div className="col-6">
                    <h2>Export PDF</h2>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-6">
                    <h2>Request Help</h2>
                </div>
                <div className="col-6">
                    <DiscardAndExit />
                </div>
            </div>
        </div>
    );
}

DmptSummary.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
};

export default DmptSummary;
