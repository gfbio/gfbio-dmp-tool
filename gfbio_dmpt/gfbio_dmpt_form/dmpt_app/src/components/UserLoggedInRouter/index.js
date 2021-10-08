import React from 'react';
import ProjectList from '../ProjectList';
import DmptStart from '../DmptStart';

function UserLoggedInRouter() {
    console.log('USerloggedIn');
    let backend = {};
    if (window.props !== undefined) {
        backend = window.props;
    }
    console.log(backend.isLoggedIn);
    if (backend.isLoggedIn === 'false') {
        return (<DmptStart isLoggedIn={backend.isLoggedIn} />);
    }
    return (
        <ProjectList />
    );

}

export default UserLoggedInRouter;
