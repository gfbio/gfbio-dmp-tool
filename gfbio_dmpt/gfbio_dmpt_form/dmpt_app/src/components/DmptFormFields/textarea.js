import React from 'react';
import PropTypes from "prop-types";

function TextArea(props) {
    const {question, handleChange} = props;
    return (
        <textarea
            className="form-control"
            id={`question-${question.id}`}
            name={question.key}
            rows="3"
            onChange={(e) => handleChange(e)}
        />
    );
}

TextArea.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
};

export default TextArea;
