import React from 'react';

import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

function ActionButton(props) {
    const { text, onClickHandler, align, name, hide } = props;
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
    if (onClickHandler === null) {
        return (
            <Col lg={6} className={colClasses}>
                <button
                    type="submit"
                    name={name}
                    id={name}
                    className={`btn btn-secondary btn-green ${btnClasses}`}
                >
                    {text}
                </button>
            </Col>
        );
    }
    return (
        <Col lg={6} className={colClasses}>
            <button
                type="button"
                name={name}
                id={name}
                className={`btn btn-secondary btn-green ${btnClasses}`}
                onClick={onClickHandler}
            >
                {text}
            </button>
        </Col>
    );
}

ActionButton.propTypes = {
    onClickHandler: PropTypes.func,
    text: PropTypes.string.isRequired,
    align: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hide: PropTypes.bool,
};

ActionButton.defaultProps = {
    onClickHandler: null,
    hide: false,
};

export default ActionButton;
