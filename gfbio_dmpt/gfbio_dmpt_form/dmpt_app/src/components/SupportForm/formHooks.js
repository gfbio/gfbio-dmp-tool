import React, { useState } from 'react';

const useSupportForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const handleSubmit = (event) => {
        console.log('handle submit');
        if (event) {
            event.preventDefault();
        }
        callback();
    };

    const handleInputChange = (event) => {
        event.persist();
        // console.log('handle change ', event.target.name, ' ', event.target.value, ' ');
        // console.log(event.target);
        const {target} = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setInputs(inputs => ({
            ...inputs,
            [target.name]: value
        }));
    };
    return {
        handleSubmit,
        handleInputChange,
        inputs
    };
};

export default useSupportForm;
