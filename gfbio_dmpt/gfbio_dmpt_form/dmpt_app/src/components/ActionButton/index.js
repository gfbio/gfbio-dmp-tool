import React from 'react';

import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

function ActionButton(props) {
    const { text, onClickHandler, align} = props;
    let colClasses = "";
    let btnClasses = ""
    if (align === "left") {
        colClasses = "ps-4";
    }
    else if (align === "right") {
        colClasses = "pe-4";
        btnClasses = " float-end";
    }
    return (
        <Col lg={6} className={colClasses}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button type='submit' className={`btn btn-secondary btn-green${btnClasses}`}
                onClick={onClickHandler}>
                {text}
            </button>
        </Col>
    );
}

ActionButton.propTypes = {
    onClickHandler: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    align: PropTypes.string.isRequired
};

export default ActionButton;

