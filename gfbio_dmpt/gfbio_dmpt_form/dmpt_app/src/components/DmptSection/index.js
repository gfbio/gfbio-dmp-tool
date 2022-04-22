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
        return (
            <div className="col-12 mb-3" id={`questionset-${questionset.id}`}>
                <h5>{questionset.title}</h5>
                {
                    questionset.questions.map((question, questionIndex) => {
                        let mandatoryMessage = <span className="mandatory">(This field is mandatory)</span>;

                        // GENERIC/TEXT -----------------------------------------------------------
                        let input = <input type="text" className="form-control" id={`question-${question.id}`}
                            name={question.key}/>;
                        // GENERIC/TEXT -----------------------------------------------------------

                        // TEXTAREA -----------------------------------------------------------
                        if (question.widget_type === "textarea") {
                            input = <textarea
                                className="form-control"
                                id={`question-${question.id}`}
                                name={question.key}
                                rows="3"
                            />;
                        }
                        // TEXTAREA -----------------------------------------------------------

                        // SELECT  -----------------------------------------------------------
                        else if (question.widget_type === "select") {
                            const optionSetFields = question.optionsets.map((optionSet) => {
                                const optionSetOptions = optionSet.options.map((optionSetOption) => {
                                    return (<option className="form-control"
                                        id={`option-${optionSetOption.id}`}
                                        name={optionSetOption.key}>
                                        {optionSetOption.text}
                                    </option>);
                                });
                                return (
                                    <select className="form-control" id={`optionset-${optionSet.id}`}
                                        name={optionSet.key}>
                                        {optionSetOptions}
                                    </select>
                                );
                            });
                            input = (<div id={`question-${question.id}`} name={question.key}>{optionSetFields}</div>);
                        }
                        // SELECT  -----------------------------------------------------------

                        if (question.is_optional) {
                            mandatoryMessage = <span/>;
                        }
                        return (
                            <div className="col-12">
                                <label aria-label={question.text} htmlFor="username"
                                    className="form-label">
                                    {question.text}
                                </label>
                                {
                                    input
                                }
                                <small className="form-text text-muted">{question.help} {mandatoryMessage}</small>
                            </div>
                        );
                    })
                }

            </div>
        );
    });
    // --------------------------------------------------------------------------------------

    return (
        <div id="section">
            <h2>{section.title}</h2>
            <form id={`section-${section.id}`}>
                <div className="row g-3">
                    {inputFields}
                </div>
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
};

export default DmptSection;
