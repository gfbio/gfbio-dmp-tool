import React from 'react';

import PropTypes from 'prop-types';

function FormGenericInput(props) {
    const { item, handleChange } = props;
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <input type={item.widget_type} className='form-control'
                name={item.key}
                id={item.key}
                onChange={(e) => handleChange(e, item)}
                placeholder='name@example.com' />
            <small id={`help_${item.key}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormGenericInput.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default FormGenericInput;
