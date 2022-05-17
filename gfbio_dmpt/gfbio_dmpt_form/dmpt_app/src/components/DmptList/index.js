import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PROJECT_API_ROOT } from '../api/constants';
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

// [
//     {
//         "id": 29,  --> DMPTProject id/pk
//         "user": 1,
//         "rdmo_project": 156, rdmo_project id/pk
//         "title": "tmp_6IHLMd4G9wpesxX7s6ZA3"
//     },
const dmpsAsListElements = (dmpList) => {
    return dmpList.map((dmp, index) => {
        return (
            <Link
                className="list-group-item-action"
                id={index}
                // to={`${URL_PREFIX}${dmp.id}`}
                to={`${dmp.id}`}
            >
                {dmp.title}
            </Link>
        );
    });
};

function DmptList(props) {
    const { token, updateStatusCode } = props;

    const [processing, dmpList] = useDmpList(token);
    const dmps = dmpsAsListElements(dmpList);

    if (processing) {
        return <DmptLoading />;
    }

    let message = <></>;
    if (updateStatusCode >= 200 && updateStatusCode < 300) {
        message = <div className="alert alert-success alert-dismissible fade show" role="alert">
            <h4 className="alert-heading">Update Successful !</h4>
            <p>Your Data Management Plan has been successfully updated.</p>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
        </div>;
    }

    return (
        <>
            {message}
            <div id="dmp-list">
                <div className="row">
                    <div className="col-12">
                        <Link to="new">New</Link>
                        <div className="list-group">{dmps}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

DmptList.defaultProps = {
    updateStatusCode: 0,
};

DmptList.propTypes = {
    token: PropTypes.string.isRequired,
    updateStatusCode: PropTypes.number,
};

export default DmptList;
