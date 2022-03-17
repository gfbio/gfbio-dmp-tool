import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit from '../../utils/form_utils';

function FormTextArea(props) {
    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    const val = formFieldInit(value, rdmoContext, item);
    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <h5>{item.text_en}</h5>
                <small id={`help_${item.key}`}
                    className='form-text text-muted'>
                    {item.help_en}
                </small>
            </label>
            <textarea name={item.key} id={item.key} className='form-control'
                rows='3' onChange={(e) => handleChange(e, item)}>
                {val}
            </textarea>

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
    handleChange: PropTypes.func.isRequired
};

export default FormTextArea;
