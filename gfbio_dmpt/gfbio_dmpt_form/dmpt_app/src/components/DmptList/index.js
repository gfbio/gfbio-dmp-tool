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
                    <div className="col-12">
                        <Link to="new">New</Link>
                        <div className="list-group">{dmps}</div>
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
