import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Sticky from 'react-stickynode';
import { SECTIONS_ROOT } from '../api/constants';
import DmptLoading from '../DmptLoading';
import DmptSection from '../DmptSection';
import useDmptSectionForm from '../DmptHooks/formHooks';
import SectionButtons from './sectionButtons';
import DmptSummary from '../DmptSummary';

const useDmptSectionNavigation = (catalogId, token) => {
    const [processing, setProcessing] = useState(true);
    const [sectionList, setSectionList] = useState([]);
    useEffect(() => {
        async function prepareDmptSectionList() {
            try {
                const result = await axios.get(
                    `${SECTIONS_ROOT}${catalogId}/`,
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
                setSectionList(result.data);
                setProcessing(false);
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptSectionList();
    }, []);
    return [processing, sectionList];
};

const fakeSubmit = () => {
    console.log('DmptSectionNavigation | fakeSubmit | inputs: ');
};

const sectionsAsListElements = (sectionList, sectionIndex, handleClick) => {
    const maxLength = 25;
    return sectionList.map((section, index) => {
        let { title } = section;
        if (title.length > maxLength) {
            title = `${section.title.substring(0, maxLength)}...`;
        }

        let link = (
            <button
                className="btn btn-link nav-link"
                type="button"
                onClick={() => handleClick(index)}
            >
                {`${index + 1}. ${title}`}
            </button>
        );
        if (index === sectionIndex) {
            link = (
                <button className="btn btn-link nav-link active" type="button">
                    {`${index + 1}. ${title}`}
                </button>
            );
        }
        return <li className="nav-item">{link}</li>;
    });
};

function DmptSectionNavigation(props) {
    const { catalogId, token, dmptProjectId } = props;

    const [processing, sectionList] = useDmptSectionNavigation(
        catalogId,
        token
    );
    const [sectionIndex, setSectionIndex] = useState(0);
    // const [rdmoProjectSubmitted, setRdmoProjectSubmitted] = useState(false);
    const [rdmoProjectId, setRdmoProjectId] = useState(-1);

    const {
        inputs,
        handleInputChange,
        handleSubmit,
        validationErrors,
        disabledNavigation,
    } = useDmptSectionForm(fakeSubmit);

    const sections = sectionsAsListElements(
        sectionList,
        sectionIndex,
        setSectionIndex
    );
    const sectionsLength = sectionList.length;

    console.log(
        `DmptSectionNavigation | useDmptSectionNavigation | processing: ${processing} | section list length: ${sectionsLength} | index: `,
        sectionIndex,
        ' | dmptProjectId: ',
        dmptProjectId
    );

    if (processing) {
        return <DmptLoading />;
    }

    // TODO: maybe add a dedicated loading animation for projectPosts if requests taka too long
    if (rdmoProjectId > 0) {
        return <DmptSummary rdmoProjectId={rdmoProjectId} />;
    }

    return (
        <div id="section-navigation">
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs sub-navi">{sections}</ul>
                </div>
            </div>

            <div className="row" id="section-wrapper-row">
                <div className="col-3 pt-2" id="section-sub-navi">
                    <Sticky top={80}>
                        {/* TODO: wrap sidebar and tabnavi+section in extra compoment if needed. */}
                        {/* TODO: put sidenavi action into comments, because Ivo doesn't like cool ideas ... */}
                        <div className="row">
                            {/* <div className="list-group list-group-flush"> */}
                            {/*     <button */}
                            {/*         type="button" */}
                            {/*         className="list-group-item list-group-item-action" */}
                            {/*     > */}
                            {/*         <h6 className="sidebar-list-item"> */}
                            {/*             <i className="mdi mdi-content-save-all-outline align-middle" /> */}
                            {/*             Save Project */}
                            {/*         </h6> */}
                            {/*     </button> */}
                            {/*     <button */}
                            {/*         type="button" */}
                            {/*         className="list-group-item list-group-item-action" */}
                            {/*     > */}
                            {/*         <h6 className="sidebar-list-item"> */}
                            {/*             <i className="mdi mdi-trash-can-outline align-middle" /> */}
                            {/*             Discard & Exit ? */}
                            {/*         </h6> */}
                            {/*     </button> */}
                            {/*     <button */}
                            {/*         type="button" */}
                            {/*         className="list-group-item list-group-item-action" */}
                            {/*     > */}
                            {/*         <h6 className="sidebar-list-item"> */}
                            {/*             <i className="mdi mdi-file-pdf-box align-middle" /> */}
                            {/*             Download PDF */}
                            {/*         </h6> */}
                            {/*     </button> */}
                            {/*     <button */}
                            {/*         type="button" */}
                            {/*         className="list-group-item list-group-item-action" */}
                            {/*     > */}
                            {/*         <h6 className="sidebar-list-item"> */}
                            {/*             <i className="mdi mdi-account-question-outline align-middle" /> */}
                            {/*             Request Support */}
                            {/*         </h6> */}
                            {/*     </button> */}
                            {/* </div> */}
                            {/* TODO: end of commented sidebar actions, do not remove. */}

                            <SectionButtons
                                sectionIndex={sectionIndex}
                                sectionsLength={sectionsLength}
                                setSectionIndex={setSectionIndex}
                                callBack={setRdmoProjectId}
                                token={token}
                                catalogId={catalogId}
                                inputs={inputs}
                                validationErrors={validationErrors}
                                disabled={disabledNavigation}
                            />
                        </div>
                    </Sticky>
                </div>

                <div className="col-9" id="section-content">
                    <div className="row">
                        <div className="col-12">
                            <DmptSection
                                token={token}
                                catalogId={catalogId}
                                sectionIndex={sectionIndex}
                                handleInputChange={handleInputChange}
                                handleSubmit={handleSubmit}
                                inputs={inputs}
                                validationErrors={validationErrors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <SectionButtons
                            sectionIndex={sectionIndex}
                            sectionsLength={sectionsLength}
                            setSectionIndex={setSectionIndex}
                            callBack={setRdmoProjectId}
                            token={token}
                            catalogId={catalogId}
                            inputs={inputs}
                            disabled={disabledNavigation}
                        />
                    </div>
                </div>
            </div>
            {/* end wrapper row */}
        </div>
    );
}

DmptSectionNavigation.defaultProps = {
    dmptProjectId: -1,
};

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    dmptProjectId: PropTypes.number,
};

export default DmptSectionNavigation;
