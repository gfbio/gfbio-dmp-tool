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
        // NOTE:  <30-05-22, Claas> // This needs to check for check boxes and treat them
        // separately. Out of the box it does not work as the value field of the checkbox is
        // fixed. It is always 'on' no matter if checked or not. Also it is no longer the case that
        // only the checkboxes that are ticked are transmitted on submit. So we
        // cannot check if that fields are contained in the form in the
        // backend. See also backend form.
        if (event.target.type === 'checkbox') {
            setInputs((prevInput) => ({
                ...prevInput,
                [event.target.name]: event.target.checked,
            }));
        } else {
            setInputs((prevInput) => ({
                ...prevInput,
                [event.target.name]: event.target.value,
            }));
        }
    };

    return {
        handleSubmit,
        handleInputChange,
        inputs,
    };
};

export default useSupportForm;
