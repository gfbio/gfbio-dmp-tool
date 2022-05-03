import React from "react";
import PropTypes from "prop-types";

function CheckBox(props) {
    const { question, handleChange } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            return (
                <div className="form-check">
                    <input type="checkbox"
                        className="form-check-input"
                        // value is id of option to be set in value, since it is a foreign key relation there
                        value={optionSetOption.id}
                        // name is the key in the form, it has to be unique but we need the question.key for
                        // assigning the value to the right question/project
                        name={`option-${optionSetOption.id}____${question.key}`}
                        id={`option-${optionSetOption.id}`}
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
                text: PropTypes.string.isRequired
            }).isRequired
        }).isRequired
    }).isRequired,
    handleChange: PropTypes.func.isRequired
};

export default CheckBox;
