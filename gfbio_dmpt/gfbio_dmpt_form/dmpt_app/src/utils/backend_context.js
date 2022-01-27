import { Redirect } from 'react-router-dom';
import { URL_PREFIX } from '../constants/api/api_constants';
import React from 'react';

export function checkBackendParameters(rdmoContext) {
    let backend = {};
    backend.isLoggedIn = 'false';
    if (window.props !== undefined) {
        backend = window.props;
    }
    rdmoContext.assignBackendContext(backend);
    return backend;
};

// TODO: also delete rdmo project immediatly ?
export function resetContext(rdmoContext) {
    rdmoContext.assignFormData({});
    rdmoContext.assignProjectId(-1);
    rdmoContext.assignProjectValues({});
    rdmoContext.assignDmptProjectId(-1);
};

// export function notLoggedInRedirect(backendContextLoggedIn) {
//     if (backendContextLoggedIn === 'false') {
//         return (
//             <Redirect
//                 push
//                 to={`${URL_PREFIX}`}
//             />
//         );
//     }
//     return <></>;
// };
