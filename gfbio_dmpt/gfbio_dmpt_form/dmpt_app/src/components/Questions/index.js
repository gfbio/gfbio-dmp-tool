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
const iterateQuestions = (questions, options) => {
    return questions.map((item) => {
        if (item.widget_type === 'textarea') {
            return (
                <FormTextArea item={item} />
            );
        }
        if (item.widget_type === 'select') {
            return (
                <FormSelect item={item} options={options} />
            );
        }
        if (item.widget_type === 'radio') {
            return (
                <FormRadio item={item} options={options} />
            );
        }
        if (item.widget_type === 'checkbox') {
            return (
                <FormCheckBox item={item} options={options} />
            );
        }
        return (
            <FormGenericInput item={item} />
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

    console.log('useQuestions section');
    console.log(sectionIndex);
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

// eslint-disable-next-line no-unused-vars
function Questions(props) {

    console.log('Questions. render ------------');
    const { sectionIndex } = props;
    const rdmoContext = useContext(RdmoContext);

    const [processing, stage] = useQuestions(rdmoContext, sectionIndex);
    console.log(processing);

    const status = (
        <div>
            <h4>Questions: <i>{stage}</i></h4>
        </div>
    );
    let formFields = <></>;
    if (!processing) {
        // console.log('no processing. proceed : ');
        // console.log(rdmoContext.questions_data);
        // console.log(rdmoContext.options_data);
        //     console.log('sectionIndex', rdmoContext.sections_index);
        const opts = iterateOptions(rdmoContext.options_data);

        // FIXME: no global options needed ?
        // rdmoContext.assignOptions(opts);

        formFields = iterateQuestions(rdmoContext.questions_data, opts);
    }
    return (
        <div>
            {status}
            <form>
                {formFields}
            </form>
        </div>
    );
}

Questions.propTypes = {
    sectionIndex: PropTypes.number.isRequired
};

export default Questions;
