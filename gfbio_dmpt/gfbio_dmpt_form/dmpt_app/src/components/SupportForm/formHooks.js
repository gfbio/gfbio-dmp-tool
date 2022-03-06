import React, { useContext, useState } from 'react';
import axios from 'axios';
import { PROJECT_API_ROOT } from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import { checkBackendParameters } from '../../utils/backend_context';

// FIXME: refactor move to general module
function getCookie(name) {
    // from https://docs.djangoproject.com/en/stable/ref/csrf/
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === `${name}=`) {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}

const useSupportForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);

    const handleSubmit = (event) => {
        console.log('handle submit');
        console.log(inputs);
        if (event) {
            event.preventDefault();
        }

        // const csrftoken = getCookie('csrftoken');
        // console.log({ inputs });
        // const data = inputs;
        // data.rdmo_project_id = 0;
        // TODO: post is empty in django even  witzh hardcoded vals like below
        // try {
        // axios.post(
        //     `${PROJECT_API_ROOT}support/`,
        //     { email: 'bla@dfg.de' },
        //     {
        //         headers: {
        //             Authorization: `Token ${rdmoContext.backend_context.token}`,
        //             // 'Content-Type': 'application/json',
        //             'X-CSRFToken': csrftoken
        //         }
        //     }
        // ).then((res) => {
        //     console.log(res);
        // }).catch((error)=>{
        //     console.log('ERROR');
        //     console.log(error);
        // });
        // } catch (e) {
        //     console.log('ERROR');
        //     console.log(e);
        // } finally {
        //     ;
        // }

        callback();
    };

    const handleInputChange = (event) => {
        event.persist();
        // console.log('handle change ', event.target.name, ' ', event.target.value, ' ');
        // console.log(event.target);
        const { target } = event;
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
