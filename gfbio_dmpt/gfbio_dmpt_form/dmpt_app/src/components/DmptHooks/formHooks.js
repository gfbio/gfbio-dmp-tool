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
        console.log('formHooks | handleSubmit | event ', event);
        callback();
    };

    let validity;
    const handleValidation = (event, fieldType) => {
        if (fieldType === 'url') {
            if (
                !validator.isURL(event.target.value) &&
                event.target.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'email') {
            if (
                !validator.isEmail(event.target.value) &&
                event.target.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'phone') {
            if (
                !validator.isMobilePhone(event.target.value) &&
                event.target.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'integer') {
            if (
                !validator.isInt(event.target.value) &&
                event.target.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        } else if (fieldType === 'float') {
            if (
                !validator.isFloat(event.target.value) &&
                event.target.value !== ''
            ) {
                validity = false;
            } else {
                validity = true;
            }
        }

        if (validity === false) {
            setValidationErros((prevValidationErrors) => ({
                ...prevValidationErrors,
                [event.target.name]: false,
            }));
            setDisabledNavigation(true);
        } else {
            setValidationErros((currentErrors) => {
                const copy = { ...currentErrors };
                delete copy[event.target.name];
                return copy;
            });
            setDisabledNavigation(false);
        }
    };

    const handleInputChange = (event, fieldType) => {
        event.persist();
        // console.log('formHooks.js | handleInputChange | event.target : ', event.target);
        if (event.target.type === 'checkbox' && event.target.name in inputs) {
            const inputData = inputs;
            delete inputData[event.target.name];
            setInputs(inputData);
        } else {
            setInputs((prevInput) => ({
                ...prevInput,
                [event.target.name]: event.target.value,
            }));
        }
        // console.log('formHooks.js | handleInputChange | inputs : ', inputs);
        handleValidation(event, fieldType);
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
