import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import { map } from 'react-bootstrap/ElementChildren';

function useDmptStart(rdmoContext) {
    const [projectResponse, setProjectResponse] = useState({});
    const [processing, setProcessing] = useState(true);
    const [queRes, setQueRes] = useState({});
    // const [firstSectionId, setFirstSectionId] = useState(-1);

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

            await axios.get(
                `${API_ROOT}questions/sections/?catalog=${catalogId}`,
                {
                    headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                }).then((response) => {
                rdmoContext.assignSections(response.data);
                return axios.get(
                    `${API_ROOT}questions/questionsets/?section=${response.data[0].id}`,
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
            }).then((response) => {
                rdmoContext.assignQuestionSets(response.data);
                const questions = {};
                response.data.forEach(qs => {
                    axios.get(
                        `${API_ROOT}questions/questions/?questionset=${qs.id}`,  // section for gfbio catalog id hardcoded
                        {
                            headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                        }
                    ).then(
                        function(res) {
                            console.log("question response for "+qs.id);
                            console.log(typeof res.data);
                            console.log(res.data);
                            console.log('.............');
                            // questions.push(res.data);
                            questions[qs.id] = res.data;
                        }
                    ).catch(function(error) {
                        console.log(error);
                    });
                });
                rdmoContext.assignQuestions(questions);
                setQueRes(questions);
                return questions;
            }).then((response) => {
                console.warn('last response/promise');
                console.warn(response);
                // rdmoContext.assignQuestions(response);
                // setQueRes(response.map(item => {
                //     return <li>{item.id}</li>;
                // }));
            }).finally(() => {
                setProcessing(false);
            });

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

    return [projectResponse, processing, queRes];
}

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    // const bsi = props.bsi || '';
    const rdmoContext = useContext(RdmoContext);
    const [projectResponse, processing, queRes] = useDmptStart(rdmoContext);

    console.log(`DmptStart. processing ${processing}`);
    let body = (
        <h2><i>...processing</i></h2>
    );
    if (!processing) {
        console.log('no processing. questions: ');
        console.debug(rdmoContext.questions_data);
        console.log(typeof rdmoContext.questions_data);
        console.log(rdmoContext.questions_data.length);
        console.warn(queRes);
        // let x = queRes.map((q, index) => {
        //     console.log(q);
        //     return <li>{q[0]}</li>;
        // });
        // console.info(x);
        // let tq = rdmoContext.questions_data;
        // const questions = tq.map((q, index) => {
        //     console.log(`${index} ---- q:`);
        //     return true;
        // });
        //     console.log(`${index} ---- q:`);
        //     console.log(q);
        //     if (q.size === 1) {
        //         return <li key={index}>
        //             <p>{q[0].id}</p>
        //         </li>;
        //     }
        //     return <li>öosjkndf</li>;
        //
        // });
        // console.log(questions);
        // body = <ul>
        //     {questions}
        // </ul>;
        body = (
            <h3>Done</h3>
        );
    }
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart</h1>
            {body}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
