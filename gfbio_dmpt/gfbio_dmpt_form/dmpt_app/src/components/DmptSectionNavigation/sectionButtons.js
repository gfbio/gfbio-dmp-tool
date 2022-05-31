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
    // console.log('sectionButtons | checkMandatoryFields | mandatoryFields ', mandatoryFields);
    Object.entries(mandatoryFields).forEach(
        ([mandatoryFieldKey, mandatoryQuestion]) => {
            // console.log('sectionButtons | checkMandatoryFields | mandatoryFieldKey ', mandatoryFieldKey);
            if (mandatoryFieldKey.startsWith('option-based')) {
                const mandatorySplit = mandatoryFieldKey.split('option-based_');
                // console.log('\t | mandatorySplit ', mandatorySplit);

                if (mandatorySplit.length === 2) {
                    let optionFieldError = true;
                    // console.log('\t\t | mandatorySplit is 2 :  ', mandatorySplit.length);
                    Object.entries(inputs).forEach((inputField) => {
                        // console.log('\tmap | mandatoryFields | inputField ', inputField, ' | endswith ', mandatorySplit[1], ' ', inputField[0].endsWith(mandatorySplit[1]), ' | length ', inputField[1].length);
                        if (inputField[0].endsWith(mandatorySplit[1]) && inputField[1].length > 0) {
                            optionFieldError = false;
                            // console.log('\t\t ... set optionalFieldError to false : ', optionFieldError);
                        }
                    });
                    // console.log('optional field error ', optionFieldError);
                    if (optionFieldError) {
                        mandatoryFieldsErrors[mandatoryFieldKey] =
                            mandatoryQuestion;
                    }
                }

            }
            else if ( !(mandatoryFieldKey in inputs && inputs[mandatoryFieldKey].length > 0)) {
                mandatoryFieldsErrors[mandatoryFieldKey] = mandatoryQuestion;
            }
        }
    );
    // console.log(' execute setMandatoryErrors with : ', mandatoryFieldsErrors);
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
    // console.log(
    //     'sectionButtons.js | instanced in DmptSectionNavigation | submitProjectData (post/put) | inputs ',
    //     inputs
    // );
    const mandatoryFieldsErrors = checkMandatoryFields(
        mandatoryFields,
        inputs,
        setMandatoryErrors
    );
    // console.log(
    //     'sectionButtons.js |  submitProjectData (post/put) | mandatoryFieldErrors ',
    //     Object.keys(mandatoryFieldsErrors).length
    // );

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
