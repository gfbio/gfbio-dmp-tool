import React, {useContext, useState} from 'react';
import RdmoContext from '../RdmoContext';
import {checkBackendParameters} from '../../utils/backend_context';

const useDmptForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    const handleSubmit = (event) => {
        // console.log('\nuseDmptForm | handleSubmit | before callback | ', event.submitter);
        // console.log(event);
        if (event) {
            event.preventDefault();
        }
        // console.log('inputs before callback | ', inputs);

        rdmoContext.assignFormData(Object.assign(rdmoContext.form_data, inputs));

        // console.log('rdmoContext form_data before callback | ', rdmoContext.form_data);
        // FIXME: currently only "next"handler is provided, thus no going back to sections
        //  this needs some logic here.
        callback();
    };

    const handleInputChange = (event, item, valueId) => {
        event.persist();
        const { target, optionId } = event;

        // const val = target.type === 'checkbox' ? target.checked : target.value;
        const val = target.value;

        let vId = false;
        // if ((target.name in inputs) && ('valueId' in inputs[target.name])) {
        //     vId = inputs[target.name].valueId;
        // }
        if (valueId !== undefined) {
            vId = valueId;
        }

        console.log('\nuseDmptForm | handleInputChange | ', target.name, ', ', target.type, ', ', target.value, ' optionId ', optionId, ' targetid ', vId);
        console.log('context formdata ', rdmoContext.form_data);
        // if (target.type === 'checkbox') {
        //     console.log('is checkbox | checked ', target.checked);
        //     if (target.checked === false && Object.prototype.hasOwnProperty.call(rdmoContext.form_data, target.name)){
        //         const f = rdmoContext.form_data;
        //         console.log('target in context formdata ', rdmoContext.form_data[target.name]);
        //         delete f[target.name];
        //         rdmoContext.assignFormData(f);
        //     }
        // }

        console.log('inputs ', inputs);
        // console.log((target.name in inputs));
        // console.log(('valueId' in inputs[target.name]));
        // console.log('evnt | ', event);
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
                valueId: vId,
                option: optionId,
            }
        }));
        // rdmoContext.assignFormData(Object.assign(rdmoContext.form_data, inputs));
        console.log('inputs after set | ', inputs);
    };
    return {
        handleSubmit,
        handleInputChange,
        inputs
    };
};

export default useDmptForm;
