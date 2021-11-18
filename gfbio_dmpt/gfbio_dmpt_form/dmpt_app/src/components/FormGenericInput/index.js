import React, { useContext } from 'react';
import RdmoContext from '../RdmoContext';
import PropTypes from 'prop-types';

function FormGenericInput(props) {
    const { item, value, handleChange } = props;
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
            <input
                type={item.widget_type}
                className='form-control'
                name={item.key}
                id={item.key}
                onChange={(e) => handleChange(e, item)}
                // FIXME: quick and dirty see above
                value={val}
            />
            <small id={`help_${item.key}`}
                   className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

FormGenericInput.defaultProps = {
    value: '',
};

FormGenericInput.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired

};

export default FormGenericInput;
