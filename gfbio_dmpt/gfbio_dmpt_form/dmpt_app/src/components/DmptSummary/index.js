import React from 'react';
import PropTypes from 'prop-types';
import SaveDmpt from './save';
import DiscardAndExit from './discard';
import SupportRequest from './support';
import PdfExport from './pdf';

function DmptSummary(props) {
    const { rdmoProjectId, dmptProjectId } = props;
    const saveDmpt =
        dmptProjectId < 0 ? (
            <div className="row mt-3">
                <div className="col-12">
                    <SaveDmpt rdmoProjectId={rdmoProjectId} />
                </div>
            </div>
        ) : (
            <></>
        );
    return (
        <div id={`summary-${rdmoProjectId}`} className="text-center">
            <div className="row">
                <div className="col-12">
                    <h1>Summary: {rdmoProjectId}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    {saveDmpt}
                    <div className="row mt-3">
                        <div className="col-12">
                            <PdfExport rdmoProjectId={rdmoProjectId} />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <DiscardAndExit />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-12 ps-5 ms-5">
                            <SupportRequest rdmoProjectId={rdmoProjectId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

DmptSummary.defaultProps = {
    dmptProjectId: -1,
};

DmptSummary.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
    dmptProjectId: PropTypes.number,
};

export default DmptSummary;
