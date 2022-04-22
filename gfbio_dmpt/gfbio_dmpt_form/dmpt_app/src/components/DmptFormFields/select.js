import React from 'react';
import PropTypes from "prop-types";

function Select(props) {
    const {question} = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            return (<option className="form-control"
                id={`option-${optionSetOption.id}`}
                name={optionSetOption.key}>
                {optionSetOption.text}
            </option>);
        });
        return (
            <select className="form-control" id={`optionset-${optionSet.id}`}
                name={optionSet.key}>
                {optionSetOptions}
            </select>
        );
    });
    return (
        <div id={`question-${question.id}`} name={question.key}>{optionSetFields}</div>
    );
}

Select.propTypes = {
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

export default Select;
