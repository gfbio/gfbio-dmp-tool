import React from 'react';
import PropTypes from 'prop-types';

function Select(props) {
    const { question, handleChange, inputs } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {


        const selectFieldName = `optionset-${optionSet.id}____${question.key}____${question.id}`;
        let initialOptionId = '';
        if (selectFieldName in inputs) {
            initialOptionId = inputs[selectFieldName];
        }

        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            return (
                <option
                    className="form-control"
                    id={`option-${optionSetOption.id}`}
                    name={optionSetOption.key}
                    value={optionSetOption.id}
                    selected={`${optionSetOption.id}` === initialOptionId}
                >
                    {optionSetOption.text}
                </option>
            );
        });

        return (
            <select
                className="form-control"
                id={`optionset-${optionSet.id}`}
                name={selectFieldName}
                onChange={(e) => handleChange(e)}
            >
                {optionSetOptions}
            </select>
        );
    });
    return (
        <div id={`question-${question.id}`} name={question.key}>
            {optionSetFields}
        </div>
    );
}

Select.defaultProps = {
    inputs: {},
};

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
    handleChange: PropTypes.func.isRequired,
    inputs: PropTypes.shape({}),
};

export default Select;
