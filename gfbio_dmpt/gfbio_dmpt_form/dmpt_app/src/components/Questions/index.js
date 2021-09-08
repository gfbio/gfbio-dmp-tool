import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import FormGenericInput from '../FormGenericInput';
import FormRadio from '../FormRadio';
import FormSelect from '../FormSelect';
import FormTextArea from '../FormTextArea';
import FormCheckBox from '../FormCheckBox';

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

// TODO: refactor to component
const iterateQuestions = (questions, options, formData, handleChange) => {

    return questions.map((item) => {
        console.log('map formdata');
        console.log(formData);
        console.log(item.key);
        // let initialValulue;
        // if (item.key in formData) {
        //     console.log('IFFF');
        //     initialValulue = formData[item.key];
        // }
        // console.log('initialValue: ', initialValulue);
        if (item.widget_type === 'textarea') {
            return (
                // <FormTextArea item={item} handleChange={handleChange} initialValue={initialValulue} />
                <FormTextArea item={item} handleChange={handleChange}  />
            );
        }
        if (item.widget_type === 'select') {
            return (
                <FormSelect item={item} options={options}
                    handleChange={handleChange} />
            );
        }
        if (item.widget_type === 'radio') {
            return (
                <FormRadio item={item} options={options}
                    handleChange={handleChange} />
            );
        }
        if (item.widget_type === 'checkbox') {
            return (
                <FormCheckBox item={item} options={options}
                    handleChange={handleChange} />
            );
        }
        return (
            <FormGenericInput item={item} handleChange={handleChange} />
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

// const handleChange = (e) => {
//     updateFormData({
//         ...formData,
//
//         // Trimming any whitespace
//         [e.target.name]: e.target.value.trim()
//     });
// };
//
// const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log(formData);
//     // ... submit to API or something
// };

function useQuestions(rdmoContext, sectionIndex, formData) {

    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

    // console.log('useQuestions section');
    // console.log(sectionIndex);
    const section = rdmoContext.section_data[sectionIndex];

    useEffect(() => {
        async function prepareQuestions() {
            console.log('PREPARE QUESTIONS use Effetct | deps is sectionIndex ... ');
            console.log(formData);
            setProcessing(true);
            // rdmoContext.assignFormData(formData);
            console.log(rdmoContext.form_data);
            try {
                setStage('... fetch questionsets ...');
                const qsResponse = await axios.get(
                    `${API_ROOT}questions/questionsets/?section=${section.id}`,
                    {
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );
                rdmoContext.assignQuestionSets(qsResponse.data);

                // console.log('------------  questionsets data   -------------');
                // console.log(qsResponse.data);
                // console.log('---------------------------------------------------');

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

        prepareQuestions();
    }, [sectionIndex]);
    return [processing, stage];
}

const nextSection = (context, formData) => {
    console.log('next section ', context.sections_index, '  ', context.sections_size);
    if (context.sections_index < context.sections_size - 1) {
        context.assingSectionsIndex(context.sections_index + 1);
    }
    context.assignFormData(formData);
};

const prevSection = (context, formData) => {
    console.log('prev section ', context.sections_index, '  ', context.sections_size);
    if (context.sections_index > 0) {
        context.assingSectionsIndex(context.sections_index - 1);
    }
    context.assignFormData(formData);
};

// eslint-disable-next-line no-unused-vars
function Questions(props) {

    // console.log('Questions. render ------------');
    const { sectionIndex } = props;
    const rdmoContext = useContext(RdmoContext);

    const [formData, updateFormData] = React.useState({});

    const [processing, stage] = useQuestions(rdmoContext, sectionIndex, formData);
    // console.log(processing);

    const handleChange = (e) => {
        // console.log('CHANGE');
        // console.log(formData);
        // console.log(e.target.name);
        // console.log(e.target.value);

        // TODO: manually detect checkbox changes, maybe improve form field or refactor this ...
        // TODO: maybe refactor to list of values for specific question
        // eslint-disable-next-line no-prototype-builtins
        if (e.target.name.startsWith('checkbox') && formData.hasOwnProperty(e.target.name)) {
            // console.log('checkbox key already there');
            delete formData[e.target.name];
            // console.log(formData);
            updateFormData(formData);
            // rdmoContext.assignFormData(formData);
        } else {
            updateFormData({
                ...formData,

                // Trimming any whitespace
                [e.target.name]: e.target.value.trim()
            });
            // rdmoContext.assignFormData({
            //     ...formData,
            //
            //     // Trimming any whitespace
            //     [e.target.name]: e.target.value.trim()
            // });
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // console.log('SUBMIT');
    //     // console.log(formData);
    //     // ... submit to API or something
    // };

    const status = (
        <div>
            <h4>Questions: <i>{stage}</i></h4>
        </div>
    );
    let formFields = <></>;
    let sectionControls = <></>;
    if (!processing) {
        // console.log('no processing. proceed : ');
        // console.log(rdmoContext.questions_data);
        // console.log(rdmoContext.options_data);
        //     console.log('sectionIndex', rdmoContext.sections_index);
        const opts = iterateOptions(rdmoContext.options_data);

        // FIXME: no global options needed ?
        // rdmoContext.assignOptions(opts);

        formFields = iterateQuestions(rdmoContext.questions_data, opts, rdmoContext.form_data, handleChange);
        sectionControls = (<div className='row'>
            <div className='col-6'>
                <button className='btn btn-primary'
                    onClick={() => prevSection(rdmoContext, formData)}>Prev
                    Section
                </button>
            </div>
            <div className='col-6'>
                <button type='submit' className='btn btn-primary'
                    onClick={() => nextSection(rdmoContext, formData)}>Next
                    Section
                </button>
            </div>
        </div>);
    }
    return (
        <div>
            {status}
            <form id={`section_${rdmoContext.sections_index}`}>
                {formFields}
            </form>
            {sectionControls}
            {/* <button onClick={handleSubmit}>Submit</button> */}
        </div>
    );
}

Questions.propTypes = {
    sectionIndex: PropTypes.number.isRequired
};

export default Questions;
