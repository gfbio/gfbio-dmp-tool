import React from 'react';

import PropTypes from 'prop-types';

function FormSelect(props) {
    const { item, options } = props;
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={`input_item_${item.id}`}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            <select className='form-control'>
                {options[item.optionsets[0]].map((i) => {
                    return (<option key={i.id}>{i.text}</option>);
                })}
            </select>
            <small id={`help_item_${item.id}`} className='form-text text-muted'>
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
};

export default FormSelect;
