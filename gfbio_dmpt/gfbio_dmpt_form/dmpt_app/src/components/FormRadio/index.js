import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit from '../../utils/form_utils';

function FormRadio(props) {
    const { item, options, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    const val = formFieldInit(value, rdmoContext, item);
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <h5>{item.text_en}</h5>
                <small id={`help_item_${item.id}`}
                    className='form-text text-muted'>
                    {item.help_en}
                </small>
            </label>
            {
                options[item.optionsets[0]].map((i) => {
                    if (i.text === val) {
                        return (
                            <div className='form-check' key={i.id}>
                                <input className='form-check-input'
                                    type='radio'
                                    // name={`radio_name_${item.id}`}
                                    name={item.key}
                                    id={`${item.key}_${i.id}`}
                                    value={i.text}
                                    onChange={(e) => handleChange(e, item)}
                                    checked
                                />
                                <label className='form-check-label'
                                    htmlFor={`${item.key}_${i.id}`}>
                                    {i.text}
                                </label>
                            </div>
                        );
                    }
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
        </div>
    );
}

FormRadio.defaultProps = {
    value: ''
};
FormRadio.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired
};

export default FormRadio;
