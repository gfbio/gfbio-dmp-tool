import { useContext } from 'react';
import RdmoContext from '../components/RdmoContext';

export function checkBackendParamters() {
    const rdmoContext = useContext(RdmoContext);
    let backend = {};
    backend.isLoggedIn = 'false';
    if (window.props !== undefined) {
        console.log('backend context DEFINED');
        backend = window.props;
    }
    rdmoContext.assignBackendContext(backend);
    return backend;
};
