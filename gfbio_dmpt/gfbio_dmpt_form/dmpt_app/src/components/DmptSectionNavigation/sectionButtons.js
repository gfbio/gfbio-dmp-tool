import React from 'react';
import PropTypes from 'prop-types';
import postProject, { putProject } from "../api/formdata";

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

const submitProjectData = (token, catalogId, inputs, postCallBack, putCallBack, dmptProjectId) => {
    console.log('submitHandler | inputs ', inputs);

    if (dmptProjectId > -1) {
        console.log('submitHandler | put ..... ');
        putProject(token, dmptProjectId, inputs).then((res) => {
            console.log('submitHandler | put res:  ', res);
            putCallBack(res.status);
            // TODO: second callback for updates ?
        });
    }
    else {
        console.log('submitHandler | post ..... ');
        postProject(token, catalogId, inputs).then((res) => {
            console.log('submitHandler | post res:  ', res);
            postCallBack(res.rdmoProjectId);
            // TODO: rename if second callback added
        });
    }
};

function SectionButtons(props) {
    const {
        sectionIndex,
        sectionsLength,
        setSectionIndex,
        postCallBack,
        putCallBack,
        token,
        catalogId,
        inputs,
        disabled,
        dmptProjectId,
    } = props;

    const submitText = dmptProjectId < 0 ? "Finalize DMP" : "Update DMP";

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
                    submitProjectData(token, catalogId, inputs, postCallBack, putCallBack, dmptProjectId)
                }
            >
                <h6
                    className={`sidebar-list-item ${
                        disabled ? 'text-muted' : ''
                    }`}
                >
                    <i className="mdi mdi-chevron-double-right align-middle right" />
                    <br /> {submitText}
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

SectionButtons.defaultProps = {
    dmptProjectId: -1,
};

SectionButtons.propTypes = {
    sectionIndex: PropTypes.number.isRequired,
    sectionsLength: PropTypes.number.isRequired,
    setSectionIndex: PropTypes.func.isRequired,
    postCallBack: PropTypes.func.isRequired,
    putCallBack: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    dmptProjectId: PropTypes.number,
};

export default SectionButtons;
