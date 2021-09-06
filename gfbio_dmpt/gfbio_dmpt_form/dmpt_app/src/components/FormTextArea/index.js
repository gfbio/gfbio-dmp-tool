import React from 'react';

import PropTypes from 'prop-types';

function FormTextArea(props) {
    const { item, handleChange } = props;
    // console.log('FORM TEXT AREA ');
    // console.log(item);
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <textarea name={item.key} id={item.key} className='form-control'
                rows='3' onChange={handleChange} />
            <small id={`help_${item.key}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormTextArea.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default FormTextArea;
