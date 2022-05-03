import React from "react";
import PropTypes from "prop-types";

function TextArea(props) {
    const { question, handleChange, initialValue } = props;
    if (question.is_optional) {
        return (
            <textarea
                className="form-control"
                id={`question-${question.id}`}
                name={question.key}
                rows="3"
                onChange={(e) => handleChange(e)}
            >{initialValue}</textarea>
        );
    }
    return (
        <textarea
            className="form-control"
            id={`question-${question.id}`}
            name={question.key}
            rows="3"
            required
            onChange={(e) => handleChange(e)}
        >{initialValue}</textarea>
    );
}

TextArea.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        is_optional: PropTypes.bool.isRequired
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string
};

TextArea.defaultProps = {
    initialValue: ""
};

export default TextArea;
