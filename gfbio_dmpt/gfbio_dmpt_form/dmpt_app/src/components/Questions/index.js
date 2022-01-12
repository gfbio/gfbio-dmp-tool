import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { SolarSystemLoading } from 'react-loadingg';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import FormGenericInput from '../FormGenericInput';
import FormRadio from '../FormRadio';
import FormSelect from '../FormSelect';
import FormTextArea from '../FormTextArea';
import FormCheckBox from '../FormCheckBox';

const fetchQuestion = async (q, token) => {
    return await axios.get(
        `${API_ROOT}questions/questions/?questionset=${q.id}`,
        {
            headers: { 'Authorization': `Token ${token}` }
        }
    );
};

const fetchQuestions = async (qsResponse, token) => {
    // FIXME: await ?
    return Promise.all(qsResponse.data.map((qs) => fetchQuestion(qs, token)));
};

const fetchOptions = async (optionSet, token) => {
    return await axios.get(
        `${API_ROOT}options/options/?optionset=${optionSet}`,
        {
            headers: { 'Authorization': `Token ${token}` }
        }
    );

};

const fetchProjectValues = async (projectId, token) => {
    return await axios.get(
        `${API_ROOT}projects/values/?project=${projectId}`,
        {
            headers: { 'Authorization': `Token ${token}` }
        }
    );
};

const fetchAllOptions = async (optionSets, token) => {
    // FIXME: await ?
    return Promise.all(optionSets.map((o) => fetchOptions(o, token)));
};

// TODO: refactor to component
const iterateQuestions = (questions, options, values, handleChange) => {
    // console.log('ITERATE QUESTIONS ');
    // console.log('Values');
    // console.log(values);
    return questions.map((item) => {
        // console.log('item ', item.attribute);
        // console.log(values[item.attribute]);
        let value = '';
        if (values[item.attribute] !== undefined) {
            value = values[item.attribute];
        }
        // console.log(' --- value: ', value);

        if (item.widget_type === 'textarea') {
            return (
                <FormTextArea item={item} value={value}
                    handleChange={handleChange} />
            );
        }
        if (item.widget_type === 'select') {
            return (
                <FormSelect item={item} options={options} value={value}
                    handleChange={handleChange} />
            );
        }
        if (item.widget_type === 'radio') {
            return (
                <FormRadio item={item} options={options} value={value}
                    handleChange={handleChange} />
            );
        }
        if (item.widget_type === 'checkbox') {
            return (
                <FormCheckBox item={item} options={options} value={value}
                    handleChange={handleChange} />
            );
        }
        return (
            <FormGenericInput item={item} value={value}
                handleChange={handleChange} />
        );

    }
    );
};

// TODO: refactor to component
const iterateOptions = (options) => {
    const res = {};
    options.forEach((o) => {
        res[o[0].optionset] = o;
    });
    return res;
};

function useQuestions(rdmoContext, sectionIndex, token) {

    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    const section = rdmoContext.section_data[sectionIndex];

    useEffect(() => {
        async function prepareQuestions() {
            setProcessing(true);
            try {
                setStage('... fetch questionsets ...');
                const qsResponse = await axios.get(
                    `${API_ROOT}questions/questionsets/?section=${section.id}`,
                    {
                        headers: { 'Authorization': `Token ${token}` }
                    }
                );

                // console.log('QUESTION_SETS');
                // console.log(qsResponse.data);

                setStage('... fetch questions ...');
                fetchQuestions(qsResponse, token).then((res) => {
                    const tmp = [];
                    const oSets = [];
                    const options = [];
                    res.forEach((item) => {
                        item.data.forEach((q) => {
                            if (q.optionsets.length > 0) {
                                q.optionsets.forEach((oSet) => {
                                    oSets.push(oSet);
                                });
                            }
                            tmp.push(q);
                        });
                    });
                    // TODO: this is needed in context !
                    rdmoContext.assignQuestions(tmp);

                    // console.log('QUESTIONS (processed)');
                    // console.log(tmp);

                    setStage('... fetch options ...');
                    fetchAllOptions(oSets, token).then((oRes) => {
                        oRes.forEach((o) => {
                            options.push(o.data);
                        });
                        // TODO: this is needed in context !
                        rdmoContext.assignOptions(options);

                        // console.log('OPTIONS (processed)');
                        // console.log(options);

                        setStage('... DONE ...');
                        setProcessing(false);
                    });
                }).then(() => {
                    if (rdmoContext.project_id && rdmoContext.project_id > 0) {
                        setStage('... fetch project value  ...', rdmoContext.project_id);
                        const projectValues = {};
                        fetchProjectValues(rdmoContext.project_id, token).then((pRes) => {
                            // console.log('project values response');
                            // console.log(pRes.data);

                            pRes.data.forEach((v) => {
                                projectValues[v.attribute] = v;
                            });
                            rdmoContext.assignProjectValues(projectValues);
                        });
                    }
                });

            } catch (e) {
                console.error(e);
            } finally {
                ;
            }
        }

        prepareQuestions();
    }, [sectionIndex]);
    return [processing, stage];
}

// eslint-disable-next-line no-unused-vars
function Questions(props) {

    // console.log('Questions. render ------------');
    const {
        sectionIndex,
        handleFormChange,
        nextSection,
        prevSection,
        userToken
    } = props;
    const rdmoContext = useContext(RdmoContext);

    const [processing, stage] = useQuestions(rdmoContext, sectionIndex, userToken);

    const status = (
        <div>
            <h4>Questions: <i>{stage}</i></h4>
        </div>
    );
    let formFields = <></>;
    let sectionControls = <></>;
    if (!processing) {

        // if (rdmoContext.project_id && rdmoContext.project_id > 0) {
        //     fetchProjectValues(rdmoContext.project_id, userToken).then((pRes)=>{
        //         console.log('project values response');
        //         console.log(pRes.data);
        //         console.log('questions from context');
        //         console.log(rdmoContext.questions_data);
        //         console.log('formdata in context ');
        //         console.log(rdmoContext.form_data);
        //     });
        // }

        const opts = iterateOptions(rdmoContext.options_data);
        formFields = iterateQuestions(rdmoContext.questions_data, opts, rdmoContext.project_values, handleFormChange);
        sectionControls = (<div className='row'>
            {prevSection}
            {nextSection}
            {/* <div className='col-6'> */}
            {/*    <button className='btn btn-primary' */}
            {/*        onClick={() => prevSection(rdmoContext)}>Prev */}
            {/*        Section */}
            {/*    </button> */}
            {/* </div> */}
            {/* <div className='col-6'> */}
            {/*    <button type='submit' className='btn btn-primary' */}
            {/*        onClick={() => nextSection(rdmoContext)}> Next Section */}
            {/*    </button> */}
            {/* </div> */}
        </div>);
    }

    if (processing) {
        return (
            <div>
                <Row>
                    <Col lg={12}>
                        <SolarSystemLoading color='#81B248' size='large'
                            speed={8}>Loading</SolarSystemLoading>
                    </Col>
                </Row>
            </div>
        );
    }
    return (
        <div>
            <form id={`section_${rdmoContext.sections_index}`}>
                {formFields}
            </form>
            {sectionControls}
        </div>
    );
}

Questions.propTypes = {
    sectionIndex: PropTypes.number.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    nextSection: PropTypes.element.isRequired,
    prevSection: PropTypes.element.isRequired,
    userToken: PropTypes.string.isRequired
};

export default Questions;
