import React from "react";
import PropTypes from "prop-types";

function Radio(props) {
    const { question, handleChange } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            return (
                <div className="form-check">
                    <input type="radio"
                        className="form-check-input"
                        name={`option-${optionSetOption.id}____${question.key}`}
                        id={`option-${optionSetOption.id}`}
                        value={optionSetOption.id}
                        onChange={(e) => handleChange(e)}
                    />
                    <label className="form-check-label"
                        htmlFor={`option-${optionSetOption.id}`}>
                        {optionSetOption.text}
                    </label>
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
        <div id={`question-${question.id}`} name={question.key}>{optionSetFields}</div>
    );
}

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
                text: PropTypes.string.isRequired
            }).isRequired
        }).isRequired
    }).isRequired,
    handleChange: PropTypes.func.isRequired
};

export default Radio;
