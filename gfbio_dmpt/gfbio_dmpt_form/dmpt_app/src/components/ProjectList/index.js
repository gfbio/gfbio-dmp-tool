import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';

function useProjectList() {
    console.log('-useProjectList Hook');
    const [projectList, setProjectList] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(' * use Effect hook');

        async function fetchProjectList() {
            console.log('  ** async function');
            try {
                setLoading(true);
                console.log('  ** try before await');
                const response = await axios.get(
                    `${API_ROOT}projects/projects/`
                );
                console.log('  ** try after await');
                setProjectList(response.data);
                console.log('  ** try aftert set project list');
            } catch (e) {
                ;
            } finally {
                console.log('  ** finally set loadionf');
                setLoading(false);
            }
        }

        console.log(' * call fetchProjectList');
        fetchProjectList();
    }, []);
    console.log('-before return and end of useProjectList hook');
    return [loading, projectList];
}

function ProjectList() {
    const [loading, projectList] = useProjectList();
    // FIXME: user permissions, only projects for specific user (admin rights = all projects ?)
    // SOLVED: default django object level permissions take care of this, depending on user and/or group
    console.log('projectList');
    console.log(projectList);
    let projects = <></>;
    if (projectList.length) {
        projects = projectList.map((item, index) => {
            return (<li id={index}>{item.title}</li>);
        });
    }

    return (
        <div>
            <h2>Project List</h2>
            <p>loading: {`${loading}`}</p>
            <ul>{projects}</ul>
        </div>
    );

};

export default ProjectList;