import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, { markFormFieldMandatory } from '../../utils/form_utils';

function FormCheckBox(props) {
    const { item, options, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);

    const val = formFieldInit(value, rdmoContext, item);
    const { headerText, helpText } = markFormFieldMandatory(item);
    // TODO: not sure if mandatory checkbox field makes sense. at least it
    //  depends on the question. like "agree to tos" ...

    return (
        <div className='form-group' key={item.id}>

            <label htmlFor={item.key}>
                {headerText}
                <small id={`help_${item.key}`}
                    className='form-text text-muted'>
                    {helpText}
                </small>
            </label>
            {
                options[item.optionsets[0]].map((i) => {
                    if (i.text === val) {
                        if (item.is_optional) {
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
                                <input className='form-check-input'
                                    type='checkbox'
                                    name={`checkbox_${item.key}_${i.id}`}
                                    value={i.text}
                                    onChange={(e) => handleChange(e, item)}
                                    id={`${item.key}_${i.id}`}
                                    checked
                                    required
                                />
                                <label className='form-check-label'
                                    htmlFor={`checkbox_${item.key}_${i.id}`}>
                                    {i.text}
                                </label>
                            </div>
                        );
                    }
                    if (item.is_optional) {
                        return (
                            <div className='form-check' key={i.id}>
                                <input className='form-check-input'
                                    type='checkbox'
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
                    }
                    return (
                        <div className='form-check' key={i.id}>
                            <input className='form-check-input'
                                type='checkbox'
                                name={`checkbox_${item.key}_${i.id}`}
                                value={i.text}
                                onChange={(e) => handleChange(e, item)}
                                id={`${item.key}_${i.id}`}
                                required
                            />
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
