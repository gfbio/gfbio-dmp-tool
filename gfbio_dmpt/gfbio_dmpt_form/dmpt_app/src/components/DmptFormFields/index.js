import React, { useState } from 'react';
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
    console.log('DmptFormFields ------------------------------');
    // console.log('inputs: ', inputs);
    // TODO: page seems to be in rdmo 2 what quesitionset was in rdmo 1
    //  although questionsets still exist, the import of the gfbio catalog put
    //  everything that was formerly a questionset into a page
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

    const isTargetOptionInInputs = (_inputs, condition) => {
        let result = false;
        Object.keys(_inputs).forEach((key)=>{
            // console.log('\tisTargetOptionInInputs key ', key, ' val ', _inputs[key]);
            if (_inputs[key] === `${condition.target_option_id}`) {
                result = true;
            }
        });
        return result;
    };

    const getHiddenPageIdsFromConditionals = (_section, _inputs, checkForInitialData=false) => {
        const hiddenIds = [];
        _section.conditions.forEach((condition) => {
            condition.elements.forEach((element) => {
                if (checkForInitialData) {
                    if (isTargetOptionInInputs(_inputs, condition) === false) {
                        hiddenIds.push(element.page_id);
                    }
                }
                else {
                    hiddenIds.push(element.page_id);
                }
            });
        });
        return hiddenIds;
    };

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

                // TODO: this and other below does the trick in genaral
                //  but it takes not into consideration that if values are already set in options,
                //  according to conditions, it will not act to already set values

                let indexInHidden =ids.indexOf(element.page_id);
                let indexInInitial = initialHiddenPageIds.indexOf(element.page_id);
                console.log('REMOVE ', element.page_id, ' index in hidden ', indexInHidden, ' | index in initial ', indexInInitial);
                ids.splice(indexInHidden, 1);
                console.log('NEW ids ', ids);
                console.log('curent hidden ', hiddenPageIds);
                console.log('inputs ', inputs);
                console.log('condition ', condition);
                let additionalRemovals = [];
                ids.forEach((id) => {
                    console.log('\tid (new/hidden): ', id);
                    section.conditions.forEach((condition) => {
                        console.log('\t\tchecking condition ', condition);
                        condition.elements.forEach((element) => {
                            if (element.page_id === id) {
                                console.log('\t\t\tthis one is hidden ', element);
                                console.log('\t\t\tisTargetOptionInInputs ', isTargetOptionInInputs(inputs, condition));
                                if (isTargetOptionInInputs(inputs, condition)) {
                                    additionalRemovals.push(element.page_id);
                                }
                            }
                        });
                    });
                });
                console.log('REMOVE ALSO ', additionalRemovals);
                additionalRemovals.forEach((remove)=>{
                    ids.splice(ids.indexOf(remove));
                });

                // console.log('isTargetOptionInInputs ', isTargetOptionInInputs(inputs, condition));
                // console.log('getHiddenPageIdsFromConditionals ', getHiddenPageIdsFromConditionals(section, inputs, true));

            });
            setHiddenPageIds(ids);
        } else if (
            condition.source_key === questionAttributeKey &&
            condition.target_option_id !== optionId
        ) {
            let ids = hiddenPageIds;
            condition.elements.forEach((element) => {
                if (!ids.includes(element.page_id)) {
                    let indexInHidden =ids.indexOf(element.page_id);
                    let indexInInitial = initialHiddenPageIds.indexOf(element.page_id);
                    console.log('ADD ', element.page_id, ' index in hidden ', indexInHidden, ' | index in initial ', indexInInitial);
                    console.log('\tcombined ', initialHiddenPageIds.slice(indexInInitial, initialHiddenPageIds.length));
                    ids = initialHiddenPageIds.slice(indexInInitial, initialHiddenPageIds.length);
                    // ids.push(element.page_id);
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
        // handleInputChange(e);
    };

    const inputFields = section.pages.map((page) => {
        // TODO: if a question has to be hidden due to a condition (e.g. physical object)
        //  the current order of html-elements and layout, makes it neccessary to hide
        //  the page that contains the question (to also hide header +  texts etc.).
        //  If hiding a whole page of a section is causing problems, the consequence
        //  would be to re-arrange elements or at least ids to hide on question level.
        console.log('\n---------------\nhidden page ids ', hiddenPageIds);
        console.log('Initialhidden page ids ', initialHiddenPageIds);
        if (hiddenPageIds.includes(page.id)) {
            return <div id={`page-${page.id}-hidden`} />;
        }
        return (
            <div className="col-12 mb-3" id={`page-${page.id}`}>
                <div className="questionHelp">
                    <h5>{page.title}</h5>
                    <PinnableTooltip helptext={page.help} />
                </div>

                {page.pagequestions.map((question) => {
                    const mandatoryMessage = getMandatoryMessage(
                        question.is_optional,
                        language
                    );

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
