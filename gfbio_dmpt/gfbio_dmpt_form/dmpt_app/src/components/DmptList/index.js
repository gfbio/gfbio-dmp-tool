import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HELPDESK_ROOT, PROJECT_API_ROOT } from '../api/constants';
import DmptLoading from '../DmptLoading';

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
        const issue =
            dmp.issue === '' ? (
                <a className="action me-4" href="EDIT">
                    <i className="mdi mdi-message-reply-text-outline dmp align-middle me-2" />
                    Request Support
                </a>
            ) : (
                <a
                    className="action me-4"
                    href={`${HELPDESK_ROOT}${dmp.issue}`}
                >
                    <i className="mdi mdi-message-reply-text-outline dmp align-middle me-2" />
                    {`${dmp.issue}`}
                </a>
            );
        // const support =
        //     dmp.issue !== '' ? (
        //         <></>
        //     ) : (
        //         <a className="d-inline-block" href="EDIT">
        //             <i className="mdi mdi-account-voice" />
        //             Request Support
        //         </a>
        //     );

        return (
            // <Link
            //     className="list-group-item-action"
            //     id={index}
            //     // to={`${URL_PREFIX}${dmp.id}`}
            //     to={`${dmp.id}`}
            // >
            //     {dmp.title}
            // </Link>
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
                            {/* <div className="col-3 align-self-center"> */}
                            {/*     {issue} */}
                            {/* </div> */}
                        </Link>
                    </div>
                    <div className="col-4 align-self-center text-start">
                        {/* {support} */}
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
            <div id="dmp-list">
                <div className="row">
                    <div className="col-12 submission-list">
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
                            <div className="col-md-2"></div>
                        </div>

                        <ul>{dmps}</ul>
                        {/* <hr /> */}
                        {/* <Link to="new">New</Link> */}
                        {/* <div className="list-group">{dmps}</div> */}
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
