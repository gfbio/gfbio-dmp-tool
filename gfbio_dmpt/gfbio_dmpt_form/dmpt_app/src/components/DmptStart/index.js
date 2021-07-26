import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { API_ROOT } from '../../constants/api/api_constants';

function useDmptStart() {
    const [projectResponse, setProjectResponse] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        async function postTmpProject() {
            // FIXME: better display questions first then create project as last step
            try {
                console.log('post project');
                setProcessing(true);
                const response = await axios.post(
                    `${API_ROOT}projects/projects/`,
                    {
                        'title': `tmp_${nanoid()}`,
                        'description': `tmp_${nanoid()} temporary project`,
                        'catalog': 18   // gfbio catalog id hardcoded
                        // "parent": "string"
                    },
                    {
                        // token of super user (maweber)
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                console.log('response');
                console.log(response.data);
                setProjectResponse(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setProcessing(false);
            }

            try {
                console.log('get section 1 / QS 1 ');
                const response = await axios.get(
                    `${API_ROOT}questions/sections/?catalog=18`,  // section for gfbio catalog id hardcoded
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                console.log('response');
                console.log(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                ;
            }

        }

        postTmpProject();
    }, []);

    return [projectResponse, processing];
}

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    // const bsi = props.bsi || '';
    console.log('DmptStart');
    // console.log(props)
    const [projectResponse, processing] = useDmptStart();
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart</h1>
            <p>processing: {`${processing}`}</p>
            {`${projectResponse}`}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
