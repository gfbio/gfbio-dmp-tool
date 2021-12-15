import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';

function FormSelect(props) {
    const { item, options, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    // console.log('FORM SELECT');
    // console.log(item);
    // console.log(options)
    // FIXME: quick and dirty
    let val = value.text;
    if (rdmoContext.form_data[item.key] !== undefined) {
        // console.log('item key in formdata. key  ', item.key, ' | formdata at key ', rdmoContext.form_data[item.key]);
        val = rdmoContext.form_data[item.key].value;
    } else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined) {
        // console.log(' else of key in data. assing to form in context');
        rdmoContext.form_data[item.key] = {
            'value': value.text,
            'valueId': value.id,
            'question': item
        };
    }
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <h5>{item.text_en}</h5>
                <small id={`help_${item.key}`} className='form-text text-muted'>
                    {item.help_en}
                </small>
            </label>
            <select name={item.key} id={item.key}
                onChange={(e) => handleChange(e, item)}
                className='form-control'>
                {options[item.optionsets[0]].map((i) => {

                    // console.log(' --- ', i.text );
                    if (i.text === val) {
                        return (<option key={i.id} selected>{i.text}</option>);
                    }
                    return (<option key={i.id}>{i.text}</option>);
                })}
            </select>
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
