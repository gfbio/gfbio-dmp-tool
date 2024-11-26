import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './textinput';
import TextArea from './textarea';
import Select from './select';
import Radio from './radio';
import CheckBox from './checkbox';
import PinnableTooltip from './pinnableTooltip'

function DmptFormFields(props) {
    const { section, handleInputChange, inputs, validationErrors, language} = props;
    const inputFields = section.questionsets.map((questionset) => {
        return (
            <div className="col-12 mb-4" id={`questionset-${questionset.id}`}>
                <div className="questionHelp">
                    <h5>{questionset.title}</h5>
                    <PinnableTooltip helptext={questionset.help} />
                </div>

                {questionset.questions.map((question) => {
                    const mandatoryIndicator = question.is_optional ? null : (
                        <span className="mandatory" aria-label="Required field">*</span>
                    );

                    const fieldName = `${question.key}____${question.id}`;
                    let initialTextValue = inputs[fieldName] !== undefined ? inputs[fieldName] : '';

                    let input = (
                        <TextInput
                            question={question}
                            handleChange={handleInputChange}
                            initialValue={initialTextValue}
                        />
                    );

                    if (question.widget_type === 'textarea') {
                        input = (
                            <TextArea
                                question={question}
                                handleChange={handleInputChange}
                                initialValue={initialTextValue}
                            />
                        );
                    } else if (question.widget_type === 'select') {
                        input = (
                            <Select
                                question={question}
                                handleChange={handleInputChange}
                                inputs={inputs}
                            />
                        );
                    } else if (question.widget_type === 'radio') {
                        input = (
                            <Radio
                                question={question}
                                handleChange={handleInputChange}
                                inputs={inputs}
                            />
                        );
                    } else if (question.widget_type === 'checkbox') {
                        input = (
                            <CheckBox
                                question={question}
                                handleChange={handleInputChange}
                                inputs={inputs}
                            />
                        );
                    }

                    const validationMessage = ['email', 'url', 'phone', 'integer', 'float'].includes(question.value_type) &&
                        Object.keys(validationErrors).some(k => k.startsWith(question.key)) ? (
                            <span className="mandatory">
                                {language?.shortCode === "DE"
                                    ? `(kein valider ${question.value_type})`
                                    : `(not a valid ${question.value_type})`}
                            </span>
                        ) : null;

                    return (
                        <div className="col-12 mb-4">
                            <label
                                aria-label={question.text}
                                htmlFor={fieldName}
                                className="form-label"
                            >
                                {question.text}
                                {mandatoryIndicator}
                                <PinnableTooltip helptext={question.help} />
                            </label>
                            {input}
                            <small className="form-text text-muted validation-field">
                                {mandatoryMessage} {validationMessage}
                            </small>
                        </div>
                    );
                })}
            </div>
        );
    });

    return (
        <div className="row">
            {inputFields}
        </div>
    );
}

DmptFormFields.propTypes = {
    section: PropTypes.shape({
        questionsets: PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            map: PropTypes.func.isRequired,
            questions: PropTypes.shape({
                is_optional: PropTypes.bool.isRequired,
                widget_type: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
                help: PropTypes.string,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    validationErrors: PropTypes.object.isRequired,
    language: PropTypes.object,
};

export default DmptFormFields;
