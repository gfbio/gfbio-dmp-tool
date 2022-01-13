import React from 'react';
import ProjectList from '../ProjectList';
import DmptStart from '../DmptStart';
import { checkBackendParamters } from '../../utils/backend_context';

function UserLoggedInRouter() {
    // const rdmoContext = useContext(RdmoContext);
    console.log('USerloggedInRouter');
    const backend = checkBackendParamters();
    // rdmoContext.assignBackendContext(backend);
    // let backend = {};
    // // TODO: local development
    // backend.isLoggedIn = 'false';
    // backend.token = 'b20259c17fae3f74efef7746c4f4e3d32d2d1d72';
    // // --------------------------------------------------------
    // if (window.props !== undefined) {
    //     console.log('backend context DEFINED');
    //     backend = window.props;
    //     // console.log(backend);
    //     // rdmoContext.assignBackendContext(backend);
    //     // rdmoContext.assignUserId(backend.user_id);
    //     // rdmoContext.assignUserToken(backend.token);
    // }
    // else {
    //     console.log('backend context UNDEFINED');
    // }
    console.log('backend context:');
    console.log(backend);
    if (backend.isLoggedIn === 'false') {
        return (
            <DmptStart />);
    }
    return (
        <ProjectList />
    );

}

export default UserLoggedInRouter;
