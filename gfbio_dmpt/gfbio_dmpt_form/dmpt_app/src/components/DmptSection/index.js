import React, {useEffect, useState} from 'react';
import axios from "axios";
import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import {SolarSystemLoading} from "react-loadingg";
import {SECTION_ROOT} from "../../constants/api/api_constants";
import DmptFormFields from "../DmptFormFields";

// TODO: maybe change to adapted section detail view. compare TODO in views.py
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
    }, [sectionIndex]);
    return [processing, section];
};

function DmptSection(props) {
    const {token, catalogId, sectionIndex} = props;
    const [processing, section] = useDmptSection(catalogId, sectionIndex, token);

    console.log('DmptSection | section: ', section);

    if (processing) {
        return (
            <div id="section">
                {/* <h2>DmptSection</h2> */}
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

    return (
        <div id="section">
            <h2>{section.title}</h2>
            <form id={`section-${section.id}`}>
                <DmptFormFields section={section}/>
                <div className="row g-3">
                    <div className="col-12">
                        <button className="w-100 btn btn-secondary btn-green" type="submit">Continue</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

DmptSection.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    sectionIndex: PropTypes.number.isRequired,
};

export default DmptSection;
