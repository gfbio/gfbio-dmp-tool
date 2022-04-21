import React, {useContext} from 'react';
import RdmoContext from '../RdmoContext';
import checkBackendParameters from "../../utils/backend_context";

function LoggedInRouter() {
    const rdmoContext = useContext(RdmoContext);
    const backend = checkBackendParameters(rdmoContext);

    if (backend.isLoggedIn === 'false') {
        return (<h1>user not logged in</h1>);
    }
    return (<h1>user logged in</h1>);

}

export default LoggedInRouter;
