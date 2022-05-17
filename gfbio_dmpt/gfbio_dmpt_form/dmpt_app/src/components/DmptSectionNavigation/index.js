import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Sticky from 'react-stickynode';
import { SECTIONS_ROOT, URL_PREFIX } from '../api/constants';
import DmptLoading from '../DmptLoading';
import DmptSection from '../DmptSection';
import useDmptSectionForm from '../DmptHooks/formHooks';
import SectionButtons from './sectionButtons';
import DmptSummary from '../DmptSummary';
import DmptList from '../DmptList';
import { Redirect } from 'react-router-dom';

const useDmptSectionNavigation = (catalogId, token) => {
    const [processing, setProcessing] = useState(true);
    const [sectionList, setSectionList] = useState([]);
    useEffect(() => {
        async function prepareDmptSectionList() {
            setProcessing(true);
            try {
                const result = await axios.get(
                    `${SECTIONS_ROOT}${catalogId}/`,
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
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

const fakeSubmit = () => {
    console.log('DmptSectionNavigation | fakeSubmit | inputs: ');
};

const sectionsAsListElements = (sectionList, sectionIndex, handleClick) => {
    const maxLength = 25;
    return sectionList.map((section, index) => {
        let { title } = section;
        if (title.length > maxLength) {
            title = `${section.title.substring(0, maxLength)}...`;
        }

        let link = (
            <button
                className="btn btn-link nav-link"
                type="button"
                onClick={() => handleClick(index)}
            >
                {`${index + 1}. ${title}`}
            </button>
        );
        if (index === sectionIndex) {
            link = (
                <button className="btn btn-link nav-link active" type="button">
                    {`${index + 1}. ${title}`}
                </button>
            );
        }
        return <li className="nav-item">{link}</li>;
    });
};

function DmptSectionNavigation(props) {
    const { catalogId, token, dmptProjectData } = props;
    const dmptProjectId = dmptProjectData.id;

    const [processing, sectionList] = useDmptSectionNavigation(
        catalogId,
        token
    );
    const [sectionIndex, setSectionIndex] = useState(0);
    const [rdmoProjectId, setRdmoProjectId] = useState(-1);
    const [updateResponseStatus, setUpdateResponseStatus] = useState(0);

    const {
        inputs,
        handleInputChange,
        handleSubmit,
        validationErrors,
        disabledNavigation,
    } = useDmptSectionForm(fakeSubmit, dmptProjectData.form_data);

    const sections = sectionsAsListElements(
        sectionList,
        sectionIndex,
        setSectionIndex
    );
    const sectionsLength = sectionList.length;

    // console.log(
    //     `DmptSectionNavigation | useDmptSectionNavigation | processing: ${processing} | section list length: ${sectionsLength} | index: `,
    //     sectionIndex,
    //     '| dmptProjectId ',
    //     dmptProjectId,
    //     ' | dmptProjectData: ',
    //     dmptProjectData
    // );

    if (processing) {
        return <DmptLoading />;
    }

    // TODO: this is not working properly ...
    if (updateResponseStatus > 0) {
        return <DmptList token={token}  updateStatusCode={updateResponseStatus}/>;
    }
    // TODO: maybe add a dedicated loading animation for projectPosts if requests taka too long
    if (rdmoProjectId > 0) {
        return <DmptSummary rdmoProjectId={rdmoProjectId} />;
    }

    return (
        <div id="section-navigation">
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs sub-navi">{sections}</ul>
                </div>
            </div>

            <div className="row" id="section-wrapper-row">
                <div className="col-3 pt-2" id="section-sub-navi">
                    <Sticky top={80}>
                        <div className="row">
                            <SectionButtons
                                sectionIndex={sectionIndex}
                                sectionsLength={sectionsLength}
                                setSectionIndex={setSectionIndex}
                                postCallBack={setRdmoProjectId}
                                putCallBack={setUpdateResponseStatus}
                                token={token}
                                catalogId={catalogId}
                                inputs={inputs}
                                validationErrors={validationErrors}
                                disabled={disabledNavigation}
                                dmptProjectId={dmptProjectId}
                            />
                        </div>
                    </Sticky>
                </div>

                <div className="col-9" id="section-content">
                    <div className="row">
                        <div className="col-12">
                            <DmptSection
                                token={token}
                                catalogId={catalogId}
                                sectionIndex={sectionIndex}
                                handleInputChange={handleInputChange}
                                handleSubmit={handleSubmit}
                                inputs={inputs}
                                validationErrors={validationErrors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <SectionButtons
                            sectionIndex={sectionIndex}
                            sectionsLength={sectionsLength}
                            setSectionIndex={setSectionIndex}
                            postCallBack={setRdmoProjectId}
                            putCallBack={setUpdateResponseStatus}
                            token={token}
                            catalogId={catalogId}
                            inputs={inputs}
                            disabled={disabledNavigation}
                            dmptProjectId={dmptProjectId}
                        />
                    </div>
                </div>
            </div>
            {/* end wrapper row */}
        </div>
    );
}

DmptSectionNavigation.defaultProps = {
    dmptProjectData: { form_data: {}, id: -1 },
};

DmptSectionNavigation.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    dmptProjectData: PropTypes.shape({
        form_data: PropTypes.shape({}),
        id: PropTypes.number,
    }),
};

export default DmptSectionNavigation;
