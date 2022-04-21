import React, {useEffect, useState} from 'react';
import axios from "axios";
import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import {SolarSystemLoading} from "react-loadingg";
import {SECTION_ROOT} from "../../constants/api/api_constants";

const useDmptSection = (catalogId, sectionIndex, token) => {
    const [processing, setProcessing] = useState(true);
    const [section, setSection] = useState({});
    useEffect(() => {
        async function prepareDmptSection() {
            setProcessing(true);
            try {
                const result = await axios.get(
                    `${SECTION_ROOT}${catalogId}/${sectionIndex}`,
                    {
                        headers: {Authorization: `Token ${token}`},
                    },
                );
                setSection(result.data);
                setProcessing(false);
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptSection();
    }, []);
    return [processing, section];
};

function DmptSection(props) {
    const {catalogId, token} = props;
    // TODO: as prop for this component when accessing section/tab wise
    const sectionIndex = 0;
    const [processing, section] = useDmptSection(catalogId, sectionIndex, token);
    console.log('DmptSection | section: ', section);

    if (processing) {
        return (
            <div id="section">
                <h2>DmptSection</h2>
                <Row>
                    <Col lg={12}>
                        <SolarSystemLoading color="#345AA2" size="large" speed={8}>
                            Loading
                        </SolarSystemLoading>
                    </Col>
                </Row>
            </div>
        );
    }

    // TODO: most probably this will be moved to a dedicated function once complete ---------
    const inputFields = section.questionsets.map((questionset, index) => {
        return (<h5 id={`questionset-${index}`}>{questionset.title}</h5>);
    });
    // --------------------------------------------------------------------------------------

    return (
        <div id="section">
            <h2>{section.title}</h2>
            <form id={`section-${section.id}`}>
                {inputFields}
            </form>
        </div>
    );
}

DmptSection.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
};

export default DmptSection;
