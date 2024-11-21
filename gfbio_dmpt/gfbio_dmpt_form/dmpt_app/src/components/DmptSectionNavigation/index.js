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
import { getCookie, setCookie } from '../api/cookie';
import availableLanguages from '../DmptLanguageChooser/availableLanguages';

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
                            Authorization: `Token ${token}`
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
    }, [language]);  // though language is not used directly, a change there means a change in cookies the request uses.
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

const mandatoryValidationErrorsAsList = (mandatoryFieldErrors, sectionList, setSectionIndex) => {
    let validation = <></>;
    const validationElements = Object.values(mandatoryFieldErrors).map((mandatoryQuestion) => {
        const sectionIndex = sectionList.findIndex(
            (section) => section.title === mandatoryQuestion.section_name
        );

        return (
            <li key={mandatoryQuestion.id}>
                {mandatoryQuestion.text} (in&nbsp;
                <button
                    type="button"
                    className="btn btn-link inline-button"
                    onClick={() => setSectionIndex(sectionIndex)}
                >
                    {mandatoryQuestion.section_name}
                </button>
                )
            </li>
        );
    });
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

const renderMandatorySectionLinks = (mandatoryFieldErrors, sectionList, setSectionIndex) => {
    return Object.values(mandatoryFieldErrors).map((mandatoryQuestion, index, array) => {
        const sectionIndex = sectionList.findIndex(
            (section) => section.title === mandatoryQuestion.section_name
        );

        return (
            <span key={mandatoryQuestion.id}>
                <button
                    type="button"
                    className="btn btn-link inline-button"
                    onClick={() => setSectionIndex(sectionIndex)}
                >
                    {mandatoryQuestion.section_name}
                </button>
                {index < array.length - 1 && ', '}
            </span>
        );
    });
};

function DmptSectionNavigation(props) {
    const { catalogId, token, dmptProjectData } = props;
    const dmptProjectId = dmptProjectData.id;

    const [language, setLanguage] = useState(availableLanguages.english);
    const setLanguageCookie = function(newLanguage) {
        if (newLanguage.shortCode !== getCookie("django_language")) {
            setCookie("django_language", newLanguage.shortCode);
        }
    };
    const setLanguageAndCookie = function(newLanguage) {
        setLanguageCookie(newLanguage);
        setLanguage(newLanguage);
    };
    setLanguageCookie(language);

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
        mandatoryValidationErrors,
        sectionList,
        setSectionIndex
    );

    const sectionsLength = sectionList.length;

    if (processing) {
        return <DmptLoading />;
    }

    if (rdmoProjectId > 0) {
        return (
            <>
                <DmptLanguageChooser
                    language={language}
                    setLanguage={setLanguageAndCookie}
                />
                <DmptSummary
                    rdmoProjectId={rdmoProjectId}
                    dmptProjectId={dmptProjectId}
                    resetRdmoProjectId={setRdmoProjectId}
                    issueKey={dmptProjectData.issue}
                />
            </>
        );
    }

    return (
        <div id="section-navigation">
            <DmptLanguageChooser
                language={language}
                setLanguage={setLanguageAndCookie}
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
            <div className="row text-end">
                {Object.keys(mandatoryValidationErrors).length > 0 && (
                    <h5 className="mandatory">
                        Please correct the errors in the sections:&nbsp;
                        {renderMandatorySectionLinks(
                            mandatoryValidationErrors, sectionList,
                            setSectionIndex)}
                    </h5>
                )}
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
