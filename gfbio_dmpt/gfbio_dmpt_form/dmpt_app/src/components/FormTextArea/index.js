import React from 'react';

import PropTypes from 'prop-types';

function FormTextArea(props) {
    const { item } = props;
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={`input_item_${item.id}`}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <textarea className='form-control' id={`input_item_${item.id}`}
                rows='3' />
            <small id={`help_item_${item.id}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormTextArea.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired
};

export default FormTextArea;
