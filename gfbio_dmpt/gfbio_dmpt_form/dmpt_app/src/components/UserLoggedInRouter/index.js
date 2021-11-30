import React from 'react';
import ProjectList from '../ProjectList';
import DmptStart from '../DmptStart';

function UserLoggedInRouter() {
    console.log('USerloggedInRouter');
    let backend = {};
    // TODO: local development
    backend.isLoggedIn = 'false';
    backend.token = 'b20259c17fae3f74efef7746c4f4e3d32d2d1d72';
    // --------------------------------------------------------
    if (window.props !== undefined) {
        backend = window.props;
    }
    console.log('backend context:');
    console.log(backend);
    if (backend.isLoggedIn === 'false') {
        return (<DmptStart isLoggedIn={backend.isLoggedIn}
            userToken={backend.token} />);
    }
    return (
        <ProjectList />
    );

}

export default UserLoggedInRouter;
