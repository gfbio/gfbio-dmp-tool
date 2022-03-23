import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, { markFormFieldMandatory } from '../../utils/form_utils';

function FormTextArea(props) {
    const { item, value, handleChange, inputs } = props;
    const rdmoContext = useContext(RdmoContext);

    const val = formFieldInit(value, rdmoContext, item);
    const { headerText, helpText } = markFormFieldMandatory(item);

    let inputField = (<textarea
        name={item.key}
        id={item.key}
        className='form-control'
        rows='3'
        onChange={(e) => handleChange(e, item)}
        // onChange={handleChange}
        required
    >
        {val}
    </textarea>);

    if (item.is_optional) {
        inputField = (<textarea
            name={item.key}
            id={item.key}
            className='form-control'
            rows='3'
            onChange={(e) => handleChange(e, item)}
            // onChange={handleChange}
        >
            {val}
        </textarea>);
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

FormTextArea.defaultProps = {
    value: ''
};

FormTextArea.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
};

export default FormTextArea;
