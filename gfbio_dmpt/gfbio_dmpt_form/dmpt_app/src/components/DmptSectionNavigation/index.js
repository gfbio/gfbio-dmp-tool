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
import DmptLanguageChooser from '../DmptLanguageChooser';

const useDmptSectionNavigation = (catalogId, token, setSectionList, setMandatoryFields, language) => {
    const [processing, setProcessing] = useState(true);
    useEffect(() => {
        async function prepareDmptSectionList() {
            setProcessing(true);
            try {
                const result = await axios.get(
                    `${SECTIONS_ROOT}${catalogId}/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                            "Accept-Language": `${language.acceptLanguageString}`
                        },
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
    }, [language]);
    return [processing];
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
    let validation = <></>;
    const validationElements = Object.values(mandatoryFieldErrors).map(
        (mandatoryQuestion) => {
            return (
                <li>
                    {mandatoryQuestion.text} (in &quot;
                    {mandatoryQuestion.section_name}&quot;)
                </li>
            );
        }
    );
    if (validationElements.length > 0) {
        validation = (
            <div className="row">
                <div className="col-12">
                    <h5 className="mandatory">Mandatory fields missing</h5>
                    <p>
                        The following form fields are mandatory and are required
                        to proceed in submitting your data management plan
                    </p>
                    <ul className="list-group-numbered list-unstyled mandatory">
                        {validationElements}
                    </ul>
                    <p>Please fill the required fields and submit again</p>
                </div>
            </div>
        );
    }
    return validation;
};

function DmptSectionNavigation(props) {
    const { catalogId, token, dmptProjectData } = props;
    const dmptProjectId = dmptProjectData.id;

    const [language, setLanguage] = useState({
        name: "english",
        shortCode: "EN",
        acceptLanguageString: "en-US; en; q=0.9"
    });

    const [sectionList, setSectionList] = useState([]);
    const [mandatoryFields, setMandatoryFields] = useState([]);
    const [processing] = useDmptSectionNavigation(
        catalogId,
        token,
        setSectionList,
        setMandatoryFields,
        language
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

    const [sections, setSections] = useState([]);
    useEffect(() => {
        var elements = sectionsAsListElements(
            sectionList,
            sectionIndex,
            setSectionIndex
        );
        setSections(elements);
    }, [sectionList, sectionIndex]);

    const mandatoryValidation = mandatoryValidationErrorsAsList(
        mandatoryValidationErrors
    );

    const sectionsLength = sectionList.length;

    if (processing) {
        return <DmptLoading />;
    }

    if (rdmoProjectId > 0) {
        return (
            <DmptSummary
                rdmoProjectId={rdmoProjectId}
                dmptProjectId={dmptProjectId}
                resetRdmoProjectId={setRdmoProjectId}
                issueKey={dmptProjectData.issue}
            />
        );
    }

    return (
        <div id="section-navigation">
            <DmptLanguageChooser
                language={language}
                setLanguage={setLanguage}
            />
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs sub-navi">{sections}</ul>
                </div>
            </div>
            <div className="row" id="section-content">
                {mandatoryValidation}
                    <DmptSection
                        token={token}
                        catalogId={catalogId}
                        sectionIndex={sectionIndex}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        inputs={inputs}
                        validationErrors={validationErrors}
                        language={language}
                    />
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
    );
}

DmptSectionNavigation.defaultProps = {
    dmptProjectData: { form_data: {}, id: -1, issue: '' },
};

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    dmptProjectData: PropTypes.shape({
        form_data: PropTypes.shape({}),
        id: PropTypes.number,
        issue: PropTypes.string,
    }),
};

export default DmptSectionNavigation;
