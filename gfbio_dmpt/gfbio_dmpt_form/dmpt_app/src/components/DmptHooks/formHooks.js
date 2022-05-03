import { useState } from 'react';

// https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
const useDmptSectionForm = (callback) => {
    const [inputs, setInputs] = useState({});

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

    // TODO: enrich data in form with more information from questions and options
    const handleInputChange = (event) => {
        // const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
        // console.log('formHooks | useDmptSectionForm | handleChange | inputs: ', inputs);
    };
    return {
        handleSubmit,
        handleInputChange,
        inputs,
    };
};

export default useDmptSectionForm;
