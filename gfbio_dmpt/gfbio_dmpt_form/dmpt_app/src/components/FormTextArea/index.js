import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, { markFormFieldMandatory } from '../../utils/form_utils';

function FormTextArea(props) {
    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);

    console.log('FormTextArea | value: ', value);

    const val = formFieldInit(value, rdmoContext, item);
    console.log('val ', val);
    const { headerText, helpText } = markFormFieldMandatory(item);
    // {item.is_optional ? "" : "required"}
    return (
        <div className="form-group" key={item.id}>
            <label htmlFor={item.key}>
                {headerText}
                {helpText}
            </label>
            <textarea
                name={item.key}
                id={item.key}
                className="form-control"
                rows="3"
                onChange={(e) => handleChange(e, item, value.id)}
            >
                {val}
            </textarea>
        </div>
    );
}

FormTextArea.defaultProps = {
    value: '',
};

FormTextArea.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
};

export default FormTextArea;
