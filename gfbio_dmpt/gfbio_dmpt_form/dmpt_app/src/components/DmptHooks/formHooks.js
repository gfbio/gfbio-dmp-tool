import { useState } from 'react';
import validator from 'validator';

// https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
const useDmptSectionForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const [fieldValidationMessage, setFieldValidationMessage] = useState('');

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

    const validateInput = (input, fieldType) => {
        if (fieldType === "email") {
          if (validator.isEmail(input)) {
              setFieldValidationMessage('Valid Email :)');
          } else {
              setFieldValidationMessage('Enter valid Email!');
          }
        } else if (fieldType === "url") {
          if (validator.isURL(input)) {
              setFieldValidationMessage('Valid  :)');
          } else {
              setFieldValidationMessage('Enter valid URL!');
          }
        } else if (fieldType === "phone") {
          if (validator.isMobilePhone(input)) {
              setFieldValidationMessage('Valid phone:)');
          } else {
              setFieldValidationMessage('Enter valid phone!');
          }
        };
    };

    // TODO: enrich data in form with more information from questions and options
    const handleInputChange = (event, type) => {
        // const handleInputChange = (event) => {
        event.persist();
        setInputs((prevInput) => ({
            ...prevInput,
            [event.target.name]: event.target.value,
        }));

        validateInput(event.target.value, type);
        // console.log(
        //     'formHooks | useDmptSectionForm | handleChange | inputs: ',
        //     inputs
        );
    };
    return {
        handleSubmit,
        handleInputChange,
        inputs,
        fieldValidationMessage
    };
};

export default useDmptSectionForm;
