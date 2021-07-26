import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Switch } from 'react-router-dom';
import Welcome from './Welcome';
import Catalogs from './Catalogs';
import DmptStart from './DmptStart';

// TODO: to work when served in django template this prefix has to match
//  the urls.py + global urls.py entry -> currently (...) regex=r'submissions/ui/', (...)
// TODO: use this prefix when development with django (-->  url('app/', views.DmptFrontendView.as_view()))
// eslint-disable-next-line no-unused-vars
// const urlPrefix = '/dmpt/app/';

// for updateview:
// const urlPrefix = '/curation/submissions/form/';

// TODO: use this prefix when developing with npm start
// eslint-disable-next-line no-unused-vars
const urlPrefix = '/';

const App = () => (
    <Switch>
        <Route exact path={`${urlPrefix}`} component={Welcome} />
        <Route path={`${urlPrefix}catalogs`} component={Catalogs} />
        <Route path={`${urlPrefix}start`} component={DmptStart} />
        {/* <Route path={`${urlPrefix}:brokerSubmissionId/`} */}
        {/*    component={SubmissionDetail}/> */}
        {/* <Route path={`${urlPrefix}:brokerSubmissionId/`} */}
        {/*    component={DetailBoard}/> */}
    </Switch>
);

export default App;
