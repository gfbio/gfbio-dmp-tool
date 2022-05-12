import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PROJECT_API_ROOT, URL_PREFIX } from '../api/constants';
import DmptLoading from '../DmptLoading';

const useDmpList = (token) => {
    const [processing, setProcessing] = useState(true);
    const [dmpList, setDmpList] = useState([]);
    useEffect(() => {
        async function fetchProjectList() {
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
            <li>
                <Link id={index} to={`${URL_PREFIX}${dmp.id}`}>
                    {dmp.title}
                </Link>
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
        <div id="dmp-list">
            <div className="row">
                <div className="col-12">
                    <ul>{dmps}</ul>
                </div>
            </div>
        </div>
    );
}

DmptList.propTypes = {
    token: PropTypes.string.isRequired,
};

export default DmptList;
