import React, { useContext } from 'react';
import RdmoContext from '../RdmoContext';
import checkBackendParameters from '../../utils/backend_context';
import DmptSectionNavigation from '../DmptSectionNavigation';

function LoggedInRouter() {
    const rdmoContext = useContext(RdmoContext);
    const backend = checkBackendParameters(rdmoContext);

    if (backend.isLoggedIn === 'false') {
        return <h1>user not logged in</h1>;
    }
    // return (<DmptSection token={backend.token} catalogId={backend.catalog_id}/>);
    console.log('LoggedInRouter | backend : ', backend);
    return (
        <DmptSectionNavigation
            token={backend.token}
            catalogId={backend.catalog_id}
        />
    );
}

export default LoggedInRouter;
