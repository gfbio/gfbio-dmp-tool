import React from 'react';
import ProjectList from '../ProjectList';
import DmptStart from '../DmptStart';

function UserLoggedInRouter() {
    console.log('USerloggedInRouter');
    let backend = {};
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
