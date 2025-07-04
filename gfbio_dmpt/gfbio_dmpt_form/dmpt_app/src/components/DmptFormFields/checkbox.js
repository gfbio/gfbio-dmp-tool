import React from 'react';
import PropTypes from 'prop-types';
import PinnableTooltip from './pinnableTooltip';
import { stripHtml } from './htmlUtils';
import { Collapse } from '@material-ui/core';

function CheckBox(props) {
    const { question, handleChange, inputs } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            const checkBoxFieldName = `option-${optionSetOption.id}____${question.attribute.key}____${question.id}`;
            const additionalInputFieldName = `additional-input-${checkBoxFieldName}`
            let initialOptionId = '';
            let additionalInputFieldValue = '';
            if (checkBoxFieldName in inputs) {
                initialOptionId = inputs[checkBoxFieldName];
                if (initialOptionId && additionalInputFieldName in inputs) {
                    additionalInputFieldValue = inputs[additionalInputFieldName];
                }
            }
            
            return (
                <div className="form-check" key={`option-${optionSetOption.id}`}>
                    <div className="form-check-row">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            value={optionSetOption.id}
                            // name is the key in the form, it has to be unique but we need the question.key for
                            // assigning the value to the right question/project
                            name={checkBoxFieldName}
                            id={`option-${optionSetOption.id}`}
                            onChange={(e) => handleChange(e)}
                            checked={`${optionSetOption.id}` === initialOptionId}
                        />

                        <label
                            className="form-check-label"
                            htmlFor={`option-${optionSetOption.id}`}
                        >
                            {stripHtml(optionSetOption.text)}
                        </label>
                        {optionSetOption.comment && (
                            <PinnableTooltip
                                helptext={optionSetOption.comment}
                            />
                        )}
                    </div>
                    {optionSetOption.additional_input && (
                        <div className="form-check-row-additional-input">
                            <Collapse in={`${optionSetOption.id}` === initialOptionId} className='w-100'>
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
                            </Collapse>
                        </div>
                    )}
                </div>
            );
        });

        return (
            <div
                className="option-set"
                id={`optionset-${optionSet.id}`}
                key={`optionset-${optionSet.id}`}
                name={optionSet.key}
            >
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

CheckBox.defaultProps = {
    inputs: {},
};

CheckBox.propTypes = {
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

export default CheckBox;
