import React from 'react';
import { useState } from "react";
import PropTypes from 'prop-types';
import PinnableTooltip from './pinnableTooltip';
import { stripHtml } from './htmlUtils';

function AutoComplete(props) {
    const { question, handleChange, inputs } = props;
    const optionset_id = `optionset-${question.attribute.key}____${question.id}`;
    const allOptions = {};
    const options = (
        <datalist id={optionset_id}>
            {
                question.optionsets.map(optionSet => {
                    return optionSet.options.map(optionSetOption => {
                        const displayValue = `${stripHtml(optionSetOption.text)}`;
                        const fieldName = `option-${optionSetOption.id}____${question.attribute.key}____${question.id}`;
                        allOptions[displayValue] = {optionSetId: optionSetOption.id, fieldName: fieldName};
                        return (
                            <option 
                                value={displayValue}
                                id={`option-${optionSetOption.id}`}
                            />
                        );
                    });
                })
            }

        </datalist>    
    );

    const [currentInputValue, setCurrentInputValue] = useState("");

    const changeValue = (event) => {
        const value = event.target.value;
        setCurrentInputValue(value);
    };

    const initalValues = [];
    for (var optionText in allOptions) {
        var option = allOptions[optionText];
        if (inputs.hasOwnProperty(option.fieldName) && inputs[option.fieldName]) {
            initalValues.push(optionText);
        }
    }
    const [values, setValues] = useState(initalValues);

    const valuesList = <div className='row'>
        <div className='col-12'>
            {
                values.some(() => true) && (
                    <ul className='list-group mb-3 mt-2 listings-form-field'>
                        {
                            values.map(v => {
                                var optionSetOption = question.optionsets.flatMap(o => o.options).find(o => o.text == v);
                                return (
                                    <li className='list-group d-flex flex-row my-1 align-items-center justify-content-between listing-item' style={{
                                        boxShadow: ((v == currentInputValue) ? "0px 0px 3px 3px #3cace44a" : "none")
                                    }}>
                                        <div className='title'>
                                            <span>
                                                {v}
                                            </span>
                                            {optionSetOption && optionSetOption.comment && (
                                                <span className='ms-2'>
                                                    <PinnableTooltip
                                                        helptext={optionSetOption.comment}
                                                        />
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <button className='btn d-flex flex-row delete-button align-items-center' type="button" onClick={() => removeValue(v)}>
                                                <i class="mdi mdi-close"></i>
                                                <span className=' d-none d-sm-block'>Remove</span>
                                            </button>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            }
        </div>
    </div>

    const currentValueValid = () => {
        return currentInputValue && currentInputValue.trim() && !values.some(v => v == currentInputValue) && Object.keys(allOptions).some(v => v == currentInputValue);
    }

    const currentValueInvalid = () => {
        var regex = RegExp(RegExp.escape(currentInputValue), "i");
        return currentInputValue && currentInputValue.trim() && (values.some(v => v == currentInputValue) || !Object.keys(allOptions).some(v => regex.test(v)));
    }

    const removeValue = (value) => {
        if (values.some(v => v == value)) {
            setValues(values.filter(v => v != value));
            var option = allOptions[value];
            handleChange({target: { value: option.optionSetId, name: option.fieldName }, persist: () => {}});
        }
    }
    
    const addValue = () => {
        if (currentValueValid()) {
            values.push(currentInputValue);
            setValues(values);
            var option = allOptions[currentInputValue];
            handleChange({target: { value: option.optionSetId, name: option.fieldName }, persist: () => {}});
        }
        setCurrentInputValue("");
    };

    const addButton = <div className='row'>
        <div className='col-12 col-md-9 col-xl-10 mb-0'>
            <input 
                type="text"
                className={`form-control ${currentValueValid() ? 'is-valid' : (currentValueInvalid() ? 'is-invalid': '')}`}
                id={`question-${question.id}`}
                value={currentInputValue}
                onChange={(e) => changeValue(e)}
                list={optionset_id}
                placeholder="Start typing to find all options"
                onKeyDown={(event) => {
                    if (event.key === "Enter" && currentValueValid()) {
                        addValue();
                    }
                }}
            />
        </div>
        <div className='col-12 col-md-3 col-xl-2 pt-2 pt-md-0 h-auto'>
            <button type='button' onClick={() => addValue()} className='btn btn-primary btn-green w-100 h-100' disabled={!currentValueValid()}>
                Add type
            </button>
        </div>
    </div>
    return (
        <div id={`question-${question.id}`} name={question.attribute.key}>
            {options}
            {valuesList}
            {addButton}
        </div>
    );
}

AutoComplete.defaultProps = {
    inputs: {},
};

AutoComplete.propTypes = {
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

export default AutoComplete;
