import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import RdmoContext from './RdmoContext';
import ProjectList from './ProjectList';
import { URL_PREFIX } from './api/constants';
import LoggedInRouter from './LoggedInRouter';

const App = () => {
    // https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context
    const [backendContext, setBackendContext] = useState({});
    const assignBackendContext = (data) => {
        setBackendContext(data);
    };

    const rdmoContext = {
        backend_context: backendContext,
        assignBackendContext,
    };

    return (
        <RdmoContext.Provider value={rdmoContext}>
            <Switch>
                {/* <Route exact path={`${URL_PREFIX}`} */}
                {/*     component={LoggedInRouter} /> */}
                <Route
                    exact
                    path={`${URL_PREFIX}`}
                    component={LoggedInRouter}
                />
                {/* <Route */}
                {/*     exact */}
                {/*     path={`${URL_PREFIX}start`} */}
                {/*     component={DmptStart} */}
                {/* /> */}
                {/* <Route */}
                {/*     path={`${URL_PREFIX}start/:projectId`} */}
                {/*     component={DmptStart} */}
                {/* /> */}
                <Route path={`${URL_PREFIX}projects`} component={ProjectList} />
            </Switch>
        </RdmoContext.Provider>
    );
};

export default App;
