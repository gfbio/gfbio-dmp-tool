import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit from '../../utils/form_utils';

function FormTextArea(props) {
    const { item, value, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    const val = formFieldInit(value, rdmoContext, item);

    // TODO: alternatively add a icon (or keep the asterisk) and add a small tooltip stating "mandatory field".
    let headerText = (<h5>{item.text_en} <b>*</b></h5>);

    let helpText = '(This field is mandatory)';
    if (item.help_en) {
        helpText = `${item.help_en} (This field is mandatory)`;
    }

    let inputField = (<textarea
        name={item.key}
        id={item.key}
        className='form-control'
        rows='3'
        onChange={(e) => handleChange(e, item)}
        required
    >
        {val}
    </textarea>);

    if (item.is_optional) {
        headerText = (<h5>{item.text_en}</h5>);
        helpText = item.help_en;
        inputField = (<textarea
            name={item.key}
            id={item.key}
            className='form-control'
            rows='3'
            onChange={(e) => handleChange(e, item)}
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
    handleChange: PropTypes.func.isRequired
};

export default FormTextArea;
