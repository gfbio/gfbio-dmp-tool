import React, { useState } from 'react';
import PropTypes from 'prop-types';
import postProject from '../api/formdata';

const continueHandler = (val, maxVal, valHandler) => {
    if (val < maxVal - 1) {
        valHandler(val + 1);
    }
};

const backHandler = (val, valHandler) => {
    if (val - 1 >= 0) {
        valHandler(val - 1);
    }
};

// const submitHandler = (token, catalogId, inputs) => {
//     console.log('submitHandler | inputs ', inputs);
//     console.log('submitHandler | post ..... ');
//     postProject(token, catalogId, inputs).then((res) => {
//         console.log('submitHandler | post res:  ', res);
//     });
// };

const submitProjectData = (token, catalogId, inputs, callBack) => {
    console.log('submitHandler | inputs ', inputs);
    console.log('submitHandler | post ..... ');
    postProject(token, catalogId, inputs).then((res) => {
        console.log('submitHandler | post res:  ', res);
        callBack(res.rdmoProjectId);
    });
};

function SectionButtons(props) {
    const {
        sectionIndex,
        sectionsLength,
        setSectionIndex,
        callBack,
        token,
        catalogId,
        inputs,
        disabled,
    } = props;

    let continueButton = (
        <button
            type="button"
            className={`list-group-item list-group-item-action text-end ${
                disabled ? 'disabled' : ''
            }`}
            onClick={() =>
                continueHandler(sectionIndex, sectionsLength, setSectionIndex)
            }
        >
            <h6 className={`sidebar-list-item ${disabled ? 'text-muted' : ''}`}>
                <i className="mdi mdi-chevron-double-right align-middle right" />
                <br /> Next Section
            </h6>
        </button>
    );
    if (sectionIndex === sectionsLength - 1) {
        continueButton = (
            <button
                type="button"
                className={`list-group-item list-group-item-action text-end ${
                    disabled ? 'disabled' : ''
                }`}
                onClick={() =>
                    submitProjectData(token, catalogId, inputs, callBack)
                }
            >
                <h6
                    className={`sidebar-list-item ${
                        disabled ? 'text-muted' : ''
                    }`}
                >
                    <i className="mdi mdi-chevron-double-right align-middle right" />
                    <br /> Submit Plan
                </h6>
            </button>
        );
    }

    return (
        <div className="list-group list-group-flush list-group-horizontal mt-5">
            <button
                type="button"
                className={`list-group-item list-group-item-action text-start ${
                    disabled ? 'disabled' : ''
                }`}
                onClick={() => backHandler(sectionIndex, setSectionIndex)}
            >
                <h6
                    className={`sidebar-list-item ${
                        disabled ? 'text-muted' : ''
                    }`}
                >
                    <i className="mdi mdi-chevron-double-left align-middle" />
                    <br />
                    Previous Section
                </h6>
            </button>
            {continueButton}
        </div>
    );
}

SectionButtons.propTypes = {
    sectionIndex: PropTypes.number.isRequired,
    sectionsLength: PropTypes.number.isRequired,
    setSectionIndex: PropTypes.func.isRequired,
    callBack: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default SectionButtons;
