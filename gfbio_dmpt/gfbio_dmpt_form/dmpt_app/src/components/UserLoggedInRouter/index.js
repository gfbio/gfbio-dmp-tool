import React, { useContext } from 'react';
import ProjectList from '../ProjectList';
import DmptStart from '../DmptStart';
import { checkBackendParameters } from '../../utils/backend_context';
import RdmoContext from '../RdmoContext';

function UserLoggedInRouter() {
    const rdmoContext = useContext(RdmoContext);
    const backend = checkBackendParameters(rdmoContext);

    if (backend.isLoggedIn === 'false') {
        return (
            <DmptStart />);
    }
    return (
        <ProjectList />
    );

}

export default UserLoggedInRouter;
