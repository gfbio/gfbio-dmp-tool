import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Sticky from "react-stickynode";
import { SECTIONS_ROOT } from "../../constants/api/api_constants";
import DmptLoading from "../DmptLoading";
import DmptSection from "../DmptSection";
import useDmptSectionForm from "../DmptHooks/formHooks";

const useDmptSectionNavigation = (catalogId, token) => {
    const [processing, setProcessing] = useState(true);
    const [sectionList, setSectionList] = useState([]);
    useEffect(() => {
        async function prepareDmptSectionList() {
            try {
                const result = await axios.get(`${SECTIONS_ROOT}${catalogId}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setSectionList(result.data);
                setProcessing(false);
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptSectionList();
    }, []);
    return [processing, sectionList];
};

// const sectionClickHandler = (index) => {
//     console.log('DmptSectionNavigation | sectionClickHandler | index: ', index);
// };

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

const sectionsAsListElements = (sectionList, sectionIndex, handleClick) => {
    const maxLength = 25;
    return sectionList.map((section, index) => {

        let { title } = section;
        if (title.length > maxLength) {
            title = `${section.title.substring(0, maxLength)}...`;
        }

        let link = (<button className="btn btn-link nav-link" type="button" onClick={() => handleClick(index)}>
            {`${index + 1}. ${title}`}
        </button>);
        if (index === sectionIndex) {
            link = (<button className="btn btn-link nav-link active" type="button">
                {`${index + 1}. ${title}`}
            </button>);
        }
        return (<li className="nav-item">
            {link}
        </li>);
    });
};

const fakeSubmit = () => {
    console.log("DmptSectionNavigation | fakeSubmit | inputs: ", inputs);
};

function DmptSectionNavigation(props) {
    const { catalogId, token } = props;

    const [processing, sectionList] = useDmptSectionNavigation(catalogId, token);
    const [sectionIndex, setSectionIndex] = useState(0);

    const { inputs, handleInputChange, handleSubmit } = useDmptSectionForm(fakeSubmit);

    const sections = sectionsAsListElements(sectionList, sectionIndex, setSectionIndex);
    const sectionsLength = sectionList.length;

    console.log(`DmptSectionNavigation | useDmptSectionNavigation | processing: ${processing} | section list length: ${sectionsLength} | list: `, sectionList);

    if (processing) {
        return (
            <DmptLoading />
        );
    }

    // TODO: wrap sidebar and tabnavi+section in extra compoment if needed.
    return (
        <div id="section-navigation">
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs sub-navi">
                        {sections}
                    </ul>
                </div>
            </div>

            <div className="row" id="section-wrapper-row">

                <div className="col-3" id="section-sub-navi">
                    <Sticky top={80}>
                        <div className="list-group">
                            <button type="button" className="list-group-item list-group-item-action active"
                                aria-current="true">
                                The current button
                            </button>
                            <button type="button" className="list-group-item list-group-item-action">A second item
                            </button>
                            <button type="button" className="list-group-item list-group-item-action">A third button
                                item
                            </button>
                            <button type="button" className="list-group-item list-group-item-action">A fourth button
                                item
                            </button>
                            <button type="button" className="list-group-item list-group-item-action" disabled>A disabled
                                button item
                            </button>
                        </div>
                    </Sticky>
                </div>

                <div className="col-9" id="section-content">
                    <div className="row">
                        <div className="col-12">
                            <DmptSection token={token} catalogId={catalogId} sectionIndex={sectionIndex}
                                handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 ps-4">
                            <button className="btn btn-secondary btn-green"
                                type="button" onClick={() => backHandler(sectionIndex, setSectionIndex)}
                            >Back
                            </button>
                        </div>
                        <div className="col-6 pe-4">
                            <button
                                className="btn btn-secondary btn-green float-end"
                                type="button"
                                onClick={() => continueHandler(sectionIndex, sectionsLength, setSectionIndex)}
                            >Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired, catalogId: PropTypes.number.isRequired
};

export default DmptSectionNavigation;
