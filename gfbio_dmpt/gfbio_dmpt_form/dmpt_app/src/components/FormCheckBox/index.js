import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit from '../../utils/form_utils';

function FormCheckBox(props) {
    const { item, options, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    // console.log('\nFormCheckBox |formFieldInit | value: ', value);
    // console.log('\tformdata@item.key ', rdmoContext.form_data[item.key]);
    // console.log('\tformdata ', rdmoContext.form_data);
    // console.log('\titem: ', item);
    const val = formFieldInit(value, rdmoContext, item);
    // console.log('\tval:_', val);
    return (
        <div className='form-group' key={item.id}>

            <label htmlFor={item.key}>
                <h5>{item.text_en}</h5>
                <small id={`help_${item.key}`}
                    className='form-text text-muted'>
                    {item.help_en}
                </small>
            </label>
            {
                options[item.optionsets[0]].map((i) => {
                    // console.log('\tFormCheckBox | map options | text: ', i.text, ' | val: ', val);
                    if (i.text === val) {
                        return (
                            <div className='form-check' key={i.id}>
                                <input className='form-check-input'
                                    type='checkbox'
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
