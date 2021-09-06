import React from 'react';

import PropTypes from 'prop-types';

function FormCheckBox(props) {
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
                            <input className='form-check-input' type='checkbox'
                                name={`checkbox_${item.key}_${i.id}`}
                                value={i.text}
                                onChange={handleChange}
                                id={`${item.key}_${i.id}`} />
                            <label className='form-check-label'
                                htmlFor={`checkbox_${item.key}_${i.id}`}>
                                {i.text}
                            </label>
                        </div>
                    );
                })
            }
            <small id={`help_${item.key}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormCheckBox.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default FormCheckBox;
