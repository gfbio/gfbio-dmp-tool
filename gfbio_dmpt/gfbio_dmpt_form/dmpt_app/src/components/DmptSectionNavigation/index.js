import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Sticky from 'react-stickynode';
import { SECTIONS_ROOT } from '../../constants/api/api_constants';
import DmptLoading from '../DmptLoading';
import DmptSection from '../DmptSection';
import useDmptSectionForm from '../DmptHooks/formHooks';
import postProject from '../api/formdata';

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

const submitHandler = (token, catalogId, inputs) => {
    console.log('submitHandler | inputs ', inputs);
    console.log('submitHandler | post ..... ');
    postProject(token, catalogId, inputs).then((res) => {
        console.log('submitHandler | post res:  ', res);
    });
};

const continueHandler = (val, maxVal, valHandler) => {
    if (val < maxVal - 1) {
        valHandler(val + 1);
    }
};

const backHandler = (val, valHandler) => {
    if (val - 1 >= 0) {
        valHandler(val - 1);
    }
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
    const { catalogId, token } = props;

    const [processing, sectionList] = useDmptSectionNavigation(
        catalogId,
        token
    );
    const [sectionIndex, setSectionIndex] = useState(0);

    const { inputs, handleInputChange, handleSubmit } =
        useDmptSectionForm(fakeSubmit);

    const sections = sectionsAsListElements(
        sectionList,
        sectionIndex,
        setSectionIndex
    );
    const sectionsLength = sectionList.length;

    // console.log(`DmptSectionNavigation | useDmptSectionNavigation | processing: ${processing} | section list length: ${sectionsLength} | index: `, sectionIndex);

    let continueButton = (
        <button
            type="button"
            className="list-group-item list-group-item-action text-end"
            onClick={() =>
                continueHandler(sectionIndex, sectionsLength, setSectionIndex)
            }
        >
            <h6 className="sidebar-list-item">
                <i className="mdi mdi-chevron-double-right align-middle right" />
                <br /> Next Section
            </h6>
        </button>
    );
    if (sectionIndex === sectionsLength - 1) {
        continueButton = (
            <button
                type="button"
                className="list-group-item list-group-item-action text-end"
                onClick={() => submitHandler(token, catalogId, inputs)}
            >
                <h6 className="sidebar-list-item">
                    <i className="mdi mdi-chevron-double-right align-middle right" />
                    <br /> Submit Plan
                </h6>
            </button>
        );
    }

    if (processing) {
        return <DmptLoading />;
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

                            <div className="list-group list-group-flush list-group-horizontal mt-5">
                                <button
                                    type="button"
                                    className="list-group-item list-group-item-action text-start"
                                    onClick={() =>
                                        backHandler(
                                            sectionIndex,
                                            setSectionIndex
                                        )
                                    }
                                >
                                    <h6 className="sidebar-list-item">
                                        <i className="mdi mdi-chevron-double-left align-middle" />
                                        <br />
                                        Previous Section
                                    </h6>
                                </button>
                                {continueButton}
                            </div>
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
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="list-group list-group-flush list-group-horizontal mt-5">
                            <button
                                type="button"
                                className="list-group-item list-group-item-action text-start"
                                onClick={() =>
                                    backHandler(sectionIndex, setSectionIndex)
                                }
                            >
                                <h6 className="sidebar-list-item">
                                    <i className="mdi mdi-chevron-double-left align-middle" />
                                    <br />
                                    Previous Section
                                </h6>
                            </button>
                            {continueButton}
                        </div>
                    </div>
                </div>
            </div>
            {/* end wrapper row */}
        </div>
    );
}

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
};

export default DmptSectionNavigation;
