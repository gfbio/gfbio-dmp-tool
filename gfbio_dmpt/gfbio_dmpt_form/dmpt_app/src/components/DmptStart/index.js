import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import Questions from '../Questions';

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

                // console.log('------------  section response data   -------------');
                // console.log(sectionResponse.data);
                // console.log(sectionResponse.data.length);
                // console.log('---------------------------------------------------');

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

const nextSection = (context) => {
    console.log('next section ', context.sections_index, '  ', context.sections_size);
    if (context.sections_index < context.sections_size) {
        context.assingSectionsIndex(context.sections_index + 1);
    }
};

const prevSection = () => {
    console.log('prev section');
};

// eslint-disable-next-line no-unused-vars
function DmptStart(props) {

    // console.log(`DmptStart. render ....`);

    const rdmoContext = useContext(RdmoContext);
    const [processing, stage] = useDmptStart(rdmoContext);

    const status = (
        <div>
            <h2><i>{stage}</i></h2>
        </div>
    );
    let formFields = <></>;
    let sectionControls = <></>;
    if (!processing) {
        // console.log('no processing. proceed : ');
        formFields = <Questions
            section={rdmoContext.section_data[rdmoContext.sections_index]} />;
        sectionControls = (<div className='row'>
            <div className='col-6'>
                <button className='btn btn-primary'
                    onClick={prevSection}>Prev Section
                </button>
            </div>
            <div className='col-6'>
                <button className='btn btn-primary'
                    onClick={() => nextSection(rdmoContext)}>Next Section
                </button>
            </div>
        </div>);
    }
    return (
        <div>
            <h1 style={{ textTransform: 'uppercase' }}>DmptStart</h1>
            {status}
            {formFields}
            {sectionControls}
        </div>
    );
}

// TODO: housekeeping/delete strategy for unused/empty projects

export default DmptStart;
