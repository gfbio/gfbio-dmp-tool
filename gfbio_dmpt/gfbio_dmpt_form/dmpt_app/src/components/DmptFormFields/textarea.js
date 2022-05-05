import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

function TextArea(props) {
    const { question, handleChange, initialValue } = props;
    const [emailError, setEmailError] = useState('');

    const validateEmail = (event) => {
        const email = event.target.value;

        if (validator.isEmail(email)) {
            setEmailError('Valid Email :)');
        } else {
            setEmailError('Enter valid Email!');
        }
    };

    // { question.is_optional ? "" : "required"}
    return (
        <textarea
            className="form-control"
            id={`question-${question.id}`}
            name={question.key}
            rows="3"
            required={question.is_optional}
            onChange={(event) => handleChange(event)}
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
