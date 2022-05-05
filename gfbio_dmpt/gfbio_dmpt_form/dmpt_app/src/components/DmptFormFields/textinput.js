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
<<<<<<< Updated upstream
            value={initialValue}
            onChange={(e) => handleChange(e)}
=======
            onChange={(event) => handleChange(event, question.field_type)}
>>>>>>> Stashed changes
        />
    );
}

TextInput.propTypes = {
    question: PropTypes.shape({
        key: PropTypes.string.isRequired,
<<<<<<< Updated upstream
        id: PropTypes.number.isRequired
=======
        id: PropTypes.number.isRequired,
        field_type: PropTypes.string,
>>>>>>> Stashed changes
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string
};

TextInput.defaultProps = {
    initialValue: ""
};

export default TextInput;
