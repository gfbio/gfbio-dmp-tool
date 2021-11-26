import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';

function FormGenericInput(props) {
    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);

    // console.log('FormGenericInput');
    // FIXME: quick and dirty
    let val = value.text;
    if (rdmoContext.form_data[item.key] !== undefined) {
        // console.log('item key in formdata. key  ', item.key, ' | formdata at key ', rdmoContext.form_data[item.key]);
        val = rdmoContext.form_data[item.key].value;
    }
    else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined)  {
        // console.log(' else of key' , item.key ,  ' in data. assing to form in context');
        // console.log('value ');
        // console.log(value);
        // console.log('item');
        // console.log(item);
        rdmoContext.form_data[item.key] = {
            'value': value.text,
            'question': item
        };
    }

    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <input
                type={item.widget_type}
                className='form-control'
                name={item.key}
                id={item.key}
                onChange={(e) => handleChange(e, item)}
                // FIXME: quick and dirty see above
                value={val}
            />
            <small id={`help_${item.key}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormGenericInput.defaultProps = {
    value: '',
};

FormGenericInput.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired

};

export default FormGenericInput;
