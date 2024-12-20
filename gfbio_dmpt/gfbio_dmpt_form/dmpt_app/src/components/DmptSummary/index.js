import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import RdmoContext from '../RdmoContext';
import DiscardAndExit from './discard';
import PdfExport from './pdf';
import SaveDmpt from './save';
import SupportRequest from './support';

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
                <div className="col-md-10 offset-md-1">
                    <h6>Saving your DMP</h6>
                    <p>
                        To save your Data Management Plan, you need to login
                        first. To login or sign up, visit this link:{' '}
                        <a
                            href="https://dmp.gfbio.dev/oidc/authenticate/"
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
        <div id={`summary-${rdmoProjectId}`}>
            <header className="text-center mb-4">
                <h1 className="display-5">Finalize DMP</h1>
            </header>
            <div className="row">
                <div className="col-md-6 offset-md-3 mb-4">
                    {saveInfo}
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 offset-md-3 mb-4">
                    <SupportRequest
                        rdmoProjectId={rdmoProjectId}
                        issueKey={issueKey}
                    />
                </div>
                <div className="col-md-3 mb-4 justify-content-center">
                    <div className="card shadow-sm w-100">
                        <div className="card-body">
                            <h6 className="card-title sidebar-list-item text-left">Other Actions</h6>
                            <div className="mb-3">
                                {saveDmp}
                            </div>
                            <div className="mb-3">
                                <div
                                    className="row mt-3 justify-content-center">
                                    <div className="col-10">
                                        <PdfExport
                                            rdmoProjectId={rdmoProjectId}/>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                {discardAndExit}
                            </div>
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
