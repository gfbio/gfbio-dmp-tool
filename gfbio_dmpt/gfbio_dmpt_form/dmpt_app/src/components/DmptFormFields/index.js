import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './textinput';
import TextArea from './textarea';
import Select from './select';
import Radio from './radio';
import CheckBox from './checkbox';
import PinnableTooltip from './pinnableTooltip';

const getMandatoryMessage = (isOptional, language) => {
    if (isOptional) {
        return <span />;
    }
    if (language?.shortCode === 'DE') {
        return (
            <span className="mandatory">(Dieses Feld ist erforderlich)</span>
        );
    }
    return <span className="mandatory">(This field is mandatory)</span>;
};

function DmptFormFields(props) {
    const { section, handleInputChange, inputs, validationErrors, language } =
        props;
    // TODO: page seems to be in rdmo 2 what quesitionset was in rdmo 1
    //  although questionsets still exist, the import of the gfbio catalog put
    //  everything that was formerly a questionset into a page
    const inputFields = section.pages.map((page) => {
        return (
            <div className="col-12 mb-3" id={`page-${page.id}`}>
                <div className="questionHelp">
                    <h5>{page.title}</h5>
                    <PinnableTooltip helptext={page.help} />
                </div>
                {/*  ------------------------------------------    */}

                {page.pagequestions.map((question) => {

                    const mandatoryMessage = getMandatoryMessage(
                        question.is_optional,
                        language
                    );

                    // This not the best way, but increases readability of data in requests
                    // FIXME: DASS-2204: .key no longer exists in rdmo 2
                    const fieldName = `${question.attribute.key}____${question.id}`;
                    let initialTextValue = '';
                    if (inputs[fieldName] !== undefined) {
                        initialTextValue = inputs[fieldName];
                    }

                    // TODO: add a way to do this for option based fields, like radio, select, checkbox
                    let input = (
                        <TextInput
                            question={question}
                            handleChange={handleInputChange}
                            initialValue={initialTextValue}
                        />
                    );
                    if (question.widget_type === 'textarea') {
                        input = (
                            <TextArea
                                question={question}
                                handleChange={handleInputChange}
                                initialValue={initialTextValue}
                            />
                        );
                    } else if (question.widget_type === 'select') {
                        input = (
                            <Select
                                question={question}
                                handleChange={handleInputChange}
                                inputs={inputs}
                            />
                        );
                    } else if (question.widget_type === 'radio') {
                        input = (
                            <Radio
                                question={question}
                                handleChange={handleInputChange}
                                inputs={inputs}
                            />
                        );
                    } else if (question.widget_type === 'checkbox') {
                        input = (
                            <CheckBox
                                question={question}
                                handleChange={handleInputChange}
                                inputs={inputs}
                            />
                        );
                    }

                    let validationMessage = <span />;

                    // TODO: <09-05-22, claas>
                    //   extract the array into a static variable. These could
                    //   also be passed later from the backend
                    if (
                        ['email', 'url', 'phone', 'integer', 'float'].includes(
                            question.value_type
                        )
                    ) {
                        if (
                            Object.keys(validationErrors).filter((k) =>
                                k.startsWith(question.attribute.key)
                            ).length > 0
                        ) {
                            validationMessage =
                                language?.shortCode === 'DE' ? (
                                    <span className="mandatory">
                                        (kein valider {question.value_type})
                                    </span>
                                ) : (
                                    <span className="mandatory">
                                        (not a valid {question.value_type})
                                    </span>
                                );
                        }
                    }

                    return (
                        <div className="col-12">
                            <label
                                aria-label={question.text}
                                htmlFor="username"
                                className="form-label"
                            >
                                {question.text}
                                <PinnableTooltip helptext={question.help} />
                            </label>
                            {input}
                            <small className="form-text text-muted validation-field ">
                                {mandatoryMessage} {validationMessage}
                            </small>
                        </div>
                    );
                })}

                {/*  ------------------------------------------    */}
            </div>
        );
    });

    return <div className="row g-3">{inputFields}</div>;
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
            }).isRequired,
        }).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    inputs: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    validationErrors: PropTypes.object.isRequired,
    language: PropTypes.object,
};

export default DmptFormFields;
