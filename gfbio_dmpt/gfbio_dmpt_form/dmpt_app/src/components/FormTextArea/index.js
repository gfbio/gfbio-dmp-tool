import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';

function FormTextArea(props) {

    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    // const rdmoContext = useContext(RdmoContext);
    // console.log('FORM TEXT AREA ');
    // console.log('item');
    // console.log(item);
    // console.log(' -----  value');
    // console.log(value);

    // FIXME: quick and dirty
    let val = value.text;
    if (rdmoContext.form_data[item.key] !== undefined) {
        // console.log('item key in formdata. key  ', item.key, ' | formdata at key ', rdmoContext.form_data[item.key]);
        val = rdmoContext.form_data[item.key].value;
    } else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined) {
        // console.log(' else of key in data. assing to form in context');
        // console.log('value' , value);
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
