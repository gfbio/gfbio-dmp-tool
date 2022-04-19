import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Col, Row} from 'react-bootstrap';
import {SolarSystemLoading} from 'react-loadingg';
import {API_ROOT} from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import FormGenericInput from '../FormGenericInput';
import FormRadio from '../FormRadio';
import FormSelect from '../FormSelect';
import FormTextArea from '../FormTextArea';
import FormCheckBox from '../FormCheckBox';
import ScrollToTop from '../ScrollToTop';

const fetchQuestion = async (q, token) => {
    return await axios.get(
        `${API_ROOT}questions/questions/?questionset=${q.id}`,
        {
            headers: {'Authorization': `Token ${token}`}
        }
    );
};

const fetchQuestions = async (qsResponse, token) => {
    return Promise.all(qsResponse.data.map((qs) => fetchQuestion(qs, token)));
};

const fetchOptions = async (optionSet, token) => {
    return await axios.get(
        `${API_ROOT}options/options/?optionset=${optionSet}`,
        {
            headers: {'Authorization': `Token ${token}`}
        }
    );

};

const fetchProjectValues = async (projectId, token) => {
    // console.log('fetch project values ', projectId);
    // console.log(`${API_ROOT}projects/values/?project=${projectId}`);
    return await axios.get(
        `${API_ROOT}projects/values/?project=${projectId}`,
        {
            headers: {'Authorization': `Token ${token}`}
        }
    );
};

const fetchAllOptions = async (optionSets, token) => {
    return Promise.all(optionSets.map((o) => fetchOptions(o, token)));
};

// TODO: refactor to component
// const iterateQuestions = (questions, options, values, handleChange) => {
const iterateQuestions = (questions, options, values, handleChange) => {
    // console.log('iterateQuestions values ', values);
    return questions.map((item) => {
        let valueList = [];
        if (values[item.attribute] !== undefined) {
            valueList = values[item.attribute];
        }
        if (item.widget_type === 'textarea') {
            // TODO: refactor
            let val = '';
            if(valueList.length === 1) {
                [val] = valueList;
            }
            return (
                <FormTextArea item={item} value={val}
                    handleChange={handleChange}/>
            );
        }
        if (item.widget_type === 'select') {
            // TODO: refactor
            let val = '';
            if(valueList.length === 1) {
                [val] = valueList;
            }
            return (
                <FormSelect item={item} options={options} value={val}
                    handleChange={handleChange}/>
            );
        }
        if (item.widget_type === 'radio') {
            // TODO: first option hardcoded, move to top for all when done here
            const opts = options[item.optionsets[0]];
            // console.log('\n\tQuestions | iterateQuestions | radio | opts ', opts);
            let val = '';
            if(valueList.length === 1) {
                [val] = valueList;
            }
            return (
                <FormRadio item={item} options={opts} value={val}
                    handleChange={handleChange}/>
            );
        }
        if (item.widget_type === 'checkbox') {
            // console.log('\n-----------\nQuestions | iterate questions | checkbox ');
            // TODO: first option hardcoded, move to top for all when done here
            const opts = options[item.optionsets[0]];
            // console.log('\n\tQuestions | iterateQuestions | checkbox | opts ', opts);
            return (
                <FormCheckBox item={item} options={opts} value={valueList}
                    handleChange={handleChange}/>
            );
        }
        return (
            <FormGenericInput item={item} value={valueList}
                handleChange={handleChange}/>
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
                        headers: {'Authorization': `Token ${token}`}
                    }
                );

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
                    rdmoContext.assignQuestions(tmp);

                    setStage('... fetch options ...');
                    fetchAllOptions(oSets, token).then((oRes) => {
                        oRes.forEach((o) => {
                            options.push(o.data);
                        });
                        rdmoContext.assignOptions(options);

                        setStage('... DONE ...');
                        setProcessing(false);
                    });
                }).then(() => {
                    // console.log('useQuestions after getting all | get values before if ', );
                    if (rdmoContext.backend_context.isLoggedIn !== 'false' && rdmoContext.project_id && rdmoContext.project_id > 0) {
                        // console.log('useQuestions after getting all | get values IN if');
                        setStage('... fetch project value  ...', rdmoContext.project_id);
                        // rdmoContext.assignFormData({});
                        const projectValues = {};
                        fetchProjectValues(rdmoContext.project_id, token).then((pRes) => {
                            // console.log('fetchProjectValues response ', pRes);
                            pRes.data.forEach((v) => {
                                // console.log('\tres item attrib. ', v.attribute, ' | res item ', v);
                                if (projectValues[v.attribute]) {
                                    // console.log('push to ', v.attribute, ' | ', v);
                                    projectValues[v.attribute].push(v);
                                } else {
                                    // Old assignment
                                    // projectValues[v.attribute] = v;

                                    // console.log('set to ', v.attribute, ' | ', [v]);
                                    projectValues[v.attribute] = [v];
                                }
                            });
                            console.log('useQuestions after getting all | project values ', projectValues);
                            rdmoContext.assignProjectValues(projectValues);
                            rdmoContext.assignFormData({});
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

    const {
        sectionIndex,
        handleInputChange,
        handleSubmit,
        nextSection,
        prevSection,
        userToken
    } = props;
    const rdmoContext = useContext(RdmoContext);

    // console.log('\nQuestions ', rdmoContext);

    const [processing, stage] = useQuestions(rdmoContext, sectionIndex, userToken);

    let formFields = <></>;
    let sectionControls = <></>;
    if (!processing) {

        const opts = iterateOptions(rdmoContext.options_data);
        formFields = iterateQuestions(rdmoContext.questions_data, opts, rdmoContext.project_values, handleInputChange);
        sectionControls = (<div className="row">
            {prevSection}
            {nextSection}
        </div>);
    }

    if (processing) {
        return (
            <div>
                <ScrollToTop/>
                <Row>
                    <Col lg={12}>
                        <SolarSystemLoading color="#81B248" size="large"
                            speed={8}>Loading</SolarSystemLoading>
                    </Col>
                </Row>
            </div>
        );
    }
    return (
        <div>
            <ScrollToTop/>
            <form id={`section_${rdmoContext.sections_index}`} onSubmit={handleSubmit}>
                {formFields}
                {sectionControls}
            </form>
        </div>
    );
}

Questions.propTypes = {
    sectionIndex: PropTypes.number.isRequired,

    // TODO: inputs for new changehandler
    // TODO: better validator/proptype
    // eslint-disable-next-line react/forbid-prop-types
    // inputs: PropTypes.object.isRequired,

    // TODO: maybe obsolete
    // handleFormChange: PropTypes.func.isRequired,

    // TODO: maybe the new form change handler
    handleInputChange: PropTypes.func.isRequired,

    // TODO: maybe new for checking form and handling navigation to next
    //  or previous section
    handleSubmit: PropTypes.func.isRequired,

    nextSection: PropTypes.element.isRequired,
    prevSection: PropTypes.element.isRequired,

    userToken: PropTypes.string.isRequired
};

export default Questions;
