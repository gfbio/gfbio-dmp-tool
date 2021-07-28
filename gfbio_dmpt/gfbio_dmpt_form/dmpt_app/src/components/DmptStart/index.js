import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';

const fetchQuestion = async (q) => {
    return await axios.get(
        `${API_ROOT}questions/questions/?questionset=${q.id}`,
        {
            headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
        }
    );
};

const fetchQuestions = async (qsResponse) => {
    return Promise.all(qsResponse.data.map((qs) => fetchQuestion(qs)));
};

function useDmptStart(rdmoContext) {
    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    console.log('useDmpStart');
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

            setProcessing(true);
            // section for gfbio catalog id hardcoded
            const catalogId = '18';

            try {
                setStage('... fetch sections ...');
                const sectionResponse = await axios.get(
                    `${API_ROOT}questions/sections/?catalog=${catalogId}`,  // section for gfbio catalog id hardcoded
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                rdmoContext.assignSections(sectionResponse.data);
                setStage('... fetch questionsets ...');
                const qsResponse = await axios.get(
                    `${API_ROOT}questions/questionsets/?section=${sectionResponse.data[0].id}`,  // section for gfbio catalog id hardcoded
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                rdmoContext.assignQuestionSets(qsResponse.data);
                setStage('... fetch questions ...');
                fetchQuestions(qsResponse).then((res) => {
                    const tmp = [];
                    res.map((item) => {
                        tmp.push(item.data);
                        return true;
                    });
                    rdmoContext.assignQuestions(tmp);
                    setStage('... DONE ...');
                    setProcessing(false);
                });

            } catch (e) {
                console.error(e);
            } finally {
                ;
            }

        }

        prepareDmptStart();
    }, []);

    return [processing, stage];
}

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    const rdmoContext = useContext(RdmoContext);
    const [processing, stage] = useDmptStart(rdmoContext);

    // TODO: mehr feedback nach requests. z.B. 'getting sections', 'gettins sets', 'getting quesetions', 'preparing forms'
    console.log(`DmptStart. processing ${processing}`);
    let body = (
        <div>
            <h2><i>{stage}</i></h2>
        </div>
    );
    // if (!processing) {
    //     console.log('no processing. context: ');
    //     body = (
    //         <h3>Done</h3>
    //     );
    // }
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart</h1>
            {body}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
