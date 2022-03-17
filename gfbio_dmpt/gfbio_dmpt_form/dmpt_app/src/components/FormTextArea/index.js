import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';

function FormTextArea(props) {

    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);

    console.log('\nFormTextArea context formdata', rdmoContext.form_data);
    console.log('item key ', item.key, ' | formdata at key ', rdmoContext.form_data[item.key]);
    console.log('value ', value);
    // FIXME: quick and dirty
    const val = value.text;
    console.log('val after assgin  ', val);
    if (rdmoContext.form_data[item.key] !== undefined) {

        console.log('IF | item key ', item.key, ' | formdata at key ', rdmoContext.form_data[item.key]);
        // val = rdmoContext.form_data[item.key].value;
        rdmoContext.form_data[item.key] = {
            'value': value.text,
            'valueId': value.id,
            'question': item
        };
    } else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined) {
        console.log('ELSE_IF | item key', item.key, ' in data. assing to form in context');
        rdmoContext.form_data[item.key] = {
            'value': value.text,
            'valueId': value.id,
            'question': item
        };
    }
    console.log('before  return');
    console.log('val ', val);
    console.log('context form data ', rdmoContext.form_data);
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <h5>{item.text_en}</h5>
                <small id={`help_${item.key}`}
                    className='form-text text-muted'>
                    {item.help_en}
                </small>
            </label>
            <textarea name={item.key} id={item.key} className='form-control'
                rows='3' onChange={(e) => handleChange(e, item)}>
                {val}
            </textarea>

        </div>
    );
}

FormTextArea.defaultProps = {
    value: ''
};

FormTextArea.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired
};

export default FormTextArea;
