import { useState } from 'react';
import validator from 'validator';

// https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
const useDmptSectionForm = (callback, initialInputValues) => {
    const [inputs, setInputs] = useState(initialInputValues);
    const [validationErrors, setValidationErros] = useState({});
    const [disabledNavigation, setDisabledNavigation] = useState(false);

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        callback();
    };

    let validity;
    const handleValidation = (eventTarget, fieldType) => {
        if (fieldType === 'url') {
            if (
                !validator.isURL(eventTarget.value) &&
                eventTarget.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'email') {
            if (
                !validator.isEmail(eventTarget.value) &&
                eventTarget.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'phone') {
            if (
                !validator.isMobilePhone(eventTarget.value) &&
                eventTarget.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'integer') {
            if (
                !validator.isInt(eventTarget.value) &&
                eventTarget.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'float') {
            if (
                !validator.isFloat(eventTarget.value) &&
                eventTarget.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        }

        if (validity === false) {
            setValidationErros((prevValidationErrors) => ({
                ...prevValidationErrors,
                [eventTarget.name]: false,
            }));
            setDisabledNavigation(true);
        } else {
            setValidationErros((currentErrors) => {
                const copy = { ...currentErrors };
                delete copy[eventTarget.name];
                return copy;
            });
            setDisabledNavigation(false);
        }
    };

    const handleInputChange = (event, fieldType) => {
        event.persist();
        if ((event.target.type === 'checkbox' || event.target.type === 'autocomplete') && event.target.name in inputs) {
            const inputData = inputs;
            delete inputData[event.target.name];
            setInputs(inputData);
        } else {
            setInputs((prevInput) => ({
                ...prevInput,
                [event.target.name]: event.target.value,
            }));
        }
        handleValidation(event.target, fieldType);
    };

    return {
        handleSubmit,
        handleInputChange,
        inputs,
        validationErrors,
        disabledNavigation,
    };
};

export default useDmptSectionForm;
