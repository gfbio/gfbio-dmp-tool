import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from './textinput';
import TextArea from './textarea';
import Select from './select';
import Radio from './radio';
import CheckBox from './checkbox';
import AutoComplete from './autocomplete'
import PinnableTooltip from './pinnableTooltip';
import getMandatoryMessage from './getMandatoryMessage';
import getHiddenPageIdsFromConditionals from './getHiddenPageIdsFromConditionals';
import getVisiblePageIdsFromInputData from './getVisiblePageIdsFromInputData';
import { Collapse } from '@material-ui/core';

function DmptFormFields(props) {
    const { section, handleInputChange, inputs, validationErrors, language } =
        props;

    // TODO: page seems to be in rdmo 2 what quesitionset was in rdmo 1
    //  although questionsets still exist, the import of the gfbio catalog put
    //  everything that was formerly a questionset into a page

    const [hiddenPageIds, setHiddenPageIds] = useState(
        getHiddenPageIdsFromConditionals(section, inputs, true)
    );

    const [initialHiddenPageIds, setInitialHiddenPageIds] = useState(
        getHiddenPageIdsFromConditionals(section, inputs, false)
    );

    const setPageVisibility = (condition, questionAttributeKey, optionId) => {
        if (
            condition.source_key === questionAttributeKey &&
            condition.target_option_id === optionId
        ) {
            const ids = hiddenPageIds;
            condition.elements.forEach((element) => {
                ids.splice(ids.indexOf(element.page_id), 1);
                const visibleAccordingToInputValues =
                    getVisiblePageIdsFromInputData(ids, section, inputs);
                visibleAccordingToInputValues.forEach((remove) => {
                    ids.splice(ids.indexOf(remove), 1);
                });
            });
            setHiddenPageIds(ids);
        } else if (
            condition.source_key === questionAttributeKey &&
            condition.target_option_id !== optionId
        ) {
            let ids = hiddenPageIds;
            condition.elements.forEach((element) => {
                if (!ids.includes(element.page_id)) {
                    ids = initialHiddenPageIds.slice(
                        initialHiddenPageIds.indexOf(element.page_id),
                        initialHiddenPageIds.length
                    );
                }
            });
            setHiddenPageIds(ids);
        }
    };

    const ExtendedHandleInputChange = (e, optionId, questionAttributeKey) => {
        handleInputChange(e);
        section.conditions.forEach((condition) => {
            setPageVisibility(condition, questionAttributeKey, optionId);
        });
    };

    // const TextLengthHandleInputChange = (e) => {
    //     console.log('TextLengthHandleInputChange ***', e);
    //     handleInputChange(e);
    // };

    function getQuestionInputField(question, inputs, handleInputChange) {
        // This not the best way, but increases readability of data in requests
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
                    // handleChange={TextLengthHandleInputChange}
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
                    handleChange={ExtendedHandleInputChange}
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
        } else if (question.widget_type === 'autocomplete') {
            input = (
                <AutoComplete
                    question={question}
                    handleChange={handleInputChange}
                    inputs={inputs}
                />
            );
        }
        
        return input;
    }

    function getValidationMessage(question) {
        let validationMessage = <span />;

        // TODO: <09-05-22, claas>
        //   extract the array into a static variable. These could
        //   also be passed later from the backend
        if (['email', 'url', 'phone', 'integer', 'float'].includes(
            question.value_type
        )) {
            if (Object.keys(validationErrors).filter((k) => k.startsWith(question.attribute.key)
            ).length > 0) {
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
        return validationMessage;
    }

    function shouldQuestionBeHidden(question, inputs) {
        return question.question_conditions.some(condition => {
            if (Object.keys(inputs).some(key => { 
                var theKey = "option-" + condition.target_option_id + "____" + condition.source_key + "____" + condition.source_id;
                return key == theKey;
            })) {
                return false;
            }
            return true;
        })
    }

    const inputFields = section.pages.map((page) => {
        if (hiddenPageIds.includes(page.id)) {
            return <div id={`page-${page.id}-hidden`} />;
        }
        return (
            // FIXME: latest change to rdmo2  uses pages instead of questionsets, to make
            //  things obvious and readable "page" was included in the id of the div
            //  but latest css changes were refering to "questionset" in div id as css-selector
            // <div className="col-12 mb-3" id={`page-${page.id}`}>
            <div className="col-12 mb-3" id={`questionset-${page.id}`}>
                <div className="questionHelp">
                    <h5>{page.title}</h5>
                    <PinnableTooltip helptext={page.help} />
                </div>

                {
                    page.pagequestions.map((question) => {

                        const input = getQuestionInputField(question, inputs, handleInputChange);
                        const validationMessage = getValidationMessage(question);

                        let question_block = (
                            <div className="col-12">
                                <label
                                    aria-label={question.text}
                                    htmlFor="username"
                                    className="form-label"
                                >
                                    {question.text}
                                    {!question.is_optional && <span className="mandatory">*</span>}
                                    <PinnableTooltip helptext={question.help} />
                                </label>
                                {input}
                                <small className="form-text text-muted validation-field ">
                                    {validationMessage}
                                </small>
                            </div>
                        );
                        if (question.question_conditions && question.question_conditions.some(() => true)) {
                            return <Collapse in={!shouldQuestionBeHidden(question, inputs)} className="question-wrapper">
                                {question_block}
                            </Collapse>
                        }
                        else {
                            return question_block;
                        }
                    })
                }
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
