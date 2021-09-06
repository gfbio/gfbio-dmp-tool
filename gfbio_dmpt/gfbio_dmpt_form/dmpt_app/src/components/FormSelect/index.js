import React from 'react';

import PropTypes from 'prop-types';

function FormSelect(props) {
    const { item, options, handleChange } = props;
    // console.log('FORM SELECT');
    // console.log(item);
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <select name={item.key} id={item.key} onChange={handleChange} className='form-control'>
                {options[item.optionsets[0]].map((i) => {
                    return (<option key={i.id}>{i.text}</option>);
                })}
            </select>
            <small id={`help_${item.key}`} className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormSelect.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default FormSelect;
