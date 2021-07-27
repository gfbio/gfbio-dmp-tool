import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';

function useDmptStart() {
    const [projectResponse, setProjectResponse] = useState({});
    const [processing, setProcessing] = useState(false);
    const [firstSectionId, setFirstSectionId] = useState(-1);

    const rdmoContext = useContext(RdmoContext);
    console.log(rdmoContext);
    console.log('------------------');

    useEffect(() => {
        async function prepareDmptStart() {
            // FIXME: better display questions first then create project as last step
            // PROJECT CREATE WITH AUTO_ID --------------------------------------------
            // try {
            //     console.log('post project');
            //     setProcessing(true);
            //     const response = await axios.post(
            //         `${API_ROOT}projects/projects/`,
            //         {
            //             'title': `tmp_${nanoid()}`,
            //             'description': `tmp_${nanoid()} temporary project`,
            //             'catalog': 18   // gfbio catalog id hardcoded
            //             // "parent": "string"
            //         },
            //         {
            //             // token of super user (maweber)
            //             headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
            //         }
            //     );
            //     console.log('response');
            //     console.log(response.data);
            //     setProjectResponse(response.data);
            // } catch (e) {
            //     console.error(e);
            // } finally {
            //     setProcessing(false);
            // }
            // ------------------------------------------------------------

            const cata

            /*
            try {
                setProcessing(true);
                const sectionResponse = await axios.get(
                    `${API_ROOT}questions/sections/?catalog=18`,  // section for gfbio catalog id hardcoded
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                rdmoContext.assignSections(sectionResponse.data);
                const qsResponse = await axios.get(
                    `${API_ROOT}questions/questionsets/?section=${sectionResponse.data[0].id}`,  // section for gfbio catalog id hardcoded
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                rdmoContext.assignQuestionSets(qsResponse.data);
                const questions = [];
                qsResponse.data.forEach(qs => {
                    axios.get(
                        `${API_ROOT}questions/questions/?questionset=${qs.id}`,  // section for gfbio catalog id hardcoded
                        {
                            headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                        }
                    ).then(
                        function(response) {
                            // console.log(response.data);
                            questions.push(response.data);
                        }
                    ).catch(function(error) {
                        console.log(error);
                    });
                });
                rdmoContext.assignQuestions(questions);
            } catch (e) {
                console.error(e);
            } finally {
                setProcessing(false);
            } */
        }

        prepareDmptStart();
    }, []);

    return [projectResponse, processing];
}

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    // const bsi = props.bsi || '';
    console.log('DmptStart');

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
