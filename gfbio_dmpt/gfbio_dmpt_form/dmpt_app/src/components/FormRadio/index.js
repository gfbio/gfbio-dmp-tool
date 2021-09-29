import React from 'react';

import PropTypes from 'prop-types';

function FormRadio(props) {
    const { item, options, handleChange } = props;
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>

            {
                options[item.optionsets[0]].map((i) => {
                    return (
                        <div className='form-check' key={i.id}>
                            <input className='form-check-input'
                                type='radio'
                                // name={`radio_name_${item.id}`}
                                name={item.key}
                                id={`${item.key}_${i.id}`}
                                value={i.text}
                                onChange={(e) => handleChange(e, item)}
                            />
                            <label className='form-check-label'
                                htmlFor={`${item.key}_${i.id}`}>
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
