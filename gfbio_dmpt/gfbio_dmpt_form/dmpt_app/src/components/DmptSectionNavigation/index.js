import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import {SECTIONS_ROOT} from "../../constants/api/api_constants";
import DmptLoading from "../DmptLoading";

const useDmptSectionNavigation = (catalogId, token) => {
    const [processing, setProcessing] = useState(true);
    const [sectionList, setSectionList] = useState([]);
    useEffect(() => {
        async function prepareDmptSectionList() {
            try {
                const result = await axios.get(`${SECTIONS_ROOT}${catalogId}/`, {
                    headers: {Authorization: `Token ${token}`},
                },);
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

const sectionsAsListElements = (sectionList, sectionIndex, handleClick) => {
    const maxLength = 25;
    return sectionList.map((section, index) => {

        let {title} = section;
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

function DmptSectionNavigation(props) {
    const {catalogId, token} = props;

    // TODO: - url ohne section no. = load sections and init with section no 0 ?
    //       - url mit section no. = no load of all sections just load/init section no. 0-n ?
    //       - besser load all sections, fill navi, change state (section no) onclick, init section
    // TODO: add url routes

    const [processing, sectionList] = useDmptSectionNavigation(catalogId, token);
    const [sectionIndex, setSectionIndex] = useState(0);

    const sections = sectionsAsListElements(sectionList, sectionIndex, setSectionIndex);

    console.log(`DmptSectionNavigation | useDmptSectionNavigation | processing: ${processing} | list: `, sectionList);

    if (processing) {
        return (
            <DmptLoading/>
        );
    }

    return (
        <div id="section-navigation">
            <h2>{sectionIndex}</h2>
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs sub-navi">
                        {sections}
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <h1>{sectionList[sectionIndex].title}</h1>
                </div>
            </div>
        </div>
    );
}

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired, catalogId: PropTypes.number.isRequired,
};

export default DmptSectionNavigation;
