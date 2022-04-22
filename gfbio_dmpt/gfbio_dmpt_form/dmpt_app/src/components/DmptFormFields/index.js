import React from 'react';
import PropTypes from "prop-types";
import TextInput from "./textinput";
import Textarea from "./textarea";
import Select from "./select";
import Radio from "./radio";
import CheckBox from "./checkbox";

function DmptFormFields(props) {
    const {section} = props;
    const inputFields = section.questionsets.map((questionset) => {
        return (
            <div className="col-12 mb-3" id={`questionset-${questionset.id}`}>
                <h5>{questionset.title}</h5>
                {
                    questionset.questions.map((question) => {

                        let mandatoryMessage = <span className="mandatory">(This field is mandatory)</span>;
                        if (question.is_optional) {
                            mandatoryMessage = <span/>;
                        }

                        let input = <TextInput question={question}/>;
                        if (question.widget_type === "textarea") {
                            input = <Textarea question={question}/>;
                        } else if (question.widget_type === "select") {
                            input = <Select question={question}/>;
                        } else if (question.widget_type === "radio") {
                            input = <Radio question={question}/>;
                        } else if (question.widget_type === "checkbox") {
                            input = <CheckBox question={question}/>;
                        }

                        return (
                            <div className="col-12">
                                <label aria-label={question.text} htmlFor="username"
                                    className="form-label">
                                    {question.text}
                                </label>
                                {input}
                                <small className="form-text text-muted">{question.help} {mandatoryMessage}</small>
                            </div>
                        );
                    })
                }

            </div>
        );
    });
    return (
        <div className="row g-3">
            {inputFields}
        </div>
    );
}

DmptFormFields.propTypes = {
    section: PropTypes.shape({
        questionsets: PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            map: PropTypes.func.isRequired,
            questions: PropTypes.shape({
                is_optional: PropTypes.bool.isRequired,
                widget_type: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
                help: PropTypes.string,
            }).isRequired
        }).isRequired,
    }).isRequired,
};

export default DmptFormFields;
