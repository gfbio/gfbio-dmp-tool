import React, { useContext } from "react";
import RdmoContext from "../RdmoContext";
import checkBackendParameters from "../../utils/backend_context";
import DmptList from "../DmptList";

// import DmptSectionNavigation from "../DmptSectionNavigation";

function LoggedInRouter() {
    const rdmoContext = useContext(RdmoContext);
    const backend = checkBackendParameters(rdmoContext);

    if (backend.isLoggedIn === 'false') {
        return <h1>user not logged in</h1>;
    }

    console.log('LoggedInRouter | backend: ', backend);
    console.log('LoggedInRouter | context: ', rdmoContext);

    return (
        <DmptList token={backend.token}/>
        // TODO: integrate in list view and direct link
        // <DmptSectionNavigation
        //     token={backend.token}
        //     catalogId={backend.catalog_id}
        // />
    );
}

export default LoggedInRouter;
