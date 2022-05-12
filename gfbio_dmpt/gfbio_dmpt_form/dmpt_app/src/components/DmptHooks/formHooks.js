import { useState } from 'react';
import validator from 'validator';

// https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
const useDmptSectionForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const [validationErrors, setValidationErros] = useState({});
    const [disabledNavigation, setDisabledNavigation] = useState(false);

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        console.log(
            'formHooks | useDmptSectionForm | handleSubmit | inputs: ',
            inputs
        );
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

    // TODO: enrich data in form with more information from questions and options
    const handleInputChange = (event, fieldType) => {
        // const handleInputChange = (event) => {
        event.persist();
        setInputs((prevInput) => ({
            ...prevInput,
            [event.target.name]: event.target.value,
        }));
        handleValidation(event, fieldType);

        console.log(
            'formHooks | useDmptSectionForm | handleChange | inputs: ',
            inputs
        );
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
