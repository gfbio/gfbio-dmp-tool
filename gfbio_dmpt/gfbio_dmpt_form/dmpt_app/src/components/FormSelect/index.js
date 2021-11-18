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
    let val = value;
    if (rdmoContext.form_data[item.key] !== undefined) {
        val = rdmoContext.form_data[item.key].value;
    }
    // console.log('val ', val);
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <select name={item.key} id={item.key}
                onChange={(e) => handleChange(e, item)}
                className='form-control'>
                {options[item.optionsets[0]].map((i) => {

                    // console.log(' --- ', i.text );
                    if(i.text === val){
                        return (<option key={i.id} selected>{i.text}</option>);
                    }
                    return (<option key={i.id}>{i.text}</option>);
                })}
            </select>
            <small id={`help_${item.key}`} className='form-text text-muted'>
                {item.help_en}
            </small>
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
