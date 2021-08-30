import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FormCheck, FormText } from 'react-bootstrap';
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
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
