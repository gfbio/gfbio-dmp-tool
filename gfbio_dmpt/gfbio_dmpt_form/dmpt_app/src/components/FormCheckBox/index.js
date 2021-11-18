import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';

function FormCheckBox(props) {
    const { item, options, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    // FIXME: quick and dirty
    let val = value;
    if (rdmoContext.form_data[item.key] !== undefined) {
        val = rdmoContext.form_data[item.key].value;
    }
    return (
        <div className='form-group' key={item.id}>

            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            {
                options[item.optionsets[0]].map((i) => {
                    if (i.text === val) {
                        return (
                            <div className='form-check' key={i.id}>
                                <input className='form-check-input' type='checkbox'
                                    name={`checkbox_${item.key}_${i.id}`}
                                    value={i.text}
                                    onChange={(e) => handleChange(e, item)}
                                    id={`${item.key}_${i.id}`}
                                    checked
                                />
                                <label className='form-check-label'
                                    htmlFor={`checkbox_${item.key}_${i.id}`}>
                                    {i.text}
                                </label>
                            </div>
                        );
                    }
                    return (
                        <div className='form-check' key={i.id}>
                            <input className='form-check-input' type='checkbox'
                                name={`checkbox_${item.key}_${i.id}`}
                                value={i.text}
                                onChange={(e) => handleChange(e, item)}
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

FormCheckBox.defaultProps = {
    value: ''
};

FormCheckBox.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired
};

export default FormCheckBox;
