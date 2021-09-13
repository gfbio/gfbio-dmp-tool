import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import Questions from '../Questions';
import ActionButton from '../ActionButton';

const createProject = async () => {
    try {
        // console.log('post project');
        // setProcessing(true);
        const response = await axios.post(
            `${API_ROOT}projects/projects/`,
            {
                'title': `tmp_${nanoid()}`,
                'description': `tmp_${nanoid()} temporary project`,
                'catalog': 18   // FIXME: gfbio catalog id hardcoded --> 18
                // "parent": "string"
            },
            {
                // token of super user (maweber)
                headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
            }
        );
        // console.log('response');
        // console.log(response.data);
        // setProjectResponse(response.data);
        return response;
    } catch (e) {
        console.error(e);
        return e;
    }
};

const postValue = (projectId, formItem) => {
    console.log('\tpost value');
    console.log(formItem);
    return axios.post(
        // `${API_ROOT}projects/projects/${projectId}/values/?attribute=${attributeId}`,
        `${API_ROOT}projects/projects/${projectId}/values/`,
        {
            'attribute': formItem.question.attribute,
            // 'set_index': 0,
            // 'collection_index': 0,
            'text': formItem.value,
            // 'option': 0,
            'value_type': formItem.question.value_type,
            'unit': formItem.question.unit
        },
        {
            // token of super user (maweber)
            headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
        }
    );
};

const postValues = async (projectId, formData) => {
    console.log('POST VALUES');
    try {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for(const f in formData) {
            const res = await postValue(projectId, formData[f]);
            console.log(res);
        }
    } catch (e) {
        console.error(e);
    } finally {
        ;
    }
    console.log('################################');
};

function useDmptStart(rdmoContext) {
    const [processing, setProcessing] = useState(true);
    const [stage, setStage] = useState('... starting ...');

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

            // FIXME: section for gfbio catalog id hardcoded --> 18
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
                rdmoContext.assingSectionsSize(sectionResponse.data.length);

                console.log('SECTIONS');
                console.log(sectionResponse.data);

                setStage('... DONE ...');
                setProcessing(false);
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

    // console.log(`DmptStart. render ....`);

    const rdmoContext = useContext(RdmoContext);
    const [processing, stage] = useDmptStart(rdmoContext);

    const [nextText, setNextText] = useState('Next Section');
    const [prevText, setPrevText] = useState('Previous Section');

    const [submitOnNext, setSubmitOnNext] = useState(false);

    const nextSectionHandler = () => {
        if (rdmoContext.sections_index < rdmoContext.sections_size - 1) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index + 1);
            setNextText('Next Section');
            setSubmitOnNext(false);
        }
        // console.log('next ', rdmoContext.sections_index, ' ', (rdmoContext.sections_index + 1), ' ', rdmoContext.sections_size);
        if (rdmoContext.sections_index + 1 === rdmoContext.sections_size - 1) {
            setNextText('Finish');
            setSubmitOnNext(true);
        }
    };

    const prevSectionHandler = () => {
        if (rdmoContext.sections_index > 0) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index - 1);
        }
        if (rdmoContext.sections_index <= rdmoContext.sections_size - 1) {
            setNextText('Next Section');
            setSubmitOnNext(false);
        }
    };

    const submitAllHandler = () => {
        console.log('submitAllHandler');
        console.log(rdmoContext.form_data);
        console.log('----------------------');
        console.log('CREATE PROJECT | project id in context ', rdmoContext.project_id);
        let projectId = rdmoContext.project_id;
        if (projectId < 0) {
            createProject().then((res) => {
                console.log('RES ...');
                console.log(res.data.id);
                projectId = res.data.id;
                rdmoContext.assignProjectId(projectId);
                // TODO: set project id, if available do not create a new one
                // TODO: post answers to project
                // TODO: redirect to rdmo overview

                // -------------------------------------------------------------
                postValues(projectId, rdmoContext.form_data).then((res) => {
                    console.log(res);
                }
                );
                // -------------------------------------------------------------

            });
        }
        console.log('after if pid ', projectId);
        console.log('----------------------');
    };

    // console.log('context form data');
    // console.log(rdmoContext.form_data);

    const handleFormChange = (e, item) => {
        // console.log('FORMCHANGE');
        // item['form_value'] = e.target.value.trim();

        // console.log(item);
        // console.log(e.target.value);
        // console.log('---------------------');
        // TODO: manually detect checkbox changes, maybe improve form field or refactor this ...
        // TODO: maybe refactor to list of values for specific question
        // eslint-disable-next-line no-prototype-builtins
        let formData = rdmoContext.form_data;
        if (e.target.name.startsWith('checkbox') && formData.hasOwnProperty(e.target.name)) {
            delete formData[e.target.name];
        } else {
            formData = ({
                ...formData,
                // Trimming any whitespace
                [e.target.name]: {
                    'value': e.target.value.trim(),
                    'question': item
                }
            });
        }
        rdmoContext.assignFormData(formData);
    };

    const status = (
        <div>
            <h2><i>{stage}</i></h2>
        </div>
    );
    let formFields = <></>;
    if (!processing) {

        const nextHandler = submitOnNext ? submitAllHandler : nextSectionHandler;

        formFields = <Questions
            sectionIndex={rdmoContext.sections_index}
            handleFormChange={handleFormChange}
            nextSection={<ActionButton text={nextText}
                onClickHandler={nextHandler} />}

            prevSection={<ActionButton text={prevText}
                onClickHandler={prevSectionHandler} />}
        />;

    }
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart</h1>
            {status}
            {formFields}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
