import React, {useContext} from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, {markFormFieldMandatory} from '../../utils/form_utils';

function FormRadio(props) {
    const {item, options, value, handleChange} = props;
    const rdmoContext = useContext(RdmoContext);

    const val = formFieldInit(value, rdmoContext, item);
    const {headerText, helpText} = markFormFieldMandatory(item);

    let inputField = (
        <>
            {
                options.map((i) => {
                    if (i.text === val) {
                        return (
                            <div className='form-check' key={i.id}>
                                <input className='form-check-input'
                                    type='radio'
                                    name={item.key}
                                    id={`${item.key}_${i.id}`}
                                    value={i.text}
                                    onChange={(e) => handleChange(e, item)}
                                    checked
                                    required
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
                                name={item.key}
                                id={`${item.key}_${i.id}`}
                                value={i.text}
                                onChange={(e) => handleChange(e, item)}
                                required
                            />
                            <label className='form-check-label'
                                htmlFor={`${item.key}_${i.id}`}>
                                {i.text}
                            </label>
                        </div>
                    );
                })
            }
        </>
    );
    if (item.is_optional) {
        inputField = (
            <>
                {
                    options.map((i) => {
                        if (i.text === val) {
                            return (
                                <div className='form-check' key={i.id}>
                                    <input className='form-check-input'
                                        type='radio'
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
            </>
        );
    }

    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                {headerText}
                {helpText}
            </label>
            {inputField}
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
