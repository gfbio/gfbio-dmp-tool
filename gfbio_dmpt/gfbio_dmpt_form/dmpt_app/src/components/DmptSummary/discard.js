import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { URL_PREFIX } from '../api/constants';

function DiscardAndExit(props) {
    const { resetRdmoProjectId } = props;
    const [confirm, setConfirm] = useState(false);
    const [discard, setDiscard] = useState(false);
    const history = useHistory();

    if (discard) {
        resetRdmoProjectId(-1);
        history.push(`${URL_PREFIX}`);
    }

    let button = (
        <button
            type="button"
            className="list-group-item list-group-item-action "
            onClick={() => setConfirm(true)}
        >
            <h6 className="sidebar-list-item">
                <i className="mdi mdi-trash-can-outline align-middle" />
                Discard & Exit
            </h6>
        </button>
    );

    if (confirm) {
        button = (
            <div>
                <h6 className="sidebar-list-item">
                    <i className="mdi mdi-trash-can-outline align-middle" />
                    Discard & Exit
                </h6>
                <div className="d-grid gap-2 d-md-block">
                    <h6>Are you sure?</h6>
                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => setConfirm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={() => setDiscard(true)}
                    >
                        Confirm!
                    </button>
                </div>
            </div>
        );
    }

    return <>{button}</>;
}

DiscardAndExit.propTypes = {
    resetRdmoProjectId: PropTypes.func.isRequired,
};

export default DiscardAndExit;
