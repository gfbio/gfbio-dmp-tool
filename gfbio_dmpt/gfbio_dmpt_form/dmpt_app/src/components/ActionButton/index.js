import React from 'react';

import PropTypes from 'prop-types';

function ActionButton(props) {
    const { text, onClickHandler } = props;
    return (
        <div className='col-6'>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button type='submit' className='btn btn-primary'
                onClick={onClickHandler}>
                {text}
            </button>
        </div>
    );
}

ActionButton.propTypes = {
    onClickHandler: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
};

export default ActionButton;

