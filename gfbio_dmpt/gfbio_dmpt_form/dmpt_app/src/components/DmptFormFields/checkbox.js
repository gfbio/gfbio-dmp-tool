import React from 'react';
import PropTypes from 'prop-types';
import PinnableTooltip from './pinnableTooltip'

function CheckBox(props) {  
    const { question, handleChange, inputs } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const optionSetOptions = optionSet.options.map((optionSetOption) => {
            const checkBoxFieldName = `option-${optionSetOption.id}____${question.key}____${question.id}`;
            let initialOptionId = checkBoxFieldName in inputs ? inputs[checkBoxFieldName] : '';
            
            return (
                <div className="form-check" key={`option-${optionSetOption.id}`}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        value={optionSetOption.id}
                        name={checkBoxFieldName}
                        id={`option-${optionSetOption.id}`}
                        onChange={(e) => handleChange(e)}
                        checked={`${optionSetOption.id}` === initialOptionId}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`option-${optionSetOption.id}`}
                    >
                        {optionSetOption.text}
                    </label>
                    {optionSetOption.comment && (
                        <PinnableTooltip
                            helptext={optionSetOption.comment}
                        />
                    )}
                </div>
            );
        });

        return (
            <div 
                className="option-set"
                id={`optionset-${optionSet.id}`} 
                key={`optionset-${optionSet.id}`}
                name={optionSet.key}
            >
                {optionSetOptions}
            </div>
        );
    });

    return (
        <div 
            className="checkbox-group"
            id={`question-${question.id}`} 
            name={question.key}
        >
            {optionSetFields}
        </div>
    );
}

CheckBox.defaultProps = {
    inputs: {},
};

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
    handleChange: PropTypes.func.isRequired,
    inputs: PropTypes.shape({}),
};

export default CheckBox;
