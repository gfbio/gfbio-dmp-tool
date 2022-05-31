import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SaveDmpt from './save';
import DiscardAndExit from './discard';
import SupportRequest from './support';
import PdfExport from './pdf';
import RdmoContext from '../RdmoContext';

function DmptSummary(props) {
    const { rdmoProjectId, dmptProjectId, issueKey, resetRdmoProjectId } = props;
    const rdmoContext = useContext(RdmoContext);

    const saveDmpt =
        dmptProjectId < 0 &&
        rdmoContext.backend_context.isLoggedIn !== 'false' ? (
                <div className="row mt-3">
                    <div className="col-12">
                        <SaveDmpt rdmoProjectId={rdmoProjectId} />
                    </div>
                </div>
            ) : (
                <></>
            );

    const saveInfo =
        rdmoContext.backend_context.isLoggedIn === 'false' ? (
            <div className="row mt-5">
                <div className="col-12">
                    <h6>Saving your DMP</h6>
                    <p>
                        To save your Data Management Plan, you need to login
                        first. To login or sign up, visit this link:{' '}
                        <a
                            href="https://sso.gfbio.org/simplesaml/module.php/accountui/register.php"
                            className="btn btn-secondary btn-green"
                        >
                            Sign In
                        </a>
                    </p>
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
                            <DiscardAndExit resetRdmoProjectId={resetRdmoProjectId} />
                        </div>
                    </div>
                    {saveInfo}
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-12 ps-5 ms-5">
                            <SupportRequest
                                rdmoProjectId={rdmoProjectId}
                                issueKey={issueKey}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

DmptSummary.defaultProps = {
    dmptProjectId: -1,
    issueKey: '',
};

DmptSummary.propTypes = {
    rdmoProjectId: PropTypes.number.isRequired,
    resetRdmoProjectId: PropTypes.func.isRequired,
    dmptProjectId: PropTypes.number,
    issueKey: PropTypes.string,
};

export default DmptSummary;
