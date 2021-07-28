import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { forEach } from 'react-bootstrap/ElementChildren';
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

const fetchOtions = async (optionSetId) => {
    return await axios.get(
        `${API_ROOT}options/options/?optionset=${optionSetId}`,
        {
            headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
        }
    );
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
                    res.forEach((item) => {
                        item.data.forEach((q) => {
                            console.log('###############');
                            console.log(q);
                            if (q.optionsets.length > 0) {
                                console.log(q.optionsets, ' - ', q.widget_type);
                            }
                            tmp.push(q);
                        });
                        // tmp.push(item.data);
                        // console.log(item.data);
                    });
                    rdmoContext.assignQuestions(tmp);
                    setStage('... fetch options ...');
                    // tmp.forEach((item)=>{
                    //     console.log(item);
                    // });
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

const iterateQuestions = (questions) => {
    return questions.map((item) => {
        return (
            <div className='form-group' key={item.id}>
                <label htmlFor={`input_item_${item.id}`}>
                    <i>{item.id}</i>:{item.text_en}
                </label>
                <input type={item.widget_type} className='form-control'
                    id={`input_item_${item.id}`}
                    placeholder='name@example.com' />
                <small id={`help_item_${item.id}`}
                    className='form-text text-muted'>
                    {item.help_en}
                </small>
            </div>
        );
    });
};

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    const rdmoContext = useContext(RdmoContext);
    const [processing, stage] = useDmptStart(rdmoContext);

    console.log(`DmptStart. processing ${processing}`);
    const status = (
        <div>
            <h2><i>{stage}</i></h2>
        </div>
    );
    let formFields = <></>;
    if (!processing) {
        console.log('no processing. proceed : ');
        formFields = iterateQuestions(rdmoContext.questions_data);
    }
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart</h1>
            {status}
            <form>
                {formFields}
            </form>
            {/* <form> */}
            {/*    <div className='form-group'> */}
            {/*        <label htmlFor='exampleFormControlInput1'>Email */}
            {/*            address</label> */}
            {/*        <input type='email' className='form-control' */}
            {/*            id='exampleFormControlInput1' */}
            {/*            placeholder='name@example.com' /> */}
            {/*        <small id='passwordHelpBlock' */}
            {/*            className='form-text text-muted'> */}
            {/*            Your password must be 8-20 characters long, contain */}
            {/*            letters and numbers, and must not contain spaces, */}
            {/*            special characters, or emoji. */}
            {/*        </small> */}
            {/*    </div> */}
            {/*    <div className='form-group'> */}
            {/*        <label htmlFor='exampleFormControlSelect1'>Example */}
            {/*            select</label> */}
            {/*        <select className='form-control' */}
            {/*            id='exampleFormControlSelect1'> */}
            {/*            <option>1</option> */}
            {/*            <option>2</option> */}
            {/*            <option>3</option> */}
            {/*            <option>4</option> */}
            {/*            <option>5</option> */}
            {/*        </select> */}
            {/*    </div> */}
            {/*    <div className='form-group'> */}
            {/*        <label htmlFor='exampleFormControlSelect2'>Example multiple */}
            {/*            select</label> */}
            {/*        <select multiple className='form-control' */}
            {/*            id='exampleFormControlSelect2'> */}
            {/*            <option>1</option> */}
            {/*            <option>2</option> */}
            {/*            <option>3</option> */}
            {/*            <option>4</option> */}
            {/*            <option>5</option> */}
            {/*        </select> */}
            {/*    </div> */}
            {/*    <div className='form-group'> */}
            {/*        <label htmlFor='exampleFormControlTextarea1'>Example */}
            {/*            textarea</label> */}
            {/*        <textarea className='form-control' */}
            {/*            id='exampleFormControlTextarea1' */}
            {/*            rows='3' /> */}
            {/*    </div> */}
            {/* </form> */}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
