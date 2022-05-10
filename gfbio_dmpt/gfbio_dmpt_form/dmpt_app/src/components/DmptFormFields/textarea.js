import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TextArea(props) {
    const { question, handleChange, initialValue } = props;

    // { question.is_optional ? "" : "required"}
    return (
        <textarea
            className="form-control"
            id={`question-${question.id}`}
            name={question.key}
            rows="3"
            required={question.is_optional}
            onChange={(event) =>
                handleChange(event, question.value_type, question.is_optional)
            }
        >
            {initialValue}
        </textarea>
    );
}

TextArea.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        is_optional: PropTypes.bool.isRequired,
        value_type: PropTypes.string,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
};

TextArea.defaultProps = {
    initialValue: '',
};

export default TextArea;
