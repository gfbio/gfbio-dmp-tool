import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { URL_PREFIX } from "../api/constants";

function DiscardAndExit() {
    const [confirm, setConfirm] = useState(false);
    const [discard, setDiscard] = useState(false);
    const history = useHistory();

    if (discard) {
        history.push(`${URL_PREFIX}new`);
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
                <h5>Are you sure ?</h5>
                <h6 className="sidebar-list-item">
                    <i className="mdi mdi-trash-can-outline align-middle" />
                    Discard & Exit
                </h6>
                <div className="d-grid gap-2 d-md-block">
                    <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={() => setConfirm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => setDiscard(true)}
                    >
                        Confirm !
                    </button>
                </div>
            </div>
        );
    }

    return <>{button}</>;
}

export default DiscardAndExit;
