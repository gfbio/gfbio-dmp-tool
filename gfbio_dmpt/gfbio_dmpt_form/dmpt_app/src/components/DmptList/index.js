import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HELPDESK_ROOT, PROJECT_API_ROOT } from '../api/constants';
import DmptLoading from '../DmptLoading';
import SupportModal from './supportModal';

const useDmpList = (token) => {
    const [processing, setProcessing] = useState(true);
    const [dmpList, setDmpList] = useState([]);
    useEffect(() => {
        async function fetchProjectList() {
            setProcessing(true);
            try {
                const result = await axios.get(
                    `${PROJECT_API_ROOT}dmptprojects/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setDmpList(result.data);
                setProcessing(false);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProjectList();
    }, []);
    return [processing, dmpList];
};

const dmpsAsListElements = (dmpList) => {
    return dmpList.map((dmp, index) => {
        const title =
            dmp.title.length > 60
                ? `${dmp.title.substring(0, 58)} (...)`
                : dmp.title;

        // TODO: add support.js component in popup or accordion, triggered by link for "Request Support"
        const issue =
            dmp.issue === '' ? (
                <>
                    <button
                        type="button"
                        className="btn btn-link action p-0 border-0 me-4"
                        data-bs-toggle="modal"
                        data-bs-target={`#supportFor${dmp.id}`}
                    >
                        <i className="mdi mdi-message-reply-text-outline dmp align-middle me-2" />
                        Request Support
                    </button>
                    <SupportModal
                        target={`supportFor${dmp.id}`}
                        rdmoProjectId={dmp.rdmo_project}
                        title={title}
                        issueKey={dmp.issue}
                    />
                </>
            ) : (
                <a
                    className="action me-4"
                    href={`${HELPDESK_ROOT}${dmp.issue}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="mdi mdi-message-reply-text-outline dmp align-middle me-2" />
                    {`${dmp.issue}`}
                </a>
            );

        return (
            <li className="list-group-item">
                <div className="row wrapping-row no-gutters">
                    <div className="col-8">
                        <Link
                            className="row no-gutters"
                            id={index}
                            to={`${dmp.id}`}
                        >
                            <div className="col-9 align-self-center">
                                <i className="mdi mdi-text-box-outline ms-4 me-4 dmp align-middle" />
                                <span className="">{title}</span>
                            </div>
                        </Link>
                    </div>
                    <div className="col-4 align-self-center text-start">
                        {issue}
                        <a
                            className="action"
                            href={`${PROJECT_API_ROOT}export/${dmp.rdmo_project}/pdf?username=${dmp.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="mdi mdi-file-pdf-box dmp me-2" />
                            Export to PDF
                        </a>
                    </div>
                </div>
            </li>
        );
    });
};

function DmptList(props) {
    const { token } = props;

    const [processing, dmpList] = useDmpList(token);
    const dmps = dmpsAsListElements(dmpList);

    if (processing) {
        return <DmptLoading />;
    }

    return (
        <>
            <div id="dmp-list" className="">
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="d-grid gap-2">
                            <Link
                                className="btn btn-secondary btn-green-inverted new-dmp"
                                to="new"
                            >
                                Start a new Data Management Plan
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 dmp-list">
                        <div className="row no-gutters">
                            <div className="col-12">
                                <div className="row no-gutters">
                                    <div className="col-8 align-self-center">
                                        <h6 className="ps-2">Title</h6>
                                    </div>
                                    <div className="col-2 align-self-center">
                                        <h6 className="ps-2">Support</h6>
                                    </div>
                                    <div className="col-2 align-self-center">
                                        <h6>Export</h6>
                                    </div>
                                </div>
                            </div>

                            <ul>{dmps}</ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

DmptList.propTypes = {
    token: PropTypes.string.isRequired,
};

export default DmptList;
