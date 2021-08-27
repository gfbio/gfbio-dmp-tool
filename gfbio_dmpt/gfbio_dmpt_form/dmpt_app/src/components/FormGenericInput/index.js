import React from 'react';

import PropTypes from 'prop-types';

function FormGenericInput(props) {
    const { item } = props;
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={`input_item_${item.id}`}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <input type={item.widget_type} className='form-control'
                id={`input_item_${item.id}`}
                placeholder='name@example.com' />
            <small id={`help_item_${item.id}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormGenericInput.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired
};

export default FormGenericInput;
