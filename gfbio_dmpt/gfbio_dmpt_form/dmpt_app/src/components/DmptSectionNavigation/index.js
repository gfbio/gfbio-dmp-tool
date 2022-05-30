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
    const [mandatoryFields, setMandatoryFields] = useState([]);
    useEffect(() => {
        async function prepareDmptSectionList() {
            setProcessing(true);
            try {
                const result = await axios.get(
                    `${SECTIONS_ROOT}${catalogId}/`,
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
                setSectionList(result.data.sections);
                setMandatoryFields(result.data.mandatory_fields);
                setProcessing(false);
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptSectionList();
    }, []);
    return [processing, sectionList, mandatoryFields];
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

const mandatoryValidationErrorsAsList = (mandatoryFieldErrors) => {
    console.log(
        'DmptSectionNavigation | mandatoryValidationErrorsAsList | ',
        mandatoryFieldErrors
    );
    let validation = <h2>validation here ?</h2>;
    const validationElements = Object.values(mandatoryFieldErrors).map(
        (mandatoryQuestion) => {
            // ObjectmandatoryFieldErrors.map((fieldError)=>{
            //     console.log('DmptSectionNavigation | mandatoryValidationErrorsAsList | map | mandatoryQuestion ', mandatoryQuestion);
            return <li>{mandatoryQuestion.text}</li>;
        }
    );
    console.log(
        'DmptSectionNavigation | mandatoryValidationErrorsAsList | validationElements ',
        validationElements.length
    );
    if (validationElements.length > 0) {
        validation = (
            <div className="row">
                <div className="col-12">
                    <h5>Mandatory Field Errors</h5>
                    <ul>{validationElements}</ul>
                </div>
            </div>
        );
    }
    return validation;
};

function DmptSectionNavigation(props) {
    const { catalogId, token, dmptProjectData } = props;
    const dmptProjectId = dmptProjectData.id;

    const [processing, sectionList, mandatoryFields] = useDmptSectionNavigation(
        catalogId,
        token
    );
    const [sectionIndex, setSectionIndex] = useState(0);
    const [rdmoProjectId, setRdmoProjectId] = useState(-1);
    const [mandatoryValidationErrors, setMandatoryValidationErrors] = useState(
        {}
    );

    const {
        inputs,
        handleInputChange,
        handleSubmit,
        validationErrors,
        disabledNavigation,
    } = useDmptSectionForm(fakeSubmit, dmptProjectData.form_data);

    const sections = sectionsAsListElements(
        sectionList,
        sectionIndex,
        setSectionIndex
    );

    const mandatoryValidation = mandatoryValidationErrorsAsList(
        mandatoryValidationErrors
    );

    const sectionsLength = sectionList.length;

    // console.log(
    //     `DmptSectionNavigation | useDmptSectionNavigation | processing: ${processing} | section list length: ${sectionsLength} | index: `,
    //     sectionIndex,
    //     '| dmptProjectId ',
    //     dmptProjectId,
    //     ' | dmptProjectData: ',
    //     dmptProjectData
    // );
    // console.log('DmptSectionNavigation | useDmptSectionNavigation | mandatoryFields ', mandatoryFields);

    if (processing) {
        return <DmptLoading />;
    }

    // TODO: maybe add a dedicated loading animation for projectPosts if requests taka too long
    if (rdmoProjectId > 0) {
        return (
            <DmptSummary
                rdmoProjectId={rdmoProjectId}
                dmptProjectId={dmptProjectId}
            />
        );
    }

    return (
        <div id="section-navigation">
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs sub-navi">{sections}</ul>
                </div>
            </div>

            {/* <div className="row"> */}
            {/*     <div className="col-12"> */}
            {/*         <h4>Mandatory Field Errors</h4> */}
            {mandatoryValidation}
            {/* </div> */}
            {/* </div> */}

            <div className="row" id="section-wrapper-row">
                <div className="col-3 pt-2" id="section-sub-navi">
                    <Sticky top={80}>
                        <div className="row">
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
                                dmptProjectId={dmptProjectId}
                                mandatoryFields={mandatoryFields}
                                setMandatoryErrors={
                                    setMandatoryValidationErrors
                                }
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
                            dmptProjectId={dmptProjectId}
                            mandatoryFields={mandatoryFields}
                            setMandatoryErrors={setMandatoryValidationErrors}
                        />
                    </div>
                </div>
            </div>
            {/* end wrapper row */}
        </div>
    );
}

DmptSectionNavigation.defaultProps = {
    dmptProjectData: { form_data: {}, id: -1 },
};

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    dmptProjectData: PropTypes.shape({
        form_data: PropTypes.shape({}),
        id: PropTypes.number,
    }),
};

export default DmptSectionNavigation;
