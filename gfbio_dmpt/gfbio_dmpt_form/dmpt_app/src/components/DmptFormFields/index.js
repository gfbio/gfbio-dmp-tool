import React, { useState } from "react";
import PropTypes from 'prop-types';
import TextInput from './textinput';
import TextArea from './textarea';
import Select from './select';
import Radio from './radio';
import CheckBox from './checkbox';
import PinnableTooltip from './pinnableTooltip';

function DmptFormFields(props) {
    const { section, handleInputChange, inputs, validationErrors, language } =
        props;
    // TODO: page seems to be in rdmo 2 what quesitionset was in rdmo 1
    //  although questionsets still exist, the import of the gfbio catalog put
    //  everything that was formerly a questionset into a page
    console.log(
        '------------- DmptFormFields | SECTION -----------------------------'
    );
    console.log(section);
    console.log('---------------------------');

    const getMandatoryMessage = (isOptional, lang) => {
        if (isOptional) {
            return <span />;
        }
        if (lang?.shortCode === 'DE') {
            return (
                <span className="mandatory">
                    (Dieses Feld ist erforderlich)
                </span>
            );
        }
        return <span className="mandatory">(This field is mandatory)</span>;
    };



    const setConditions = (question) => {
        section.conditions.forEach((condition) => {
            // console.log('condition ', condition);
            // source
            if (condition.source_key === question.attribute.key) {
                console.log(question.attribute.key, ' is source ');
                console.log('condition:', condition);
                console.log('------------------------------');
                // once source confirmed, it can be assumed that targetoption is part of this questions options
                // otherwise it makes no sense anyways. TARGETING condition.element_keys
            }
            // element-to-affect
            condition.elements.forEach((element) => {
                if (element.element_key === question.attribute.key) {
                    console.log(
                        question.attribute.key,
                        ' (contained in page',
                        element.page_id,
                        ') is element to affect by ',
                        condition.source_key
                    );
                }
            });
        });
    };

    const getHiddenPageIdsFromConditionals = (_section) => {
        let hiddenIds = [];
        _section.conditions.forEach((condition) => {
            condition.elements.forEach((element) => {
                hiddenIds.push(element.page_id);
            });
        });
        return hiddenIds;
    };

    const [hiddenPageIds, setHiddenPageIds] = useState(getHiddenPageIdsFromConditionals(section));

    const ExtendedHandleInputChange = (e, optionId, questionAttributeKey) => {
        console.log('MY --- __handleInputChange, trigger also regular inputchange ', optionId);
        section.conditions.forEach((condition) => {
            if (condition.source_key === questionAttributeKey && condition.target_option_id === optionId) {
                console.log('REMOVE PAGE ID FROM HIDDEN');
                const ids = hiddenPageIds;
                condition.elements.forEach((element) => {
                    console.log('remove element of condition ', condition);
                    const removed = ids.splice(ids.indexOf(element.page_id), 1);
                    // ids.pop(element.page_id);
                });
                setHiddenPageIds(ids);
            }
            else if (condition.source_key === questionAttributeKey && condition.target_option_id !== optionId) {
                console.log('ADD PAGE ID TO HIDDEN');
                const ids = hiddenPageIds;
                condition.elements.forEach((element) => {
                    if (!ids.includes(element.page_id)) {
                        ids.push(element.page_id);
                        console.log('add element of condition ', condition);
                    }
                });
                setHiddenPageIds(ids);
            }
        });
        handleInputChange(e);
    };


    const inputFields = section.pages.map((page) => {
        console.log('------------- PAGE -----------------------------');
        console.log(page.id);
        console.log('hiddePageIds ', hiddenPageIds);
        // TODO: if a question has to be hidden due to a condition (e.g. physical object)
        //  the current order of html-elements and layout, makes it neccessary to hide
        //  the page that contains the question (to also hide header +  texts etc.).
        //  If hiding a whole page of a section is causing problems, the consequence
        //  would be to re-arrange elements or at least ids to hide on question level.
        if (hiddenPageIds.includes(page.id)) {
            return (
                <div>
                    <h4>hidden pageid: {page.id}</h4>
                </div>
            );
        }
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

                    // ------------------------condition prototyping------------------------------
                    // setConditions(question);

                    // ------------------------------------------------------

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
