import React from 'react';
import PropTypes from 'prop-types';
import PinnableTooltip from './pinnableTooltip';

// TODO: DASS-2324: a quick hack to escape html entities in options
//  but this entities are coming from the catalog data. This is in general not needed
//  THE ERROR IS IN THE CATALOG OPTION DATA !
function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function Radio(props) {
    const { question, handleChange, inputs } = props;
    const optionSetFields = question.optionsets.map((optionSet) => {
        const radioFieldName = `optionset-${optionSet.id}____${question.attribute.key}____${question.id}`;
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
                        onChange={(e) =>
                            handleChange(
                                e,
                                optionSetOption.id,
                                question.attribute.key
                            )
                        }
                        checked={`${optionSetOption.id}` === initialOptionId}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`option-${optionSetOption.id}`}
                    >
                        {decodeHTMLEntities(optionSetOption.text)}
                    </label>
                    <PinnableTooltip helptext={optionSetOption.comment} />
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
        <div id={`question-${question.id}`} name={question.attribute.key}>
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
