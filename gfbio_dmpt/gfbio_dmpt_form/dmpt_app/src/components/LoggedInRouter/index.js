import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import RdmoContext from '../RdmoContext';
import checkBackendParameters from '../../utils/backend_context';
import DmptList from '../DmptList';
import DmptSectionNavigation from '../DmptSectionNavigation';
import DmptFormLoader from '../DmptFormLoader';

function LoggedInRouter() {
    const rdmoContext = useContext(RdmoContext);
    const backend = checkBackendParameters(rdmoContext);

    const { id } = useParams();

    if (backend.isLoggedIn === 'false') {
        return (
            <DmptSectionNavigation
                token={backend.token}
                catalogId={backend.catalog_id}
            />
        );
    }

    if (id === 'new') {
        return (
            <DmptSectionNavigation
                token={backend.token}
                catalogId={backend.catalog_id}
            />
        );
    }
    if (id !== undefined) {
        return (
            <DmptFormLoader
                token={backend.token}
                catalogId={backend.catalog_id}
                dmptProjectId={id}
            />
        );
    }

    return <DmptList token={backend.token} />;
}

export default LoggedInRouter;
