import React from 'react';
import PropTypes from "prop-types";

function CheckBox(props) {
    const {question} = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            return (
                <div className="form-check">
                    <input type="checkbox"
                        className="form-check-input"
                        value={optionSetOption.key}
                        id={`option-${optionSetOption.id}`}
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
                text: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
};

export default CheckBox;
