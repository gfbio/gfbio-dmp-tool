import React, {useState} from 'react';
// eslint-disable-next-line no-unused-vars
import {Route, Switch} from 'react-router-dom';
import DmptStart from './DmptStart';
import RdmoContext from './RdmoContext';
import ProjectList from './ProjectList';
import {URL_PREFIX} from '../constants/api/api_constants';
import LoggedInRouter from "./UserLoggedInRouter/refactor_index";

const App = () => {

    // https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context
    // const [sections, setSections] = useState({});
    // const [sectionsIndex, setSectionsIndex] = useState(0);
    // const [sectionsSize, setSectionsSize] = useState({});

    // const [questionSets, setQuestionSets] = useState({});
    // const [questions, setQuestions] = useState({});
    // const [options, setOptions] = useState({});

    // const [formData, setFormData] = useState({});

    // const [projectId, setProjectId] = useState(-1);
    // const [projectValues, setProjectValues] = useState({});

    // const [dmptProjectId, setDmptProjectId] = useState(-1);
    // const [issue, setIssue] = useState('');

    const [backendContext, setBackendContext] = useState({});

    // const assignSections = (data) => {
    //     setSections(data);
    // };
    //
    // const assingSectionsIndex = (index) => {
    //     setSectionsIndex(index);
    // };
    //
    // const assingSectionsSize = (size) => {
    //     setSectionsSize(size);
    // };
    //
    // const assignQuestionSets = (data) => {
    //     setQuestionSets(data);
    // };
    //
    // const assignQuestions = (data) => {
    //     setQuestions(data);
    // };
    //
    // const assignOptions = (data) => {
    //     setOptions(data);
    // };
    //
    // const assignFormData = (data) => {
    //     setFormData(data);
    // };
    //
    // const assignProjectId = (data) => {
    //     setProjectId(data);
    // };
    //
    // const assignProjectValues = (data) => {
    //     setProjectValues(data);
    // };
    //
    // const assignDmptProjectId = (data) => {
    //     setDmptProjectId(data);
    // };
    //
    // const assignIssue = (data) => {
    //     setIssue(data);
    // };

    const assignBackendContext = (data) => {
        setBackendContext(data);
    };

    const rdmoContext = {
        // section_data: sections,
        // sections_index: sectionsIndex,
        // sections_size: sectionsSize,
        // question_set_data: questionSets,
        // questions_data: questions,
        // options_data: options,
        // form_data: formData,
        // project_id: projectId,
        // project_values: projectValues,
        backend_context: backendContext,
        // dmpt_project_id: dmptProjectId,
        // issue_key: issue,
        // assignSections,
        // assingSectionsIndex,
        // assingSectionsSize,
        // assignQuestionSets,
        // assignQuestions,
        // assignOptions,
        // assignFormData,
        // assignProjectId,
        // assignProjectValues,
        assignBackendContext,
        // assignDmptProjectId,
        // assignIssue,
    };

    return (
        <RdmoContext.Provider value={rdmoContext}>
            <Switch>
                {/* <Route exact path={`${URL_PREFIX}`} */}
                {/*     component={UserLoggedInRouter} /> */}
                <Route exact path={`${URL_PREFIX}`}
                    component={LoggedInRouter}/>
                <Route exact path={`${URL_PREFIX}start`}
                    component={DmptStart}/>
                <Route path={`${URL_PREFIX}start/:projectId`}
                    component={DmptStart}/>
                <Route path={`${URL_PREFIX}projects`} component={ProjectList}/>
            </Switch>
        </RdmoContext.Provider>
    );
};

export default App;
