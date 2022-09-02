import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import RdmoContext from './RdmoContext';
import { URL_PREFIX } from './api/constants';
import LoggedInRouter from './LoggedInRouter';
import customMaterialTheme from './CustomMaterialTheme.js'
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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
        <ThemeProvider theme={customMaterialTheme}>
            <RdmoContext.Provider value={rdmoContext}>
                <Switch>
                    <Route
                        exact
                        path={`${URL_PREFIX}`}
                        component={LoggedInRouter}
                    />
                    <Route path={`${URL_PREFIX}:id`} component={LoggedInRouter} />
                </Switch>
            </RdmoContext.Provider>
        </ThemeProvider>
    );
};

export default App;
