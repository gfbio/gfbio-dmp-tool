import React from 'react';
import PropTypes from 'prop-types';
import PinnableTooltip from './pinnableTooltip';
import { stripHtml } from './htmlUtils';

function Radio(props) {
    const { question, handleChange, inputs } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const radioFieldName = `optionset-${optionSet.id}____${question.attribute.key}____${question.id}`;
        let initialOptionId = '';

        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            let additionalInputFieldValue = '';
            const additionalInputFieldName = `additional-input-option-${optionSetOption.id}-${radioFieldName}`;
            if (radioFieldName in inputs) {
                initialOptionId = inputs[radioFieldName];
                if (initialOptionId && additionalInputFieldName in inputs) {
                    additionalInputFieldValue = inputs[additionalInputFieldName];
                }
            }
            return (
                <div className="form-check">
                    <div className="form-check-row">
                        <input
                            type="radio"
                            className="form-check-input"
                            name={radioFieldName}
                            id={`option-${optionSetOption.id}`}
                            value={optionSetOption.id}
                            onChange={(e) =>
                                handleChange(
                                    e,
                                    optionSetOption.id,
                                    question.attribute.key
                                )
                            }
                            checked={`${optionSetOption.id}` === initialOptionId}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`option-${optionSetOption.id}`}
                        >
                            {stripHtml(optionSetOption.text)}
                        </label>
                        <PinnableTooltip helptext={optionSetOption.comment} />
                    </div>
                    {`${optionSetOption.id}` === initialOptionId && optionSetOption.additional_input && (
                        <div className="form-check-row-additional-input">
                            {optionSetOption.additional_input == "text" && (
                                <input
                                    type="text"
                                    id={`option-${optionSetOption.id}-additional-input`}
                                    onChange={(e) => handleChange(e)}
                                    name={additionalInputFieldName}
                                    value={additionalInputFieldValue}
                                />
                            )}
                            {optionSetOption.additional_input == "textarea" && (
                                <textarea
                                    type="text"
                                    id={`option-${optionSetOption.id}-additional-input`}
                                    onChange={(e) => handleChange(e)}
                                    name={additionalInputFieldName}
                                    value={additionalInputFieldValue}
                                />
                            )}
                        </div>
                    )}
                </div>
            );
        });

        return (
            <div id={`optionset-${optionSet.id}`} name={optionSet.key}>
                {optionSetOptions}
            </div>
        );
    });
    return (
        <div id={`question-${question.id}`} name={question.attribute.key}>
            {optionSetFields}
        </div>
    );
}

Radio.defaultProps = {
    inputs: {},
};

Radio.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        optionsets: PropTypes.shape({
            key: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            map: PropTypes.func.isRequired,
            options: PropTypes.shape({
                id: PropTypes.number.isRequired,
                key: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    inputs: PropTypes.shape({}),
};

export default Radio;
