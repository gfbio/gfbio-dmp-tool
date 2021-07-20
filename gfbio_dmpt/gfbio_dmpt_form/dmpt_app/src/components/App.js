import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Switch } from 'react-router-dom';

// TODO: to work when served in django template this prefix has to match
//  the urls.py + global urls.py entry -> currently (...) regex=r'submissions/ui/', (...)
// this with django
// eslint-disable-next-line no-unused-vars
const urlPrefix = '/curation/submissions/ui/';
// for updateview:
// const urlPrefix = '/curation/submissions/form/';

// this with npm start
// eslint-disable-next-line no-unused-vars
// const urlPrefix = '/';

const App = () => (
    <Switch>
        {/* <Route exact path={`${urlPrefix}`} component={SubmissionList}/> */}
        {/* <Route path={`${urlPrefix}:brokerSubmissionId/`} */}
        {/*    component={SubmissionDetail}/> */}
        {/* <Route path={`${urlPrefix}:brokerSubmissionId/`} */}
        {/*    component={DetailBoard}/> */}
    </Switch>
);

export default App;
