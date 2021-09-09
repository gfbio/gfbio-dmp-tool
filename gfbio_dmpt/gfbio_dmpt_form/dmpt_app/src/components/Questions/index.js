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
const iterateQuestions = (questions, options, handleChange) => {

    return questions.map((item) => {
        if (item.widget_type === 'textarea') {
            return (
                <FormTextArea item={item} handleChange={handleChange} />
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

function useQuestions(rdmoContext, sectionIndex) {

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
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
                    }
                );

                setStage('... fetch questions ...');
                fetchQuestions(qsResponse).then((res) => {
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
                    setStage('... fetch options ...');
                    fetchAllOptions(oSets).then((oRes) => {
                        oRes.forEach((o) => {
                            options.push(o.data);
                        });
                        // TODO: this is needed in context !
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

// eslint-disable-next-line no-unused-vars
function Questions(props) {

    console.log('Questions. render ------------');
    const { sectionIndex, handleFormChange, nextSection, prevSection } = props;
    const rdmoContext = useContext(RdmoContext);

    const [processing, stage] = useQuestions(rdmoContext, sectionIndex);

    const status = (
        <div>
            <h4>Questions: <i>{stage}</i></h4>
        </div>
    );
    let formFields = <></>;
    let sectionControls = <></>;
    if (!processing) {
        const opts = iterateOptions(rdmoContext.options_data);
        formFields = iterateQuestions(rdmoContext.questions_data, opts, handleFormChange);
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
    return (
        <div>
            {status}
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
    prevSection: PropTypes.element.isRequired
};

export default Questions;
