import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import SaveDmpt from './save';
import DiscardAndExit from './discard';
import SupportRequest from './support';
import PdfExport from './pdf';
import RdmoContext from '../RdmoContext';

import postDmptProject from '../api/dmptProjects';
const saveDmpHanlder = (token, userId, rdmoProjectId, setPostResult) => {
    setPostResult({ processing: true, posted: false, result: {} });
    postDmptProject(token, userId, rdmoProjectId).then((res) => {
        setPostResult({ processing: false, posted: true, result: res });
    });
};

function DmptSummary(props) {
    const { rdmoProjectId, dmptProjectId, issueKey, resetRdmoProjectId } =
        props;
    const rdmoContext = useContext(RdmoContext);

    const [postResult, setPostResult] = useState({
        processing: false,
        posted: false,
        result: {},
    });

    const saveDmp =
        dmptProjectId < 0 &&
        rdmoContext.backend_context.isLoggedIn !== 'false' ? (
            <div className="row mt-3">
                <div className="col-12">
                    <SaveDmpt
                        rdmoProjectId={rdmoProjectId}
                        onSave={saveDmpHanlder}
                        postResult={postResult}
                        setPostResult={setPostResult}
                    />
                </div>
            </div>
        ) : (
            <></>
        );

    let discardAndExit =
        dmptProjectId < 0 &&
        rdmoContext.backend_context.isLoggedIn !== 'false' ? (
            <div className="row mt-3">
                <div className="col-12">
                    <DiscardAndExit resetRdmoProjectId={resetRdmoProjectId} />
                </div>
            </div>
        ) : (
            <></>
        );

    /* NOTE:  <02-06-22, claas> This hides away the discard and exit when
     * the dmp is successfully saved */
    if (postResult.result !== {}) {
        if (postResult.result.status === 201) {
            discardAndExit = <></>;
        }
    }

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
                    <h1>Finalize DMP</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    {saveDmp}
                    <div className="row mt-3">
                        <div className="col-12">
                            <PdfExport rdmoProjectId={rdmoProjectId} />
                        </div>
                    </div>
                    {discardAndExit}
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
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
};

export default DmptSummary;
