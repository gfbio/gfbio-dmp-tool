import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import TextInput from './textinput';
import TextArea from './textarea';
import Select from './select';
import Radio from './radio';
import CheckBox from './checkbox';

function DmptFormFields(props) {
    const { section, handleInputChange, inputs, validationErrors } = props;
    const inputFields = section.questionsets.map((questionset) => {
        return (
            <div className="col-12 mb-3" id={`questionset-${questionset.id}`}>
                <div className="questionHelp">
                    <h5>{questionset.title}</h5>
                    {questionset.help !== '' && (
                        <Tooltip title={questionset.help} placement="right">
                            <i className="mdi mdi-help-circle-outline" />
                        </Tooltip>
                    )}
                </div>

                {questionset.questions.map((question) => {
                    const mandatoryMessage = question.is_optional ? (
                        <span />
                    ) : (
                        <span className="mandatory">
                            (This field is mandatory)
                        </span>
                    );

                    // This not the best way, but increases readability of data in requests
                    const fieldName = `${question.key}____${question.id}`;
                    let initialTextValue = '';
                    if (inputs[fieldName] !== undefined) {
                        initialTextValue = inputs[fieldName];
                    }
                    // TODO: add a way to do this for option based fields, like radio, select, checkbox

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

                    let validationMessage = <span />;

                    // TODO: <09-05-22, claas> //
                    // extract the array into a static variable. These could
                    // also be passed later from the backend
                    if (
                        ['email', 'url', 'phone', 'integer', 'float'].includes(
                            question.value_type
                        )
                    ) {
                        if (question.key in validationErrors) {
                            validationMessage = (
                                <span className="mandatory">
                                    (not a valid {question.value_type})
                                </span>
                            );
                        }
                    }

                    return (
                        <div className="col-12">
                            <label
                                aria-label={question.text}
                                htmlFor="username"
                                className="form-label"
                            >
                                {question.text}
                                {question.help !== '' && (
                                    <Tooltip
                                        title={question.help}
                                        placement="right"
                                    >
                                        <i className="labelHelpIcon mdi mdi-help-circle-outline" />
                                    </Tooltip>
                                )}
                            </label>
                            {input}
                            <small className="form-text text-muted">
                                {mandatoryMessage} {validationMessage}
                            </small>
                        </div>
                    );
                })}
            </div>
        );
    });
    return <div className="row g-3">{inputFields}</div>;
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
};

export default DmptFormFields;
