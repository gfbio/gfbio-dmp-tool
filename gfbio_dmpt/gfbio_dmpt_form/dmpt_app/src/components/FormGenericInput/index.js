import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, { markFormFieldMandatory } from '../../utils/form_utils';

function FormGenericInput(props) {
    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);

    const val = formFieldInit(value, rdmoContext, item);
    const { headerText, helpText } = markFormFieldMandatory(item);

    const inputField = (<input
        type={item.widget_type}
        className='form-control'
        name={item.key}
        id={item.key}
        onChange={(e) => handleChange(e, item)}
        value={val}
        required
    />);
    if (item.is_optional) {
        const inputField = (<input
            type={item.widget_type}
            className='form-control'
            name={item.key}
            id={item.key}
            onChange={(e) => handleChange(e, item)}
            value={val}
        />);
    }

    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                {headerText}
                <small id={`help_${item.key}`}
                    className='form-text text-muted'>
                    {helpText}
                </small>
            </label>
            {inputField}

        </div>
    );
}

FormGenericInput.defaultProps = {
    value: ''
};

FormGenericInput.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired

};

export default FormGenericInput;
