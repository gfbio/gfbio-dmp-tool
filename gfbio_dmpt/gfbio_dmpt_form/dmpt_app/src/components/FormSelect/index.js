import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, {markFormFieldMandatory} from '../../utils/form_utils';

function FormSelect(props) {
    const { item, options, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);

    const val = formFieldInit(value, rdmoContext, item);
    const { headerText, helpText } = markFormFieldMandatory(item);

    let inputField = (
        <select name={item.key} id={item.key}
            onChange={(e) => handleChange(e, item)}
            className='form-control' required>
            <option disabled selected hidden value="">-- Please select</option>
            {options[item.optionsets[0]].map((i) => {
                if (i.text === val) {
                    return (<option key={i.id} selected>{i.text}</option>);
                }
                return (<option key={i.id}>{i.text}</option>);
            })}
        </select>
    );
    if (item.is_optional) {
        inputField = (
            <select name={item.key} id={item.key}
                onChange={(e) => handleChange(e, item)}
                className='form-control'>
                <option disabled selected hidden value="">-- Please select</option>
                {options[item.optionsets[0]].map((i) => {
                    if (i.text === val) {
                        return (<option key={i.id} selected>{i.text}</option>);
                    }
                    return (<option key={i.id}>{i.text}</option>);
                })}
            </select>
        );
    }
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                {headerText}
                <small id={`help_${item.key}`} className='form-text text-muted'>
                    {helpText}
                </small>
            </label>
            {inputField}
        </div>
    );
}

FormSelect.defaultProps = {
    value: ''
};

FormSelect.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired
};

export default FormSelect;
