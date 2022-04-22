import React from 'react';
import PropTypes from "prop-types";

function TextInput(props) {
    const {question} = props;
    return (
        <input
            type="text"
            className="form-control"
            id={`question-${question.id}`}
            name={question.key}
        />
    );
}

TextInput.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default TextInput;
