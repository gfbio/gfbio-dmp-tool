import React, { useContext, useState } from 'react';
import RdmoContext from '../RdmoContext';
import { checkBackendParameters } from '../../utils/backend_context';

const useDmptForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    const handleSubmit = (event) => {
        console.log('useDmptForm | handleSubmit | before callback | ', event);
        if (event) {
            event.preventDefault();
        }
        callback();
    };

    const handleInputChange = (event) => {
        event.persist();
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        console.log('\nuseDmptForm | handleInputChange | ', target.name, ', ', target.type, ', ', target.value );

        setInputs(inputs => ({
            ...inputs,
            [target.name]: value
        }));
        console.log('inputs after set | ', inputs);
    };
    return {
        handleSubmit,
        handleInputChange,
        inputs
    };
};

export default useDmptForm;
