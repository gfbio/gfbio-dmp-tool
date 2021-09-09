import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import Questions from '../Questions';
import ActionButton from '../ActionButton';

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

            // FIXME: section for gfbio catalog id hardcoded
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

    console.log(`DmptStart. render ....`);

    const rdmoContext = useContext(RdmoContext);
    const [processing, stage] = useDmptStart(rdmoContext);

    const [nextText, setNextText] = useState('Next Section');
    const [prevText, setPrevText] = useState('Previous Section');

    const nextSectionHandler = () => {
        if (rdmoContext.sections_index < rdmoContext.sections_size - 1) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index + 1);
            setNextText('Next Section');
        }
        console.log('next ', rdmoContext.sections_index, ' ', (rdmoContext.sections_index + 1), ' ', rdmoContext.sections_size);
        if (rdmoContext.sections_index + 1 === rdmoContext.sections_size - 1) {
            setNextText('Finish');
        }
    };

    const prevSectionHandler = () => {
        if (rdmoContext.sections_index > 0) {
            rdmoContext.assingSectionsIndex(rdmoContext.sections_index - 1);
        }
        if (rdmoContext.sections_index <= rdmoContext.sections_size - 1) {
            setNextText('Next Section');
        }
    };

    console.log('context form data');
    console.log(rdmoContext.form_data);

    const handleFormChange = (e) => {
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
                [e.target.name]: e.target.value.trim()
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

        formFields = <Questions
            sectionIndex={rdmoContext.sections_index}
            handleFormChange={handleFormChange}
            nextSection={<ActionButton text={nextText}
                                       onClickHandler={nextSectionHandler} />}
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
