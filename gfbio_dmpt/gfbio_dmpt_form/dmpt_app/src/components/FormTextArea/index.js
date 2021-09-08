import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';

function FormTextArea(props) {

    const { item, handleChange } = props;
    const rdmoContext = useContext(RdmoContext);
    console.log('FORM TEXT AREA ');
    console.log(item.key);

    let elem = (<textarea name={item.key} id={item.key} className='form-control'
        rows='3' onChange={handleChange} />);
    if (item.key in rdmoContext.form_data) {
        elem = (<textarea name={item.key} id={item.key} className='form-control'
            rows='3' onChange={handleChange} value={rdmoContext.form_data[item.key]} />);
    }

    return (
        <div className='form-group' key={item.id}>
            <label htmlFor={item.key}>
                <i>{item.id}</i>:{item.text_en}
            </label>
            {/* <textarea name={item.key} id={item.key} className='form-control' */}
            {/*    rows='3' onChange={handleChange} /> */}
            {elem}
            <small id={`help_${item.key}`}
                className='form-text text-muted'>
                {item.help_en}
            </small>
        </div>
    );
}

// FormTextArea.defaultProps = {
//     initialValue: '',
// };

FormTextArea.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
    // initialValue: PropTypes.string,
};

export default FormTextArea;
