import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { SolarSystemLoading } from 'react-loadingg';
import { SECTION_ROOT } from '../api/constants';
import DmptFormFields from '../DmptFormFields';

// TODO: maybe change to adapted section detail view. compare TODO in views.py
const useDmptSection = (catalogId, sectionIndex, token, language) => {
    const [processing, setProcessing] = useState(true);
    const [section, setSection] = useState({});

    useEffect(() => {
        async function prepareDmptSection() {
            setProcessing(true);
            console.log('\n\n+++++++++++++++++++++ DmptSection | index.js | useDMptSetcion | prepareDmptSection | sectionIndex: ', sectionIndex);
            try {
                const result = await axios.get(
                    `${SECTION_ROOT}${catalogId}/${sectionIndex}`,
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        },
                    }
                );
                console.log('result.data ');
                console.log(result.data);
                setSection(result.data);
                console.log('+++++++++++++++++++++++++++++++++++++++++\n\n');
                setProcessing(false);
                window.scrollTo({top:0, behavior:"smooth"});
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptSection();
    }, [sectionIndex, language]); // though language is not used directly, a change there means a change in cookies the request uses.
    return [processing, section];
};

function DmptSection(props) {
    const {
        token,
        catalogId,
        sectionIndex,
        handleInputChange,
        handleSubmit,
        inputs,
        validationErrors,
        language,
    } = props;
    const [processing, section] = useDmptSection(
        catalogId,
        sectionIndex,
        token,
        language
    );

    if (processing) {
        return (
            <div id="section">
                <Row>
                    <Col lg={12}>
                        <SolarSystemLoading
                            color="#345AA2"
                            size="large"
                            speed={8}
                        >
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
            <form id={`form-section-${sectionIndex}`} onSubmit={handleSubmit}>
                <DmptFormFields
                    section={section}
                    handleInputChange={handleInputChange}
                    inputs={inputs}
                    validationErrors={validationErrors}
                    language={language}
                />
            </form>
        </div>
    );
}

DmptSection.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
    sectionIndex: PropTypes.number.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    validationErrors: PropTypes.object.isRequired,
    language: PropTypes.object
};

export default DmptSection;
