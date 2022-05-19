import { useState } from 'react';

// https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
const useSupportForm = (callback, initialValues) => {
    const [inputs, setInputs] = useState(initialValues);

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        callback(inputs);
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs((prevInput) => ({
            ...prevInput,
            [event.target.name]: event.target.value,
        }));
    };

    return {
        handleSubmit,
        handleInputChange,
        inputs,
    };
};

export default useSupportForm;
