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
    // FIXME: await ?
    return Promise.all(qsResponse.data.map((qs) => fetchQuestion(qs)));
};

const fetchOptions = async (optionSet) => {
    return await axios.get(
        `${API_ROOT}options/options/?optionset=${optionSet}`,
        {
            headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
        }
    );

};

const fetchAllOptions = async (optionSets) => {
    // FIXME: await ?
    return Promise.all(optionSets.map((o) => fetchOptions(o)));
};

function useDmptStart(rdmoContext) {
    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    // console.log('useDmpStart');
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
                // TODO: first section only here. hardcoded
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
                    const oSets = [];
                    const options = [];
                    res.forEach((item) => {
                        item.data.forEach((q) => {
                            if (q.optionsets.length > 0) {
                                // console.log('q:', q.id, 'pushing oset ', q.optionsets);
                                q.optionsets.forEach((oSet) => {
                                    oSets.push(oSet);
                                });
                            }
                            tmp.push(q);
                        });
                    });
                    rdmoContext.assignQuestions(tmp);
                    setStage('... fetch options ...');
                    // console.log(oSets);
                    fetchAllOptions(oSets).then((oRes) => {
                        oRes.forEach((o) => {
                            // console.log(o);
                            options.push(o.data);
                        });
                        rdmoContext.assignOptions(options);
                        setStage('... DONE ...');
                        setProcessing(false);
                    });
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

const iterateQuestions = (questions, options) => {
    return questions.map((item) => {
        console.log('widget_type ', item.widget_type);
        if (item.widget_type === 'textarea') {
            return (
                <div className='form-group' key={item.id}>
                    <label htmlFor={`input_item_${item.id}`}>
                        <i>{item.id}</i>:{item.text_en}
                    </label>
                    <textarea className='form-control'
                        id={`input_item_${item.id}`}
                        rows='3' />
                    <small id={`help_item_${item.id}`}
                        className='form-text text-muted'>
                        {item.help_en}
                    </small>
                </div>
            );
        }
        if (item.widget_type === 'select') {
            return (
                <div className='form-group' key={item.id}>
                    <label htmlFor={`input_item_${item.id}`}>
                        <i>{item.id}</i>:{item.text_en}
                    </label>
                    <select className='form-control'>
                        {options[item.optionsets[0]].map((i) => {
                            return (<option key={i.id}>{i.text}</option>);
                        })}
                    </select>
                    <small id={`help_item_${item.id}`}
                        className='form-text text-muted'>
                        {item.help_en}
                    </small>
                </div>
            );
        }
        if (item.widget_type === 'radio') {
            // console.log('RADIO... work here');
            // console.log(item);
            // console.log(options[item.optionsets[0]]);
            return (
                <div className='form-group' key={item.id}>
                    <label htmlFor={`input_item_${item.id}`}>
                        <i>{item.id}</i>:{item.text_en}
                    </label>

                    {
                        options[item.optionsets[0]].map((i) => {
                            return (
                                <div className='form-check' key={i.id}>
                                    <input className='form-check-input'
                                        type='radio'
                                        name={`radio_name_${item.id}`}
                                        id={`radio_${item.id}_${i.id}`}
                                        value={i.text} />
                                    <label className='form-check-label'
                                        htmlFor={`radio_${item.id}_${i.id}`}>
                                        {i.text}
                                    </label>
                                </div>
                            );
                        })
                    }
                    <small id={`help_item_${item.id}`}
                        className='form-text text-muted'>
                        {item.help_en}
                    </small>
                </div>
            );
        }
        if (item.widget_type === 'checkbox') {
            // console.log('CHECKBOX... work here');
            // console.log(item);
            // console.log(options[item.optionsets[0]]);
            return (
                <div className='form-group' key={item.id}>

                    <label htmlFor={`input_item_${item.id}`}>
                        <i>{item.id}</i>:{item.text_en}
                    </label>
                    {
                        options[item.optionsets[0]].map((i) => {
                            return (
                                <div className='form-check' key={i.id}>
                                    <input className="form-check-input"
                                        type="checkbox"
                                        name={`checkbox_name_${item.id}`}
                                        value={i.text}
                                        id={`checkbox_${item.id}_${i.id}`} />
                                    <label className="form-check-label"
                                        htmlFor={`checkbox_${item.id}_${i.id}`}>
                                        {i.text}
                                    </label>
                                </div>
                            );
                        })
                    }
                    <small id={`help_item_${item.id}`}
                        className='form-text text-muted'>
                        {item.help_en}
                    </small>
                </div>
            );
        }
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
    }
    );
};

const iterateOptions = (options) => {
    const res = {};
    options.forEach((o) => {
        res[o[0].optionset] = o;
    });
    return res;
}
;

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {
    const rdmoContext = useContext(RdmoContext);
    const [processing, stage] = useDmptStart(rdmoContext);

    // console.log(`DmptStart. processing ${processing}`);
    const status = (
        <div>
            <h2><i>{stage}</i></h2>
        </div>
    );
    let formFields = <></>;
    if (!processing) {
        // console.log('no processing. proceed : ');
        console.log(rdmoContext.options_data);
        const opts = iterateOptions(rdmoContext.options_data);
        // rdmoContext.assignOptions(opts)
        formFields = iterateQuestions(rdmoContext.questions_data, opts);
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
