import React from 'react';

import PropTypes from 'prop-types';

function FormRadio(props) {
    const { item, options, handleChange } = props;
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={`input_item_${item.id}`}>
                <i>{item.id}</i>:{item.text_en}
            </label>

            {
                options[item.optionsets[0]].map((i) => {
                    return (
                        <div className='form-check' key={i.id}>
                            <input className='form-check-input'
                                type='radio'
                                name={`radio_name_${item.id}`}
                                id={`radio_${item.id}_${i.id}`}
                                value={i.text} />
                            <label className='form-check-label'
                                htmlFor={`radio_${item.id}_${i.id}`}>
                                {i.text}
                            </label>
                        </div>
                    );
                })
            }
            <small id={`help_item_${item.id}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormRadio.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default FormRadio;
