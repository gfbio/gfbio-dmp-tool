import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

function Radio(props) {
    const { question, handleChange, inputs } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const radioFieldName = `optionset-${optionSet.id}____${question.key}____${question.id}`;
        let initialOptionId = '';
        if (radioFieldName in inputs) {
            initialOptionId = inputs[radioFieldName];
        }

        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            return (
                <div className="form-check">
                    <input
                        type="radio"
                        className="form-check-input"
                        name={radioFieldName}
                        id={`option-${optionSetOption.id}`}
                        value={optionSetOption.id}
                        onChange={(e) => handleChange(e)}
                        checked={`${optionSetOption.id}` === initialOptionId}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`option-${optionSetOption.id}`}
                    >
                        {optionSetOption.text}
                        {optionSetOption.comment !== '' && (
                            <Tooltip
                                title={optionSetOption.comment}
                                placement="right"
                            >
                                <i className="labelHelpIcon mdi mdi-help-circle-outline" />
                            </Tooltip>
                        )}
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
        <div id={`question-${question.id}`} name={question.key}>
            {optionSetFields}
        </div>
    );
}

Radio.defaultProps = {
    inputs: {},
};

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
                text: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    inputs: PropTypes.shape({}),
};

export default Radio;
