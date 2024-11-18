import React from 'react';
import PropTypes from 'prop-types';

function TextInput(props) {
    const { question, handleChange, initialValue, validationErrors } = props;
    console.log('\nTextInput question ', question);
    console.log('inizial_val', initialValue);
    // This not the best way, but increases readability of data in requests
    const fieldName = `${question.attribute.key}____${question.id}`;
    return (
        <input
            type="text"
            className="form-control"
            id={`question-${question.id}`}
            name={fieldName}
            value={initialValue}
            onChange={(event) =>
                handleChange(event, question.value_type, question.is_optional)
            }
        />
    );
}

TextInput.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        value_type: PropTypes.string,
        is_optional: PropTypes.bool,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    validationErrors: PropTypes.object.isRequired,
};

TextInput.defaultProps = {
    initialValue: '',
};

export default TextInput;
