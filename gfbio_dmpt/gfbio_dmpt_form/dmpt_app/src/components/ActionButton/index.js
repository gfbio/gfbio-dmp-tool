import React from 'react';

import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

function ActionButton(props) {
    const { text, onClickHandler, align, hide } = props;
    let colClasses = '';
    let btnClasses = '';
    if (align === 'left') {
        colClasses = 'ps-4';
    } else if (align === 'right') {
        colClasses = 'pe-4';
        btnClasses = 'float-end';
    }

    // this can be used to hide a button (e.g. on the first page of)
    // the dmp where the back button is non functional
    if (hide === true) {
        btnClasses = btnClasses.concat(' d-none');
    }

    return (
        <Col lg={6} className={colClasses}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
                type="submit"
                className={`btn btn-secondary btn-green ${btnClasses}`}
                // onClick={onClickHandler}
            >
                {text}
            </button>
        </Col>
    );
}

ActionButton.propTypes = {
    onClickHandler: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    align: PropTypes.string.isRequired,
    hide: PropTypes.bool,
};

ActionButton.defaultProps = {
    hide: false,
};

export default ActionButton;
