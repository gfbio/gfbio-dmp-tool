import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { PROJECT_API_ROOT } from '../api/constants';
import DmptLoading from '../DmptLoading';
import DmptSectionNavigation from '../DmptSectionNavigation';

const useDmptFormLoader = (dmptProjectId, token) => {
    const [processing, setProcessing] = useState(true);
    const [dmptProjectData, setDmptProjectData] = useState({ form_data: {} });
    useEffect(() => {
        async function prepareDmptProjectData() {
            setProcessing(true);
            try {
                const result = await axios.get(
                    `${PROJECT_API_ROOT}dmptprojects/${dmptProjectId}/`,
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
                setDmptProjectData(result.data);
                setProcessing(false);
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptProjectData();
    }, []);
    return [processing, dmptProjectData];
};

function DmptFormLoader(props) {
    const { token, catalogId, dmptProjectId } = props;
    const [processing, dmptProjectData] = useDmptFormLoader(
        dmptProjectId,
        token
    );

    console.log(
        `DmptFormLoader |  processing: ${processing} | `,
        ' | dmptProjectData: ',
        dmptProjectData
    );

    if (processing) {
        return <DmptLoading />;
    }

    return (
        <DmptSectionNavigation
            token={token}
            catalogId={catalogId}
            dmptProjectData={dmptProjectData}
        />
    );
}

DmptFormLoader.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    dmptProjectId: PropTypes.number.isRequired,
};

export default DmptFormLoader;
