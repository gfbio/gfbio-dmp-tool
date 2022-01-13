import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Switch } from 'react-router-dom';
import DmptStart from './DmptStart';
import RdmoContext from './RdmoContext';
import ProjectList from './ProjectList';
import UserLoggedInRouter from './UserLoggedInRouter';
import { URL_PREFIX } from '../constants/api/api_constants';
import Summary from './Summary';

const App = () => {

    // https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context
    const [sections, setSections] = useState({});
    const [sectionsIndex, setSectionsIndex] = useState(0);
    const [sectionsSize, setSectionsSize] = useState({});

    const [questionSets, setQuestionSets] = useState({});
    const [questions, setQuestions] = useState({});
    const [options, setOptions] = useState({});

    const [formData, setFormData] = useState({});

    const [projectId, setProjectId] = useState(-1);

    const [projectValues, setProjectValues] = useState({});

    // const [recentSubmit, setRecentSubmit] = useState(false);
    // const [recentUpdate, setRecentUpdate] = useState(false);

    // const [userId, setUserId] = useState('-1');
    // const [userToken, setUserToken] = useState('-1');

    const [backendContext, setBackendContext] = useState({});

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

    const assignFormData = (data) => {
        setFormData(data);
    };

    const assignProjectId = (data) => {
        setProjectId(data);
    };

    const assignProjectValues = (data) => {
        setProjectValues(data);
    };

    // const assignRecentSubmit = (data) => {
    //     setRecentSubmit(data);
    // };
    //
    // const assignRecentUpdate = (data) => {
    //     setRecentUpdate(data);
    // };
    // const assignUserId = (data) => {
    //     console.log('ASSIGN USER ID ', data);
    //     setUserId(data);
    // };
    //
    // const assignUserToken = (data) => {
    //     setUserToken(data);
    // };

    const assignBackendContext = (data) => {
        console.log('ASSIGN BACKEND CONTEXT ', data);
        setBackendContext(data);
    };

    const rdmoContext = {
        section_data: sections,
        sections_index: sectionsIndex,
        sections_size: sectionsSize,
        question_set_data: questionSets,
        questions_data: questions,
        options_data: options,
        form_data: formData,
        project_id: projectId,
        project_values: projectValues,
        backend_context: backendContext,
        // recent_submit: recentSubmit,
        // recent_update: recentUpdate,
        // user_id: userId,
        // user_token: userToken,
        assignSections,
        assingSectionsIndex,
        assingSectionsSize,
        assignQuestionSets,
        assignQuestions,
        assignOptions,
        assignFormData,
        assignProjectId,
        assignProjectValues,
        assignBackendContext,
        // assignRecentSubmit,
        // assignRecentUpdate
        // assignUserId,
        // assignUserToken
    };

    return (
        <RdmoContext.Provider value={rdmoContext}>
            <Switch>
                <Route exact path={`${URL_PREFIX}`}
                    component={UserLoggedInRouter} />
                <Route exact path={`${URL_PREFIX}start`}
                    component={DmptStart} />
                <Route path={`${URL_PREFIX}start/:projectId`}
                    component={DmptStart} />
                <Route path={`${URL_PREFIX}projects`} component={ProjectList} />
                <Route path={`${URL_PREFIX}summary/:projectId`}
                    component={Summary} />
                {/* <Route path={`${URL_PREFIX}:brokerSubmissionId/`} */}
                {/*    component={SubmissionDetail}/> */}
                {/* <Route path={`${URL_PREFIX}:brokerSubmissionId/`} */}
                {/*    component={DetailBoard}/> */}
            </Switch>
        </RdmoContext.Provider>
    );
};

export default App;
