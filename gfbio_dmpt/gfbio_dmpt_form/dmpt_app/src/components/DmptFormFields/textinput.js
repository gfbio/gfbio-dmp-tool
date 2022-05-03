import React from 'react';
import PropTypes from 'prop-types';

function TextInput(props) {
    const { question, handleChange, initialValue } = props;
    return (
        <input
            type="text"
            className="form-control"
            id={`question-${question.id}`}
            name={question.key}
            value={initialValue}
            onChange={(e) => handleChange(e)}
        />
    );
}

TextInput.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string
};

TextInput.defaultProps = {
    initialValue: ""
};

export default TextInput;
