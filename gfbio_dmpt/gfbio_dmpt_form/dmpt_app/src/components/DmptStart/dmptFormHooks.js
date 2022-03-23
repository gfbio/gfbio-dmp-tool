import React, { useContext, useState } from 'react';
import RdmoContext from '../RdmoContext';
import { checkBackendParameters } from '../../utils/backend_context';

const useDmptForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    const handleSubmit = (event) => {
        console.log('\nuseDmptForm | handleSubmit | before callback | ', event.submitter);
        console.log(event);
        if (event) {
            event.preventDefault();
        }
        console.log('inputs before callback | ', inputs);

        rdmoContext.assignFormData(Object.assign(rdmoContext.form_data, inputs));

        console.log('rdmoContext form_data before callback | ', rdmoContext.form_data);
        // FIXME: currently only "next"handler is provided, thus no going back to sections
        //  this needs some logic here.
        callback();
    };

    const handleInputChange = (event, item) => {
        event.persist();
        const { target } = event;
        const val = target.type === 'checkbox' ? target.checked : target.value;

        // FIXME: assingin formdata below overwrites valueId from first initialization from projectdata
        let vId = false;
        if ((target.name in inputs) && ('valueId' in inputs[target.name])) {
            vId = inputs[target.name].valueId;
        }

        console.log('\nuseDmptForm | handleInputChange | ', target.name, ', ', target.type, ', ', target.value);
        // console.log('item | ', item);
        // console.log('prop test ', (target.name in inputs));
        // console.log('prop test ', ('valueId' in inputs[target.name]));

        // setInputs(inputs => ({
        //     ...inputs,
        //     [target.name]: value
        // }));

        // if (
        //     e.target.name.startsWith('checkbox') &&
        //     formData.hasOwnProperty(e.target.name)
        // ) {
        //     delete formData[e.target.name];
        // } else {

        setInputs(inputs => ({
            ...inputs,
            [target.name]: {
                value: val,
                question: item,
                valueId: vId
            }
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
