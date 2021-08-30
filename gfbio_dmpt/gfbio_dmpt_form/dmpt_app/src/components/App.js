import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Switch } from 'react-router-dom';
import Welcome from './Welcome';
import Catalogs from './Catalogs';
import DmptStart from './DmptStart';
import RdmoContext from './RdmoContext';

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

const App = () => {

    // https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context
    const [sections, setSections] = useState({});
    const [sectionsIndex, setSectionsIndex] = useState(0);
    const [sectionsSize, setSectionsSize] = useState({});

    const [questionSets, setQuestionSets] = useState({});
    const [questions, setQuestions] = useState({});
    const [options, setOptions] = useState({});

    const assignSections = (data) => {
        setSections(data);
    };

    const assingSectionsIndex = (index) => {
        setSectionsIndex(index);
    };

    const assingSectionsSize = (size) => {
        setSectionsSize(size);
    };

    const assignQuestionSets = (data) => {
        setQuestionSets(data);
    };

    const assignQuestions = (data) => {
        setQuestions(data);
    };

    const assignOptions = (data) => {
        setOptions(data);
    };

    const rdmoContext = {
        section_data: sections,
        sections_index: sectionsIndex,
        sections_size: sectionsSize,
        question_set_data: questionSets,
        questions_data: questions,
        options_data: options,
        assignSections,
        assingSectionsIndex,
        assingSectionsSize,
        assignQuestionSets,
        assignQuestions,
        assignOptions
    };

    return (
        <RdmoContext.Provider value={rdmoContext}>
            <Switch>
                <Route exact path={`${urlPrefix}`} component={Welcome} />
                <Route path={`${urlPrefix}catalogs`} component={Catalogs} />
                <Route path={`${urlPrefix}start`} component={DmptStart} />
                {/* <Route path={`${urlPrefix}:brokerSubmissionId/`} */}
                {/*    component={SubmissionDetail}/> */}
                {/* <Route path={`${urlPrefix}:brokerSubmissionId/`} */}
                {/*    component={DetailBoard}/> */}
            </Switch>
        </RdmoContext.Provider>
    );
};

export default App;
