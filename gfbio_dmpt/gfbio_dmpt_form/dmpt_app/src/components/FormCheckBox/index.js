import React from 'react';

import PropTypes from 'prop-types';

function FormCheckBox(props) {
    const { item, options } = props;
    return (
        <div className='form-group' key={item.id}>

            <label htmlFor={`input_item_${item.id}`}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            {
                options[item.optionsets[0]].map((i) => {
                    return (
                        <div className='form-check' key={i.id}>
                            <input className='form-check-input' type='checkbox'
                                name={`checkbox_name_${item.id}`}
                                value={i.text}
                                id={`checkbox_${item.id}_${i.id}`} />
                            <label className='form-check-label'
                                htmlFor={`checkbox_${item.id}_${i.id}`}>
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

FormCheckBox.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired
};

export default FormCheckBox;
