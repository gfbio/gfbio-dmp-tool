import React from 'react';
import PropTypes from 'prop-types';
import postProject, { putProject } from '../api/formdata';

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

const checkMandatoryFields = (mandatoryFields, inputs, setMandatoryErrors) => {
    const mandatoryFieldsErrors = {};
    Object.entries(mandatoryFields).forEach(
        ([mandatoryFieldKey, mandatoryQuestion]) => {
            if (mandatoryFieldKey.startsWith('option-based')) {
                const mandatorySplit = mandatoryFieldKey.split('option-based_');
                if (mandatorySplit.length === 2) {
                    let optionFieldError = true;
                    Object.entries(inputs).forEach((inputField) => {
                        if (
                            inputField[0].endsWith(mandatorySplit[1]) &&
                            inputField[1].length > 0
                        ) {
                            optionFieldError = false;
                        }
                    });
                    if (optionFieldError) {
                        mandatoryFieldsErrors[mandatoryFieldKey] =
                            mandatoryQuestion;
                    }
                }
            } else if (
                !(
                    mandatoryFieldKey in inputs &&
                    inputs[mandatoryFieldKey].length > 0
                )
            ) {
                mandatoryFieldsErrors[mandatoryFieldKey] = mandatoryQuestion;
            }
        }
    );
    setMandatoryErrors(mandatoryFieldsErrors);
    return mandatoryFieldsErrors;
};

const submitProjectData = (
    token,
    catalogId,
    inputs,
    callBack,
    dmptProjectId,
    mandatoryFields,
    setMandatoryErrors
) => {
    const mandatoryFieldsErrors = checkMandatoryFields(
        mandatoryFields,
        inputs,
        setMandatoryErrors
    );

    if (Object.keys(mandatoryFieldsErrors).length <= 0) {
        if (dmptProjectId > -1) {
            putProject(token, dmptProjectId, inputs).then((res) => {
                callBack(res.rdmoProjectId);
            });
        } else {
            postProject(token, catalogId, inputs).then((res) => {
                callBack(res.rdmoProjectId);
            });
        }
    }
};

function SectionButtons(props) {
    const {
        sectionIndex,
        sectionsLength,
        setSectionIndex,
        callBack,
        token,
        catalogId,
        inputs,
        disabled,
        dmptProjectId,
        mandatoryFields,
        setMandatoryErrors,
    } = props;

    const submitText = dmptProjectId < 0 ? 'Finalize DMP' : 'Update DMP';

    let previousButton = (
        <button
            type="button"
            className={`list-group-item list-group-item-action text-start ${
                disabled ? 'disabled' : ''
            }`}
            onClick={() => backHandler(sectionIndex, setSectionIndex)}
        >
            <h6
                className={`sidebar-list-item ${
                    disabled ? 'text-muted' : ''
                }`}
            >
                <i className="mdi mdi-chevron-double-left align-middle" />
                <br />
                Previous Section
            </h6>
        </button>
    );

    let continueButton = (
        <button
            type="button"
            className={`list-group-item list-group-item-action text-end ${
                disabled ? 'disabled' : ''
            }`}
            onClick={() =>
                continueHandler(sectionIndex, sectionsLength, setSectionIndex)
            }
        >
            <h6 className={`sidebar-list-item ${disabled ? 'text-muted' : ''}`}>
                <i className="mdi mdi-chevron-double-right align-middle right" />
                <br /> Next Section
            </h6>
        </button>
    );

    if (sectionIndex == 0) {
        previousButton = <div className="list-group-item list-group-item-action disabled list-item-placeholder"></div>;
    }
    if (sectionIndex === sectionsLength - 1) {
        continueButton = (
            <button
                type="button"
                className={`list-group-item list-group-item-action text-end ${
                    disabled ? 'disabled' : ''
                }`}
                onClick={() =>
                    submitProjectData(
                        token,
                        catalogId,
                        inputs,
                        callBack,
                        dmptProjectId,
                        mandatoryFields,
                        setMandatoryErrors
                    )
                }
            >
                <h6
                    className={`sidebar-list-item ${
                        disabled ? 'text-muted' : ''
                    }`}
                >
                    <i className="mdi mdi-chevron-double-right align-middle right" />
                    <br /> {submitText}
                </h6>
            </button>
        );
    }

    return (
        <div className="list-group list-group-flush list-group-horizontal mt-5">
            {previousButton}
            {continueButton}
        </div>
    );
}

SectionButtons.defaultProps = {
    dmptProjectId: -1,
};

SectionButtons.propTypes = {
    sectionIndex: PropTypes.number.isRequired,
    sectionsLength: PropTypes.number.isRequired,
    setSectionIndex: PropTypes.func.isRequired,
    callBack: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    inputs: PropTypes.shape({}).isRequired,
    disabled: PropTypes.bool.isRequired,
    dmptProjectId: PropTypes.number,
    mandatoryFields: PropTypes.shape([]).isRequired,
    setMandatoryErrors: PropTypes.func.isRequired,
};

export default SectionButtons;
